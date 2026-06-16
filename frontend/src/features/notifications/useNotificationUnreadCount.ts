import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "./notification.services";

export const useNotificationUnreadCount = (workspaceSlug: string) => {
    return useQuery({
        queryKey: ["notification-unread-count", workspaceSlug],
        queryFn: () => getUnreadCount(workspaceSlug),
        enabled: !!workspaceSlug,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
    });
};