import { UpdateProfileInput } from './../validations/auth.validations';
import prisma from "../lib/prisma";
import AppError from "../utils/AppError";
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "../utils/cloudinaryHandler";

export async function getUserProfile(username: string) {
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            avatar: true,
            createdAt: true,

            githubAccount: {
                select: {
                    username: true,
                },
            }
        },
    });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
}


export async function updateProfile(userId: string, data: UpdateProfileInput, file: Buffer | undefined) {

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            avatar: true,
            createdAt: true,
            avatarId: true,
            githubAccount: {
                select: {
                    username: true,
                },
            }
        },
    });

    if (!user) throw new AppError("User not found", 404);

    if (data.username) {
        const existingUser = await prisma.user.findFirst({
            where: {
                username: data.username,
                NOT: { id: userId },
            },
        });
        if (existingUser) throw new AppError("Username already taken", 409);
    }

    let avatarUrl: string = user.avatar ?? "";
    let avatarId: string = user.avatarId ?? "";

    if (file) {
        if (user.avatarId) {
            await deleteImageFromCloudinary(user.avatarId);
        }
        const uploaded = await uploadImageToCloudinary(file);
        if (!uploaded) throw new AppError("Image upload failed", 500);
        avatarUrl = uploaded.url;
        avatarId = uploaded.publicId;
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            ...(data.name && { name: data.name }),
            ...(data.username && { username: data.username }),
            ...(data.mobile && { mobile: data.mobile }),
            avatar: avatarUrl,
            avatarId,
        },
        select: {
            id: true,
            name: true,
            username: true,
            mobile: true,
            avatar: true,
            updatedAt: true,
        },
    });

    return updatedUser;
}