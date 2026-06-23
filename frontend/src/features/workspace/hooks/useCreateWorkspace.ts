import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createWorkspaceApi } from "../services/workspace.services";
import type { Workspace } from "../types/workspaces.types";

export const useCreateWorkspace = (onClose?: () => void) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: createWorkspaceApi,
        onSuccess: (newWorkspace) => {

            queryClient.setQueryData<Workspace[]>(["workspaces"], (old) => [...(old ?? []), newWorkspace,
            ].filter((ws): ws is Workspace => ws !== undefined));

            localStorage.setItem("lastWorkspace", newWorkspace?.slug || "");
            navigate(`/${newWorkspace?.slug || ""}`);
            onClose?.();

            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        },
    });
};