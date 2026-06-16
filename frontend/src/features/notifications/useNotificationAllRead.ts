import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllNotificationsRead } from "./notification.services";

export const useNotificationAllRead = (workspaceSlug: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => markAllNotificationsRead(workspaceSlug),
        onSuccess: () => {
            queryClient.setQueryData(["notification-unread-count", workspaceSlug], { count: 0 });
            queryClient.invalidateQueries({ queryKey: ["notifications", workspaceSlug], });
        }
    });
};