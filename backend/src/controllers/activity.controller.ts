import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { getProjectRecentActivities, getWorkspaceRecentActivities } from "../services/activites.services";

export async function getWorkspaceActivitiesController(req: Request, res: Response, next: NextFunction) {
    try {

        const workspaceId = req.workspace.id;

        const activities = await getWorkspaceRecentActivities(workspaceId!);

        return res.status(200).json({
            success: true,
            data: activities,
        });

    } catch (error) {
        next(error);
    }
}

export async function getProjectActivitiesController(req: Request, res: Response, next: NextFunction) {
    try {
        const { projectId } = req.params;

        if (!projectId || Array.isArray(projectId)) {
            return next(new AppError("Workspace Id is required", 401))
        }
        const activities = await getProjectRecentActivities(projectId);

        return res.status(200).json({
            success: true,
            data: activities,
        });
    } catch (error) {
        next(error);
    }
}