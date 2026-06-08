export interface CreateActivityInput {
    workspaceId: string;
    actorId: string;

    action: string;

    projectId?: string;

    entityType?: string;
    entityId?: string;
    entityName?: string;

    targetType?: string;
    targetId?: string;
    targetName?: string;

    metadata?: Record<string, any>;
}

