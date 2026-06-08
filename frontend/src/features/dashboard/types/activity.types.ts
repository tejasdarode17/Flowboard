import type { AuthUser } from "@/features/auth/types/auth.types";

export type ActivityAction =
    | "WORKSPACE_CREATED"
    | "WORKSPACE_UPDATED"
    | "PROJECT_CREATED"
    | "PROJECT_UPDATED"
    | "PROJECT_DELETED"
    | "ISSUE_CREATED"
    | "ISSUE_UPDATED"
    | "ISSUE_DELETED"
    | "ISSUE_STATUS_CHANGED"
    | "ISSUE_ASSIGNED"
    | "ISSUE_PRIORITY_CHANGED"
    | "ISSUE_COMPLETED"
    | "ISSUE_REOPENED"
    | "MEMBER_ADDED"
    | "MEMBER_REMOVED"
    | "MEMBER_ROLE_CHANGED"
    | "PUSH"
    | "PR_OPENED"
    | "PR_MERGED"
    | "PR_CLOSED"
    | "PR_REOPENED"
    | "COMMENT_ADDED";

export interface ActivityActor {
    id: string;
    role: string;
    user: AuthUser;
}

export interface ActivityMetadata {
    from?: string;
    to?: string;

    oldRole?: string
    newRole?: string;

    repository?: string | null
    commitCount?: number | null
    commitMessage?: string | null

    number?: number;
    url?: string;

    [key: string]: unknown;
}

export interface Activity {
    id: string;

    workspaceId: string;
    projectId: string | null;

    actorId: string;

    action: ActivityAction;

    entityType: string | null;
    entityId: string | null;
    entityName: string | null;

    targetType: string | null;
    targetId: string | null;
    targetName: string | null;

    metadata: ActivityMetadata | null;

    createdAt: string;

    actor: ActivityActor;
}