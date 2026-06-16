import api from "@/api/axiosInstance"
import type { GetActivitiesParams } from "../types/activity.types"



export const getActivities = async ({ workspaceSlug, range, cursor, limit }: GetActivitiesParams) => {
    const { data: response } = await api.get(`/api/workspace/${workspaceSlug}/activities`, {
        params: { range, cursor, limit }
    })
    console.log(response.data);
    return response.data

}

export const getRecentActivities = async (workspaceSlug: string) => {
    const { data: response } = await api.get(`/api/workspace/${workspaceSlug}/recent/activities`)
    return response.data
}

