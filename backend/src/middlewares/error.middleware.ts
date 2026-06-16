import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";


const uniqueFieldMessages: Record<string, string> = {
  email: "Email already exists",
  username: "Username already exists",
  slug: "Workspace name already exists",
};


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
      const fields = (err.meta?.target as string[]) ?? [];
      const field = fields[fields.length - 1] || "field";

      return res.status(409).json({
        success: false,
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        errors: [
          {
            field,
            message:
              uniqueFieldMessages[field] ??
              `${field} already exists`,
          },
        ],
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

    //any default error related to db or prisma 
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
