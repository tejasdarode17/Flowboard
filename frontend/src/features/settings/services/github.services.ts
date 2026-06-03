import api from "@/api/axiosInstance";

export const connectGitHubApi = async (workspaceSlug: string) => {
    const response = await api.get(`/api/github/${workspaceSlug}/connect`);
    return response.data.data
}

