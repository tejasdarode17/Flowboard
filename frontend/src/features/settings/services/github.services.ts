import api from "@/api/axiosInstance";

export const connectGitHubApi = async () => {
    const response = await api.get(`/api/github/connect`);
    return response.data.data
}

export const disconnectGitHubApi = async () => {
    const response = await api.delete(`/api/github/disconnect`);
    return response.data.data
}


