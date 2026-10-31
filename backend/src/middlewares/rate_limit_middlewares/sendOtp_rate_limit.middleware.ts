import { NextFunction, Request, Response } from "express";
import { OtpPurpose, rateLimitKeys } from "../../redis/core/keys/rateLimit.keys";
import { incrementRateLimit } from "../../redis/rate_limit/rateLimit.config";


export function sendOtpRateLimit(purpose: OtpPurpose) {

    return async (req: Request, res: Response, next: NextFunction) => {

        let ipCount = 0
        let emailCount = 0
        let userCount = 0

        try {
            const ip = req.ip ?? "unknown";
            ipCount = await incrementRateLimit(rateLimitKeys.otpSendIp(purpose, ip), 900);

            const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
            emailCount = await incrementRateLimit(rateLimitKeys.otpSendEmail(purpose, email), 900);

            // private flows we get userId also 
            const userId = req.user?.userId;
            if ((purpose === "change-email" || purpose === "change-password") && userId) {
                userCount = await incrementRateLimit(rateLimitKeys.otpSendUser(purpose, userId), 900);
            }

        } catch (error) {
            console.error("OTP send rate limit error:", error);
            return next();
        }

        if (ipCount > 10 || emailCount > 3 || userCount > 3) {
            return res.status(429).json({ success: false, message: "Too many requests. Please try again later." });
        }

        next();
    };
}