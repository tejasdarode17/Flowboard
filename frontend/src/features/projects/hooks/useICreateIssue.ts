import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIssueApi } from "../services/issue.services";

export const useIssueCreate = (workspaceSlug: string, projectId: string, onClose?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createIssueApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["issues", workspaceSlug, projectId] });
            onClose?.();
        },
    });
};