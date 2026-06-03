import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import AppError from "../utils/AppError";

export const verifyAuth = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return next(new AppError("Not authenticated", 401));
  }
  try {
    let decoded = verifyAccessToken(accessToken)
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
