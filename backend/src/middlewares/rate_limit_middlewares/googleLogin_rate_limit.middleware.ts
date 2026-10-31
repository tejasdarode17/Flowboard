import { NextFunction, Request, Response } from "express";
import { incrementRateLimit } from "../../redis/rate_limit/rateLimit.config";
import { rateLimitKeys } from "../../redis/core/keys/rateLimit.keys";

export async function googleLoginRateLimit(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const ip = req.ip ?? "unknown";

        const count = await incrementRateLimit(rateLimitKeys.googleLoginIp(ip), 900);

        if (count > 20) {
            return res.status(429).json({
                success: false,
                message: "Too many Google login attempts. Please try again later."
            });
        }

        next();

    } catch (error) {
        console.error("Google login rate limit error:", error);
        return next();
    }
}