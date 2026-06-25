import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProjectApi } from "../services/project.services";

export const useUpdateProject = (workspaceSlug: string, onClose?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProjectApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", workspaceSlug] });
            queryClient.invalidateQueries({ queryKey: ["project"] });
            onClose?.();
        },
    });
};