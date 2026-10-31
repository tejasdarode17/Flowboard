import { NextFunction, Request, Response } from "express";
import { incrementRateLimit } from "../../redis/rate_limit/rateLimit.config";
import { rateLimitKeys, UserActionPurpose } from "../../redis/core/keys/rateLimit.keys";
import AppError from "../../utils/AppError";


const USER_ACTION_LIMITS: Record<UserActionPurpose, { max: number; windowSeconds: number; message: string }> = {
    "invite": { max: 20, windowSeconds: 3600, message: "Invite limit reached, try again later" },
    "upload": { max: 20, windowSeconds: 3600, message: "Upload limit reached, try again later" },
    "github-repos": { max: 10, windowSeconds: 3600, message: "GitHub request limit reached, try again later" },
};


export function userActionRateLimit(purpose: UserActionPurpose) {
    const { max, windowSeconds, message } = USER_ACTION_LIMITS[purpose];

    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.userId;
        if (!userId) return next(new AppError("Unauthorized", 401)); 

        let count = 0;
        try {
            count = await incrementRateLimit(rateLimitKeys.userAction(purpose, userId), windowSeconds);
        } catch (error) {
            console.error("User action rate limit error:", error);
            return next();
        }

        if (count > max) {
            return res.status(429).json({ success: false, message });
        }
        next();
    };
}