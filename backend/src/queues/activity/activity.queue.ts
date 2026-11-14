import { Queue } from "bullmq";
import { queueConnection } from "../connection";
import { CreateActivityInput } from "../../types/activity.types";


export const activityQueue = new Queue<CreateActivityInput>("activity", {
    connection: queueConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 500,
    },
})


export async function enqueueActivity(data: CreateActivityInput) {
    return activityQueue.add("activity", data, {
        jobId: data.eventId
    })
}