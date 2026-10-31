import { Request, Response, NextFunction } from "express";
import { rateLimitKeys } from "../../redis/core/keys/rateLimit.keys";
import { incrementRateLimit } from "../../redis/rate_limit/rateLimit.config";

export async function loginRateLimit(req: Request, res: Response, next: NextFunction,) {

    let ipCount = 0

    try {

        const ip = req.ip ?? "unknown";
        const ipKey = rateLimitKeys.loginIp(ip);
        ipCount = await incrementRateLimit(ipKey, 900);

    } catch (error) {
        console.error("Login rate limit error:", error);
        return next();
    }

    if (ipCount > 10) {
        return res.status(429).json({ message: "Too many login attempts from this IP." });
    }

    next()

}