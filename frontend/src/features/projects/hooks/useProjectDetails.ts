import { useQuery } from "@tanstack/react-query"
import { getProjectDetailsApi } from "../services/project.services"

export const useProjectDetails = (workspaceSlug: string, projectId: string) => {
    return useQuery({
        queryKey: ["project", workspaceSlug, projectId],
        queryFn: () => getProjectDetailsApi(workspaceSlug, projectId),
        staleTime: 1000 * 60 * 5,

    })
}


