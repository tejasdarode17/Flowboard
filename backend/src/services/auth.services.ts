import { JwtPayload } from '../types/jwtPayload';
import bcrypt from "bcryptjs";
import { RegisterInput, LoginInput } from "../validations/auth.validations"; //this is types we created in auth.validations
import prisma from "../lib/prisma";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import AppError from "../utils/AppError";
import { generateUsername } from '../utils/genrateUsername';
import { Prisma } from '@prisma/client';
import { GoogleTokenPayload } from '../types/googleTokenPayload';

export async function registerUser(data: RegisterInput) {
  const existingEmail = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingEmail) {
    throw new AppError("Email already taken", 409);
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username: data.username },
  });

  if (existingUsername) {
    throw new AppError("Username already taken", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      email: data.email,
      password: hashedPassword,
      mobile: data?.mobile ?? null
    },
  });

  const accessToken = generateAccessToken(user?.id);
  const refreshToken = generateRefreshToken(user?.id);

  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, accessToken, refreshToken };
};


export async function loginUser(data: LoginInput) {

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: data?.emailOrUsername }, { username: data?.emailOrUsername }],
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401)
  }

  const isMatch = await bcrypt.compare(data?.password, user?.password || "");
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const accessToken = generateAccessToken(user?.id);
  const refreshToken = generateRefreshToken(user?.id);

  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken };
};


export async function googleAuth({ email, name, picture, }: GoogleTokenPayload) {

  let user = await prisma.user.findUnique({ where: { email }, });

  //if user available in local just return 
  if (user) return user;

  const base = name || email.split("@")[0];

  // 2. create user with retry
  for (let i = 0; i < 2; i++) {
    const username = generateUsername(base);
    try {
      user = await prisma.user.create({
        data: {
          email,
          name: base,
          username,
          avatar: picture,
          provider: "google"
        },
      });

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        continue;
      }
      throw error;
    }
  }
  throw new Error("User creation failed");
};


export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      gitHubAccount: {
        select: {
          username: true,
          githubId: true
        },
      },
    }
  });
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword };
};


export async function getNewTokens(data: string) {
  const decoded = verifyRefreshToken(data) as JwtPayload;
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const newAccessToken = generateAccessToken(decoded?.userId);
  const newRefreshToken = generateRefreshToken(decoded?.userId);
  return { newAccessToken, newRefreshToken };
};
