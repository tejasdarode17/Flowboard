import { NextFunction, Request, Response } from "express";
import { deleteImageFromCloudinary, uploadImageToCloudinary, } from "../utils/cloudinaryHandler";
import AppError from "../utils/AppError";

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
        const file = req.file?.buffer;

        if (!file) {
            throw new AppError("File is required", 400)
        }

        const result = await uploadImageToCloudinary(file);

        return res.status(200).json({
            success: true,
            message: "Image Upload Successfully",
            result
        });

    } catch (error) {
        next(error)
    }
};


export async function deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
        const { public_id } = req.body;

        if (!public_id) {
            throw new AppError("Public_Id is required", 400)
        }

        await deleteImageFromCloudinary(public_id);

        return res.status(200).json({
            success: true,
            message: "Image deleted Succesfully",
        });

    } catch (error) {
        next(error)
    }
};
