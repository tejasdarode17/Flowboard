import { NextFunction, Request, Response } from "express";
import { OtpPurpose, rateLimitKeys } from "../../redis/core/keys/rateLimit.keys";
import { incrementRateLimit } from "../../redis/rate_limit/rateLimit.config";

export function verifyOtpRateLimit(purpose: OtpPurpose) {
    return async (req: Request, res: Response, next: NextFunction) => {

        let ipCount = 0
        let emailCount = 0
        let userCount = 0;

        try {
            const ip = req.ip ?? "unknown";
            ipCount = await incrementRateLimit(rateLimitKeys.otpVerifyIp(purpose, ip), 900);

            const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
            emailCount = await incrementRateLimit(rateLimitKeys.otpVerifyEmail(purpose, email), 900);

        } catch (error) {
            console.error("OTP verify rate limit error:", error);
            return next();
        }

        if (ipCount > 20 || emailCount > 10 || userCount > 10) {
            return res.status(429).json({ success: false, message: "Too many verification attempts. Please try again later." });
        }

        next();
    };
}