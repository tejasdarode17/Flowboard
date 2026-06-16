import prisma from "../lib/prisma";
import { CreateNotificationInput } from "../types/notification.types";


export async function createNotification(data: CreateNotificationInput) {
    const notification = await prisma.notification.create({
        data: {
            memberId: data.memberId,
            workspaceId: data.workspaceId,
            projectId: data.projectId,

            title: data.title,
            message: data.message,

            type: data.type,

            entityId: data.entityId,
            entityType: data.entityType,

            metadata: data.metadata,
        },
    });
    return notification;
}


export async function getNotifications(memberId: string, cursor?: string, limit = 20) {

    const notifications = await prisma.notification.findMany({
        where: {
            memberId,
        },
        include: { project: true, },

        orderBy: {
            createdAt: "desc",
        },
        take: limit + 1,
        ...(cursor && {
            cursor: {
                id: cursor,
            },
            skip: 1,
        }),
    });

    const hasMore = notifications.length > limit
    const items = hasMore ? notifications.slice(0, limit) : notifications
    const nextCursor = hasMore ? items[items.length - 1].id : null

    return {
        notifications: items,
        nextCursor,
        hasMore
    };
}


export async function getUnreadCount(memberId: string) {
    const count = await prisma.notification.count({
        where: { memberId, read: false },
    });
    return { count };
}

export async function markAllNotificationsRead(memberId: string) {
    await prisma.notification.updateMany({
        where: { memberId, read: false },
        data: { read: true },
    });
    return { success: true };
}

