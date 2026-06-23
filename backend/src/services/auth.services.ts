import { ChangeEmailOtpPayload, PasswordResetOtpPayload, SignUpOtpPayload } from './../types/otp.types';
import { JwtPayload } from '../types/jwtPayload';
import bcrypt from "bcryptjs";
import { RegisterInput, LoginInput, VerifyEmailInput, ResetPasswordInput, VerifyOtpInput } from "../validations/auth.validations";
import prisma from "../lib/prisma";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import AppError from "../utils/AppError";
import { generateUsername } from '../utils/genrateUsername';
import { Prisma } from '@prisma/client';
import { GoogleTokenPayload } from '../types/googleTokenPayload';
import { sendChangeEmailOtp, sendForgetPasswordOTP, sendSignUpOTP, verifyOTP } from '../redis/otp/otp.service';
import { otpKeys } from '../redis/core/keys/otp.keys';

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

  await sendSignUpOTP(data)
};


export async function validateUserSignup(email: string, otp: string) {

  const record = await verifyOTP<SignUpOtpPayload>(
    otpKeys.signup(email), otp
  );

  const user = await prisma.user.create({
    data: {
      name: record.name,
      username: record.username,
      email: record.email,
      password: record.passwordHash,
      mobile: record.mobile ?? null,
    },
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, accessToken, refreshToken, };
}


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
      githubAccount: {
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


export async function forgetPasswordOtp(email: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new AppError("User not exist with this email", 404)
  await sendForgetPasswordOTP(email)
  return { message: "OTP sent to your registered email" };
}

export async function changePasswordOtp(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  if (!user) throw new AppError("User not found", 404);
  await sendForgetPasswordOTP(user.email);
  return { message: "OTP sent to your registered email" };
}


export async function verifyResetPasswordOtp(data: VerifyOtpInput) {
  const key = otpKeys.resetPassword(data.email)
  const record = await verifyOTP<PasswordResetOtpPayload>(key, data.otp);
  if (!record) throw new AppError("Invalid Otp", 400)
  return { message: "Otp Verified" };
}


export async function resetPassword(data: ResetPasswordInput) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  await prisma.user.update({
    where: {
      email: data.email
    },
    data: {
      password: hashedPassword
    }
  })
  return { message: "Password updated successfully" };
}


export async function changeEmailOtp(newEmail: string, userId: string) {

  const existingUser = await prisma.user.findUnique({
    where: { email: newEmail },
  });

  if (existingUser) throw new AppError("Email already taken", 409);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true }
  });

  if (!user) throw new AppError("User not found", 404);

  await sendChangeEmailOtp({
    userId: userId,
    email: user.email,
    newEmail: newEmail,
    otpHash: "",
    attempts: 0,
  });

  return { message: "Otp sent" }
}


export async function verifyEmail(data: VerifyEmailInput) {

  console.log("fired");
  
  const key = otpKeys.changeEmail(data.email)
  const record = await verifyOTP<ChangeEmailOtpPayload>(key, data.otp)

  await prisma.user.update({
    where: {
      id: record.userId
    },
    data: {
      email: record.newEmail
    }
  })

  return { message: "Email changed successfully" };
}




