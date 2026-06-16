export type NotificationType =
    | "ISSUE_ASSIGNED"
    | "ISSUE_COMPLETED"
    | "ISSUE_REOPENED"
    | "PR_MERGED"
    | "PR_OPENED"
    | "PR_CLOSED"
    | "PR_REOPENED"
    | "COMMENT_ADDED"
    | "MEMBER_JOINED"
    | "MEMBER_REMOVED"
    | "MEMBER_ROLE_CHANGED";

export interface NotificationMetadata {
    // GitHub
    url?: string;
    prNumber?: number;
    repository?: string | null;
    sourceBranch?: string | null;
    targetBranch?: string | null;

    // Members
    mergedBy?: string;
    mergedByName?: string | null;

    // Generic
    [key: string]: unknown;
}

export interface NotificationProject {
    id?: string;
    name: string;
}

export interface Notification {
    id: string;

    memberId: string;

    workspaceId: string;
    projectId: string | null;

    title: string;
    message: string;

    type: NotificationType;

    entityId: string | null;
    entityType: string | null;

    metadata: NotificationMetadata | null;

    read: boolean;

    createdAt: string;
    updatedAt: string;

    project: NotificationProject | null;
}


export interface NotificationResponse {
    notifications: Notification[];
    nextCursor: string | null;
    hasMore: boolean;
}

export interface GetNotificationParams {
    workspaceSlug: string,
    cursor?: string | null;
    limit?: number;
}