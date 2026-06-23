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
    | "MEMBER_JOINED"
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

    oldRole?: string;
    newRole?: string;

    repository?: string | null;

    commitCount?: number | null;
    commitMessage?: string | null;
    commitSha?: string | null;
    commitUrl?: string | null;
    branch?: string | null;

    number?: number;
    url?: string;

    sourceBranch?: string | null;
    targetBranch?: string | null;

    fromMemberId?: string;
    fromMemberName?: string | null;

    toMemberId?: string;
    toMemberName?: string | null;

    removedMemberId?: string;
    removedMemberName?: string | null;

    oldTitle?: string | null;
    newTitle?: string | null;

    oldDescription?: string | null;
    newDescription?: string | null;

    issueTitle?: string | null;

    [key: string]: unknown;
}
export interface Activity {
    id: string;

    workspaceId: string;

    project: {
        name: string
    } | null

    actorId: string;

    action: ActivityAction;

    entityType: string | null;
    entityId: string | null;
    entityName: string | null;

    metadata: ActivityMetadata | null;

    createdAt: string;

    actor: ActivityActor | null;
}


export type GetActivitiesParams = {
    workspaceSlug: string;
    range?: "today" | "week" | "month";
    cursor?: string | null;
    limit?: number;
};