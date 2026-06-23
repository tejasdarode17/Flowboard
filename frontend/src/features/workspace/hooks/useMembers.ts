import { useQuery } from "@tanstack/react-query"
import { getMembersOfWorkspace } from "../services/workspace.services"

export const useMembers = (workspaceSlug: string) => {
    return useQuery({
        queryKey: ["members", workspaceSlug],
        queryFn: () => getMembersOfWorkspace(workspaceSlug),
        enabled: !!workspaceSlug,
        staleTime: 1000 * 60 * 5,
    })
} 