import type { CreateProjectInput } from "../validations/project.validations";

export interface ProjectGithub {
    id: string;
    repoId: string;
    repoFullName: string;
    webhookId?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Project {
    id: string;
    name: string;
    slug: string;
    description: string;
    emoji?: string | null;
    emojiId?: string | null;
    projectGithub?: ProjectGithub | null;
    createdAt: string;
    updatedAt: string;
}


export type CreateProjectParams = {
    workspaceSlug: string;
    data: CreateProjectInput;
};

export type UpadteProjectParams = {
    workspaceSlug: string;
    data: CreateProjectInput;
    projectId: string
};

export type DeleteProjectParams = {
    workspaceSlug: string;
    projectId: string
};
