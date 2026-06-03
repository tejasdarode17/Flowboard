import { useQuery } from "@tanstack/react-query";
import { getGithubRepositoriesApi } from "../services/github.services";

export const useGithubRepositories = () => {
    return useQuery({
        queryKey: ["github-repositories"],
        queryFn: getGithubRepositoriesApi,
    });
};

