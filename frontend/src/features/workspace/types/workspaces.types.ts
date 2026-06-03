import type { AuthUser } from "@/features/auth/types/auth.types";

export interface Workspace {
    id: string;
    name: string;
    description: string,
    slug: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
    logo?: string;
    logoId?: string,
    createdAt: string;
    updatedAt: string;
}

export interface WorkspaceMember {
    id: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
    workspaceId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    user: AuthUser;
}
