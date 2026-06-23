import { useMutation } from "@tanstack/react-query"
import { disconnectGitHubApi } from "../services/github.services"

export const useGithubDisconnect = () => {
    return useMutation({
        mutationFn: () => disconnectGitHubApi(),
    });
};
