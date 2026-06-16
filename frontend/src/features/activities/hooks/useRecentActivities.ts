import { useQuery } from "@tanstack/react-query"
import { getRecentActivities } from "../services/activity.services"

export const useRecentActivities = (worskspaceSlug: string) => {
    return useQuery({
        queryFn: () => getRecentActivities(worskspaceSlug),
        queryKey: ["WorkspaceActivities", worskspaceSlug]
    })
}
