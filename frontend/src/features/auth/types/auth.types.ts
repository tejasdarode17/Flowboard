
export interface GitHubAccount {
    username: string;
    githubId: string;
}


export interface AuthUser {
    id: string
    name: string
    email: string
    mobile: string
    username: string
    avatar?: string | null
    createdAt: string;
    updatedAt: string;
    gitHubAccount: GitHubAccount | null;
}



export type AuthState = {
    isAuthenticated: boolean
    isLoading: boolean
    userData: AuthUser | null
    error: string | null
}


