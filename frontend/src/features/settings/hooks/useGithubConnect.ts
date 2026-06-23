import { useMutation } from "@tanstack/react-query"
import { connectGitHubApi } from "../services/github.services"

export const useGithubConnect = () => {
    return useMutation({
        mutationFn: () => connectGitHubApi(),
    });
};
