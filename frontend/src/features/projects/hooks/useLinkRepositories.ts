import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linkRepositoryApi } from "../services/github.services";

export const useLinkRepository = (workspaceSlug: string, projectId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: linkRepositoryApi,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["project", workspaceSlug, projectId],
            });
            queryClient.invalidateQueries({
                queryKey: ["projects", workspaceSlug, projectId],
            });
        },
    });
};