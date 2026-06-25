import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unlinkRepositoryApi } from "../services/github.services";

export const useUnlinkRepository = (workspaceSlug: string, projectId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: unlinkRepositoryApi,
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
