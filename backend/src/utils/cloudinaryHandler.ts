import { v2 as cloudinary } from "cloudinary"
import { CloudinaryImageType } from "../types/cloudinaryImage.type";


export async function uploadImageToCloudinary(buffer: Buffer) {
    try {
        const result = await new Promise<CloudinaryImageType>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: "Ecom",
                        resource_type: "image",
                        transformation: [{ quality: "auto:eco" }],
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        if (!result) return reject(new Error("Upload failed"));

                        resolve(result);
                    }
                )
                .end(buffer);
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        throw error;
    }
}

export async function deleteImageFromCloudinary(publicId: string) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw error
    }
}
