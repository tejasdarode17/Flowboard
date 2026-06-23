import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { getNotifications, getUnreadCount, markAllNotificationsRead } from "../services/notification.services";

export async function getNotificationsController(req: Request, res: Response, next: NextFunction) {
    try {
        const memberId = req.member?.id;

        if (!memberId) {
            return next(new AppError("Unauthorized", 401))
        }
        const cursor = req.query.cursor as string
        const limit = Number(req.query.limit) || 20;
        const result = await getNotifications(memberId, cursor, limit);
        res.status(200).json({
            success: true,
            message: "Notification fetched ",
            data: result,
        });

    } catch (error) {
        next(error);
    }
}

export async function getUnreadCountController(req: Request, res: Response, next: NextFunction) {
    try {
        const memberId = req.member?.id;
        if (!memberId) return next(new AppError("Unauthorized", 401));
        const result = await getUnreadCount(memberId);
        return res.status(200).json({
            success: true,
            message: "Unread Notification Fetched",
            data: result
        });
    } catch (error) {
        next(error);
    }
}

export async function markAllNotificationsReadController(req: Request, res: Response, next: NextFunction) {
    try {
        const memberId = req.member?.id;
        if (!memberId) return next(new AppError("Unauthorized", 401));

        await markAllNotificationsRead(memberId);
        return res.status(200).json({
            success: true,
            message: "All marked as read"
        });

    } catch (error) {
        next(error);
    }
}