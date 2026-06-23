import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotifications } from "../services/notification.services";

export const useNotifications = (workspaceSlug: string) => {
    return useInfiniteQuery({
        queryKey: ["notifications", workspaceSlug],
        queryFn: ({ pageParam }) => getNotifications({ workspaceSlug, cursor: pageParam, limit: 20 }),
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.nextCursor : undefined;
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });
};