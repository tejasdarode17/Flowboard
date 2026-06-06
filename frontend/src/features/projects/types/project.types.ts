import type { CreateProjectInput } from "../validations/project.validations";

export interface ProjectGitHub {
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
    projectGitHub?: ProjectGitHub | null;
}


export type CreateProjectParams = {
    workspaceSlug: string;
    data: CreateProjectInput;
};
