import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";
import AppError from "../utils/AppError";
import { Role } from "@prisma/client";

export async function requireWorkspaceAccess(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req?.user?.userId
        const workspaceSlug = req?.params?.workspaceSlug


        if (!userId) {
            return next(new AppError("Unauthorized", 401));
        }

        if (!workspaceSlug || Array.isArray(workspaceSlug)) {
            return next(new AppError("Invalid WorkspaceId", 400));
        }

        const workspace = await prisma.workspace.findUnique({
            where: { slug: workspaceSlug }
        })

        if (!workspace) {
            return next(new AppError("Access denied", 403));
        }

        const member = await prisma.member.findFirst({
            where: { userId, workspaceId: workspace?.id, },
        });

        if (!member) {
            return next(new AppError("Access denied", 403));
        }

        req.workspace = workspace
        req.member = member
        next()
    } catch (error) {
        next(error)
    }
}



export function requireMemberRole(allowedRoles: Role[]) {

    return (req: Request, res: Response, next: NextFunction) => {

        const member = req.member

        if (!member) {
            return next(new AppError("Unauthorized", 401));
        }

        if (!allowedRoles.includes(member.role)) {
            return next(new AppError("You do not have permission to perform this action.", 403));
        }

        next()
    }
}