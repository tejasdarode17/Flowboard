import { NextFunction, Request, Response } from "express";
import { getActivities, getRecentActivities } from "../services/activites.services";


export async function getActivitiesController(req: Request, res: Response, next: NextFunction) {
    try {
        const workspaceId = req.workspace.id;
        const activities = await getActivities(
            workspaceId,
            {
                limit: req.query.limit as string,
                cursor: req.query.cursor as string,
                range: req.query.range as | "today" | "week" | "month",
            }
        );

        return res.status(200).json({
            success: true,
            data: activities,
            message: "Activities fetched successfully"
        });

    } catch (error) {
        next(error);
    }
}
export async function getRecentActivitiesController(req: Request, res: Response, next: NextFunction) {
    try {
        const workspaceId = req.workspace.id;

        const activities = await getRecentActivities(workspaceId!);

        return res.status(200).json({
            success: true,
            data: activities,
            message: "Activities fetched successfully"
        });

    } catch (error) {
        next(error);
    }
}

