import api from "@/api/axiosInstance";
import type { LinkRepositoryParams } from "../types/github.types";

export const getGithubRepositoriesApi = async () => {
    const { data: response } = await api.get("/api/github/repos");
    return response.data
};

export const linkRepositoryApi = async ({ workspaceSlug, data }: LinkRepositoryParams) => {
    const { data: response } = await api.post(`/api/github/link-repo/${workspaceSlug}`, data,);
    return response.data
};

