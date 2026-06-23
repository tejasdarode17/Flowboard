import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWorkspaceApi } from "../services/workspace.services";

export const useUpdateWorkspace = (workspaceSlug: string, onClose?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => updateWorkspaceApi(workspaceSlug, formData),
        onSuccess: (updatedWorkspace) => {
            queryClient.invalidateQueries({ queryKey: ["workspaces"] })
            localStorage.setItem("lastWorkspace", updatedWorkspace?.slug || "");
            onClose?.();
        },
    });
};