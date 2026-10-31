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
import { rateLimitKeys } from '../redis/core/keys/rateLimit.keys';
import { getRateLimitCount, incrementRateLimit, resetRateLimit } from '../redis/rate_limit/rateLimit.config';
import { createHash, randomBytes } from 'node:crypto';
import { deleteCache, getCache, setCache } from '../redis/core/cache';

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


export async function loginUser(data: LoginInput, ip: string) {

  const identifier = data.emailOrUsername

  const DUMMY_HASH = await bcrypt.hash("dummy-password-not-a-real-account", 10)

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });

  const loginIpAndIdentifier = rateLimitKeys.loginIpAndIdentifier(identifier, ip);
  const failedAttempts = await getRateLimitCount(loginIpAndIdentifier);

  if (failedAttempts >= 5) {
    throw new AppError("Too many failed login attempts. Please try again later.", 429,);
  }

  const isMatch = await bcrypt.compare(data?.password, user?.password || DUMMY_HASH);

  if (!user || !isMatch) {
    await incrementRateLimit(loginIpAndIdentifier, 900);
    throw new AppError("Invalid email or password", 401);
  }

  await resetRateLimit(loginIpAndIdentifier);

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
  if (!user) throw new AppError("User not exist with this email", 404)
  await sendForgetPasswordOTP(user.email);
  return { message: "OTP sent to your registered email" };
}


export async function verifyResetPasswordOtp(data: VerifyOtpInput) {

  const key = otpKeys.resetPassword(data.email)
  const record = await verifyOTP<PasswordResetOtpPayload>(key, data.otp);

  if (!record) throw new AppError("Invalid Otp", 400)

  const resetToken = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(resetToken).digest("hex")

  const resetTokenKey = otpKeys.resetPasswordToken(data.email);
  await setCache(resetTokenKey, tokenHash, 300);

  return { message: "Otp Verified", resetToken };
}


export async function resetPassword(data: ResetPasswordInput) {

  //we have sent token from verifyResetPasswordOtp to client and also we have stored in redis in hash 
  const resetTokenFromClient = data?.resetToken
  const tokenHashOfClient = createHash("sha256")
    .update(resetTokenFromClient)
    .digest("hex");

  //we are fetching back that token for verifying that we have issued this token
  //hacker can genrate random string and send us so that we also stored in redis as a hash 
  const resetTokenKey = otpKeys.resetPasswordToken(data.email)
  const resetTokenFromRedis = await getCache<string>(resetTokenKey)

  if (!resetTokenFromRedis || tokenHashOfClient !== resetTokenFromRedis) {
    throw new AppError("Invalid or expired reset token", 500);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await prisma.user.update({
    where: {
      email: data.email
    },
    data: {
      password: hashedPassword
    }
  })

  await deleteCache(resetTokenKey);

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
  });

  return { message: "Otp sent" }
}


export async function verifyEmail(data: VerifyEmailInput, userId: string) {

  const key = otpKeys.changeEmail(data.email)
  const record = await verifyOTP<ChangeEmailOtpPayload>(key, data.otp)

  if (record.userId !== userId) {
    throw new AppError("Invalid OTP", 400);
  }

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





