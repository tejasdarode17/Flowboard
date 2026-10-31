import { NextFunction, Request, Response } from "express";
import { incrementRateLimit } from "../../redis/rate_limit/rateLimit.config";
import { rateLimitKeys } from "../../redis/core/keys/rateLimit.keys";


export async function resetPasswordRatelimit(req: Request, res: Response, next: NextFunction) {

    let ipCount = 0
    let emailCount = 0

    try {

        const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
        const ip = req.ip ?? "unknown"

        ipCount = await incrementRateLimit(rateLimitKeys.resetPasswordIp(ip), 900)
        emailCount = await incrementRateLimit(rateLimitKeys.resetPasswordEmail(email), 900)

    } catch (error) {
        console.error("Reset password rate limit error:", error);
        return next()
    }

    if (ipCount > 5 || emailCount > 5) {
        return res.status(429).json({ success: false, message: "Too many requests. Please try again later." });
    }

    next()

}