import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateIssueStatusApi } from "../services/issue.services";


export const useIssuesStatusUpdate = (workspaceSlug: string, projectId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateIssueStatusApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["issues", workspaceSlug, projectId], });
        },
    })
}
