import { useParams } from "react-router-dom";
import { useWorkspaces } from "@/features/workspace/hooks/useWorkspaces";

export const useCurrentWorkspace = () => {
    const { workspaceSlug } = useParams();
    const { data: workspaces, isLoading } = useWorkspaces();
    const lastSlug = localStorage.getItem("lastWorkspace");
    const currentWorkspace = workspaces?.find((ws) => ws.slug === (workspaceSlug ?? lastSlug));
    return {
        currentWorkspace: currentWorkspace,
        isLoading,
    };
};