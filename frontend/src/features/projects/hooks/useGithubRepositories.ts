import { useQuery } from "@tanstack/react-query";
import { getGithubRepositoriesApi } from "../services/github.services";

export const useGithubRepositories = (enabled: boolean = true) => {
    return useQuery({
        queryKey: ["github-repositories"],
        queryFn: getGithubRepositoriesApi,
        enabled,
        retry: false
    });
};

