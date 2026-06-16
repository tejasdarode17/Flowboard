import { ActivityAction } from "@prisma/client";


export interface CreateActivityInput {
    workspaceId: string;
    actorId: string;

    action: ActivityAction;

    projectId?: string;

    entityType?: string;
    entityId?: string;
    entityName?: string;

    // targetType?: string;
    // targetId?: string;
    // targetName?: string;

    metadata?: Record<string, any>;
}
export interface ActivityFilters {
    limit?: string;
    cursor?: string;
    range?: "today" | "week" | "month";
}