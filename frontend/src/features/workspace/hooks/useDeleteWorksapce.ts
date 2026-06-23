import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteWorkspaceApi } from "../services/workspace.services";
import type { Workspace } from "../types/workspaces.types";

export const useDeleteWorkspace = (workspaceSlug: string) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: () => deleteWorkspaceApi(workspaceSlug),
        onSuccess: () => {
            queryClient.setQueryData<Workspace[]>(["workspaces"], (old) =>
                old?.filter((ws) => ws.slug !== workspaceSlug) ?? []
            );
            localStorage.removeItem("lastWorkspace");
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
            navigate("/");
        },
    });
};