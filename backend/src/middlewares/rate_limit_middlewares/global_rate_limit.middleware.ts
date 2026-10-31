import { Request, Response, NextFunction } from "express";
import { rateLimitKeys } from "../../redis/core/keys/rateLimit.keys";
import { incrementRateLimit } from "../../redis/rate_limit/rateLimit.config";

export async function globalRateLimit(req: Request, res: Response, next: NextFunction,) {

    let count = 0;
    
    try {
        const ip = req.ip ?? "unknown";
        const key = rateLimitKeys.global(ip);
        count = await incrementRateLimit(key, 900);
    } catch (error) {
        console.error("Rate limit error:", error);
        return next()
    }

    if (count > 300) {
        return res.status(429).json({ message: "Too many requests. Please try again later.", });
    }

    next();
}

