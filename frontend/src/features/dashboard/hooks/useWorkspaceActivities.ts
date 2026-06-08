import { getWorkspaceActivities } from "@/features/projects/services/activity.services"
import { useQuery } from "@tanstack/react-query"

export const useWorkspaceActivities = (worskspaceSlug: string) => {
    return useQuery({
        queryFn: () => getWorkspaceActivities(worskspaceSlug),
        queryKey: ["WorkspaceActivities", worskspaceSlug]
    })
}
