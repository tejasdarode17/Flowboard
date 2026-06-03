import api from "@/api/axiosInstance"
import { type ApiResponse } from "@/shared/types/api.response.types"
import type { CreateProjectParams, Project } from "../../projects/types/project.types"



export const getProjectsApi = async (workspaceSlug: string) => {
    const { data: response } = await api.get<ApiResponse<Project[]>>(`/api/workspace/${workspaceSlug}/projects`)
    return response.data
}

export const createProjectApi = async ({ workspaceSlug, data }: CreateProjectParams) => {
    const { data: resposne } = await api.post(`/api/workspace/${workspaceSlug}/projects`, data)
    return resposne.data
}

export const getProjectDetailsApi = async (workspaceSlug: string, projectId: string) => {
    const { data: resposne } = await api.get(`/api/workspace/${workspaceSlug}/projects/${projectId}`)
    return resposne.data
}