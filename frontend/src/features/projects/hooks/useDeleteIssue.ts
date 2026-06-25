import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteIssueApi } from "../services/issue.services";

export const useDeleteIssue = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteIssueApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["project"] });
            queryClient.invalidateQueries({ queryKey: ["issue"] });
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            queryClient.invalidateQueries({ queryKey: ["worksapce"] });
        },
    });
};