import { useQuery } from "@tanstack/react-query"
import { getIssuesApi } from "../services/issue.services"

export const useIssues = (workspaceSlug: string, projectId: string) => {
    return useQuery({
        queryKey: ["issues", workspaceSlug, projectId],
        queryFn: () => getIssuesApi(workspaceSlug, projectId),
        staleTime: 30 * 1000,
    })
}