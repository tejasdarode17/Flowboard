import { useMutation } from "@tanstack/react-query"
import { connectGitHubApi } from "../services/profile.services";

export const useGithubConnect = () => {
    return useMutation({
        mutationFn: () => connectGitHubApi(),
    });
};
