import api from "@/api/axiosInstance"
import { type RemoveMemberParams, type UpdateMemberRoleParams, type Workspace, type WorkspaceMember } from "../types/workspaces.types";
import type { ApiResponse } from "@/shared/types/api.response.types";
import type { InviteWorksapceInput } from "../validations/workspace.validations";


export const getWorkspacesApi = async () => {
    const response = await api.get<ApiResponse<Workspace[]>>(`/api/workspace`);
    return response?.data.data
};


export const createWorkspaceApi = async (formData: FormData) => {
    const { data: response } = await api.post<ApiResponse<Workspace>>("/api/workspace", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
    return response?.data
}

export const getWorkspaceDetailsApi = async (workspaceSlug: string) => {
    const { data: response } = await api.get<ApiResponse<Workspace>>(`/api/workspace/${workspaceSlug}`)
    return response?.data
}

export const updateWorkspaceApi = async (workspaceSlug: string, formData: FormData) => {
    const { data: response } = await api.post<ApiResponse<Workspace>>(`/api/workspace/${workspaceSlug}`,
        formData
    );
    return response?.data;
};

export const deleteWorkspaceApi = async (workspaceSlug: string) => {
    const { data: response } = await api.delete(`/api/workspace/${workspaceSlug}`)
    return response?.data
}


// -----------members------------
export const getMembersOfWorkspace = async (workspaceSlug: string) => {
    const { data: response } = await api.get<ApiResponse<WorkspaceMember[]>>(`/api/workspace/${workspaceSlug}/members`)
    return response?.data
}


export const inviteMemberToWorkspace = async (workspaceSlug: string, data: InviteWorksapceInput) => {
    const { data: response } = await api.post(`/api/workspace/${workspaceSlug}/invite`, data)
    return response.data
}


export const validateInviteTokenApi = async (token: string) => {
    const { data: response } = await api.get(`/api/workspace/invite/${token}`);
    return response.data;
}


export const acceptInviteApi = async (token: string) => {
    const { data: response } = await api.post(`/api/workspace/invite/${token}/accept`);
    return response.data;
}

export const chnageRoleApi = async ({ workspaceSlug, memberId, role, }: UpdateMemberRoleParams) => {
    const { data: response } = await api.post(`/api/workspace/${workspaceSlug}/members/${memberId}/role`, { role });
    return response.data;
}

export const removeMemberApi = async ({ workspaceSlug, memberId }: RemoveMemberParams) => {
    const { data: response } = await api.delete(`/api/workspace/${workspaceSlug}/members/${memberId}`);
    return response.data;
}


