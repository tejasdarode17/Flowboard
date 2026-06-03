import type { CreateProjectInput } from "../validations/project.validations";

export interface Project {
    id: string;
    name: string;
    slug: string;
    description: string,
    emoji?: string;
    emojiId?: string
}


export type CreateProjectParams = {
    workspaceSlug: string;
    data: CreateProjectInput;
};
