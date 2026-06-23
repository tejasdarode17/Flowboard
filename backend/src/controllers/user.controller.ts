import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { getUserProfile, updateProfile } from "../services/user.services";
import { updateProfileSchema } from "../validations/auth.validations";

export async function getUserProfileController(req: Request, res: Response, next: NextFunction) {
    try {

        const { username } = req.params;

        if (!username || Array.isArray(username)) {
            return next(new AppError("User memberId is required", 400));
        }

        const profile = await getUserProfile(username);

        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            data: profile,
        });
    } catch (error) {
        next(error);
    }
}


export async function updateProfileController(req: Request, res: Response, next: NextFunction) {

    try {

        const data = updateProfileSchema.parse(req.body)
        const file = req.file?.buffer
        const userId = req.user?.userId
        if (!userId) return next(new AppError("Not authenticated", 401))
        const user = await updateProfile(userId, data, file)

        return res.status(200).json({
            success: true,
            message: "Workspace created Successfully",
            data: user
        })

    } catch (error) {
        next(error)
    }

}



