import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspaceApi } from "../services/workspace.services";
import { useNavigate } from "react-router-dom";

export const useWrokspaceCreate = (onClose?: () => void) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    return useMutation({
        mutationFn: createWorkspaceApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Workspaces"] });
            onClose?.();
            navigate("/")
        },
    });
};