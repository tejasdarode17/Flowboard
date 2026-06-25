import { useMutation } from "@tanstack/react-query"
import { disconnectGitHubApi } from "../services/profile.services";

export const useGithubDisconnect = () => {
    return useMutation({
        mutationFn: () => disconnectGitHubApi(),
    });
};
