import api from "@/api/axiosInstance"

export const getWorkspaceActivities = async (workspaceSlug: string) => {
    const { data: response } = await api.get(`/api/workspace/${workspaceSlug}/activities`)
    return response.data
}

