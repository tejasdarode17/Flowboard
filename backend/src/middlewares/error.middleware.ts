import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {

  console.log(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: "APP_ERROR",
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {

    // Duplicate field 
    if (err.code === "P2002") {
      const field = (err.meta?.target as string[])?.[0] || 'email';
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        errors: [
          {
            field: field,
            message: `${field} already exists`
          }
        ]
      });
    }

    // Record not found
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Record not found",
        code: "PRISMA_NOT_FOUND",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Database error",
      code: "PRISMA_ERROR",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    code: "INTERNAL_ERROR",
  });
};

export default errorMiddleware;
