import type { ApiResponse } from "@/shared/types/api.response.types"
import type { CreateIssueParams, Issue, UpdateIssueParams, UpdateIssueStatusParams } from "../types/issue.types"
import api from "@/api/axiosInstance"

export const getIssuesApi = async (workspaceSlug: string, projectId: string) => {
    const { data: response } = await api.get<ApiResponse<Issue[]>>(`/api/workspace/${workspaceSlug}/projects/${projectId}/issues`)
    return response.data
}

export const createIssueApi = async ({ workspaceSlug, projectId, data }: CreateIssueParams) => {
    const { data: resposne } = await api.post(`/api/workspace/${workspaceSlug}/projects/${projectId}/issues`, data)
    return resposne.data
}

export const getMyIssuesApi = async (workspaceSlug: string) => {
    const { data: response } = await api.get(`/api/workspace/${workspaceSlug}/issues/me`);
    return response.data;
};


export const updateIssueApi = async ({ workspaceSlug, projectId, issueId, data }: UpdateIssueParams) => {
    const { data: response } = await api.post(`/api/workspace/${workspaceSlug}/projects/${projectId}/issues/${issueId}`, data);
    return response.data;
};


export const updateIssueStatusApi = async ({ workspaceSlug, projectId, issueId, status }: UpdateIssueStatusParams) => {
    const { data: response } = await api.post(`/api/workspace/${workspaceSlug}/projects/${projectId}/issues/${issueId}`,
        { status }
    );
    return response.data;
};
