export interface GitHubRepository {
    id: string;
    name: string;
    fullName: string;
    private: boolean;
    defaultBranch: string;
}

export interface LinkRepositoryPayload {
    projectId: string;
    repoId: string;
    repoFullName: string;
}

