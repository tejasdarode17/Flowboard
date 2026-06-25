import api from "@/api/axiosInstance";
import type { ApiResponse } from "@/shared/types/api.response.types";
import type { UserProfile } from "../types/profile.types";

export const getUserProfileApi = async (username: string) => {
  const { data: response } = await api.get<ApiResponse<UserProfile>>(`/api/user/${username}`);
  return response.data;
};

export const editUserProfileApi = async (formata: FormData) => {
  const { data: response } = await api.post<ApiResponse<UserProfile>>(`/api/user/profile/edit`, formata);
  return response.data
};


export const connectGitHubApi = async () => {
    const response = await api.get(`/api/github/connect`);
    return response.data.data
}

export const disconnectGitHubApi = async () => {
    const response = await api.delete(`/api/github/disconnect`);
    return response.data.data
}


