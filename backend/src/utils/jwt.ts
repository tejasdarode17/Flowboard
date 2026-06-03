import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import AppError from "./AppError";
import { JwtPayload } from "../types/jwtPayload";
dotenv.config();

export function generateAccessToken(userId: string) {
  const secret = process.env.JWT_ACCESS_SECRET
  if (!secret) throw new Error("JWT_ACCESS_SECRET is not defined");
  return jwt.sign({ userId: userId }, secret, {
    expiresIn: "1h",
  });
};

export function generateRefreshToken(userId: string) {
  const secret = process.env.JWT_REFRESH_SECRET
  if (!secret) throw new Error("JWT_REFRESH_SECRET is not defined");
  return jwt.sign({ userId: userId }, secret, {
    expiresIn: "7d",
  });
};

export function verifyAccessToken(token: string): JwtPayload {

  try {
    const secret = process.env.JWT_ACCESS_SECRET
    if (!secret) throw new Error("JWT_ACCESS_SECRET is not defined");

    const decoded = jwt.verify(token, secret)

    if (typeof decoded !== "object" || decoded === null || !("userId" in decoded)) {
      throw new AppError("Invalid access token payload", 401);
    }
    return decoded as JwtPayload

  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Access token expired", 401);
    }

    throw new AppError("Invalid access token", 401);
  }
};


export function verifyRefreshToken(token: string): JwtPayload {

  try {

    const secret = process.env.JWT_REFRESH_SECRET
    if (!secret) throw new Error("JWT_REFRESH_SECRET is not defined");
    const decoded = jwt.verify(token, secret)

    if (typeof decoded !== "object" || decoded === null || !("userId" in decoded)) {
      throw new AppError("Invalid access token payload", 401);
    }
    return decoded as JwtPayload

  } catch (error: unknown) {
    if (error instanceof AppError) throw error;

    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Access token expired", 401);
    }

    throw new AppError("Invalid access token", 401);
  }
};




export function generateGitHubState(userId: string, workspaceSlug: string) {
  return jwt.sign(
    { userId, workspaceSlug, },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "10m", }
  );
}



export function verifyGitHubState(state: string) {
  try {
    const decoded = jwt.verify(state, process.env.JWT_ACCESS_SECRET!);

    if (typeof decoded !== "object" || !decoded || !("userId" in decoded) || !("workspaceSlug" in decoded)) {
      throw new AppError("Invalid state", 400);
    }

    return decoded as {
      userId: string;
      workspaceSlug: string;
    };

  } catch {
    throw new AppError("Invalid or expired state", 401);
  }
}