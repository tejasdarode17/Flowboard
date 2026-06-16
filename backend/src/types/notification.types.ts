import { NotificationType, Prisma } from "@prisma/client";

export type CreateNotificationInput = {
    memberId: string;
    workspaceId: string;

    projectId?: string

    title: string;
    message: string;

    type: NotificationType;

    entityId?: string;
    entityType?: string;

    metadata?: Record<string, any>
};