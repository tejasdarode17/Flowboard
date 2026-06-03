import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProjectApi } from "../services/project.services";

export const useCreateProject = (workspaceSlug: string, onClose?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProjectApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", workspaceSlug] });
            onClose?.();
        },
    });
};