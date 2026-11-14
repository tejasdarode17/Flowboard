
import { NotificationType, Prisma } from "@prisma/client";

export type CreateNotificationInput = {
    memberId: string;
    workspaceId: string;
    projectId?: string;

    title: string;
    message: string;

    type: NotificationType;

    entityId?: string;
    entityType?: string;

    metadata?: Prisma.InputJsonValue;
    // metadata?: Record<string, any>
};


export type NotificationPayload = Omit<CreateNotificationInput, "memberId">;

export type NotificationAudience =
    | { type: "workspace"; workspaceId: string }
    | { type: "member"; memberId: string; userId: string }

export type NotificationJobData = {
    eventId: string;
    audience: NotificationAudience;
    payload: NotificationPayload;
};
