import api from "@/api/axiosInstance"
import type { GetNotificationParams } from "./types/notification.types"


export const getNotifications = async ({ workspaceSlug, cursor, limit }: GetNotificationParams) => {
    const { data: response } = await api.get(`/api/workspace/${workspaceSlug}/notifications`, {
        params: { cursor, limit }
    })
    return response.data
}

export const getUnreadCount = async (workspaceSlug: string) => {
    const { data: response } = await api.get(`/api/workspace/${workspaceSlug}/notifications/unread-count`,)
    return response.data
}

export const markAllNotificationsRead = async (workspaceSlug: string) => {
    const { data: response } = await api.post(`/api/workspace/${workspaceSlug}/notifications/read-all`);
    return response.data;
};

