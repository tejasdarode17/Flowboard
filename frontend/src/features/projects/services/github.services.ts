import api from "@/api/axiosInstance";
import type { LinkRepositoryPayload } from "../types/github.types";

export const getGithubRepositoriesApi = async () => {
    const { data } = await api.get("/api/github/repos");
    return data.data;
};


export const linkRepositoryApi = async (payload: LinkRepositoryPayload,) => {
    const { data } = await api.post("/api/github/link-repo", payload,);
    return data.data;
};