import { useQuery } from "@tanstack/react-query"
import { getWorkspacesApi } from "../services/workspace.services"

export const useWorkspaces = () => {
    return useQuery({
        queryKey: ["workspaces"],
        queryFn: getWorkspacesApi,
    })
}



