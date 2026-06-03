import api from "@/api/axiosInstance"
import { type Workspace, type WorkspaceMember } from "../types/workspaces.types";
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


// -----------members------------
export const getMembersOfWorkspace = async (workspaceSlug: string) => {
    const { data: response } = await api.get<ApiResponse<WorkspaceMember[]>>(`/api/workspace/${workspaceSlug}/members`)
    return response?.data
}


export const inviteMemberToWorkspace = async (workspaceSlug: string, data: InviteWorksapceInput) => {
    const { data: response } = await api.post(`/api/workspace/${workspaceSlug}/invite`, data)
    console.log(response);
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


