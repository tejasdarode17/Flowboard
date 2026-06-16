import { useEffect } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { connectSocket } from "@/shared/lib/socket";
import type { Notification, NotificationResponse } from "./notification.types";

export const useRTNotifications = (workspaceSlug: string) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!workspaceSlug) return;

        const socket = connectSocket();

        const handler = (notification: Notification) => {
            //prepend live notification in cache 
            queryClient.setQueryData<InfiniteData<NotificationResponse>>(
                ["notifications", workspaceSlug],
                (old) => {
                    if (!old) return old;

                    return {
                        ...old,
                        pages: old.pages.map((page, i) =>
                            i !== 0
                                ? page
                                : {
                                    ...page,
                                    notifications: [
                                        notification,
                                        ...page.notifications,
                                    ],
                                }
                        ),
                    };
                }
            );

            queryClient.invalidateQueries({ queryKey: ["notification-unread-count", workspaceSlug], });

        };

        socket.on("notification:new", handler);

        return () => {
            socket.off("notification:new", handler);
        };
    }, [workspaceSlug, queryClient]);
};