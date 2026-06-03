import { useQuery } from "@tanstack/react-query"
import { getProjectsApi } from "../../projects/services/project.services"

export const useProjects = (workspaceSlug: string) => {
    return useQuery({
        queryKey: ["projects", workspaceSlug],
        queryFn: () => getProjectsApi(workspaceSlug),
        enabled: !!workspaceSlug,
    })
}