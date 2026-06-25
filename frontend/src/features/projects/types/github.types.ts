export interface GithubRepository {
    id: string;
    name: string;
    fullName: string;
    private: boolean;
    defaultBranch: string;
}

interface LinkRepositoryInput {
    projectId: string;
    repoId: string;
    repoFullName: string;
}

export interface LinkRepositoryParams {
    workspaceSlug: string
    data: LinkRepositoryInput
}

export interface UnlinkRepositoryParams {
    workspaceSlug: string
    projectId: string
}

