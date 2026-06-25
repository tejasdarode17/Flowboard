import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateIssueApi } from "../services/issue.services";

export const useIssuesUpdate = (workspaceSlug: string, projectId: string, onClose?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateIssueApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["issues", workspaceSlug, projectId] });
            queryClient.invalidateQueries({ queryKey: ["myIssues", workspaceSlug] });
            onClose?.();
        },
    });
};