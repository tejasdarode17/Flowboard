import { useInfiniteQuery } from "@tanstack/react-query";
import { getActivities } from "../services/activity.services";

export const useActivities = (workspaceSlug: string, range?: "today" | "week" | "month") => {
    return useInfiniteQuery({
        queryKey: ["workspace-activities", workspaceSlug, range],
        initialPageParam: null,
        queryFn: ({ pageParam }) => getActivities({ workspaceSlug, range, cursor: pageParam, limit: 20, }),
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        staleTime: Infinity
    });
};


