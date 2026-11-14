import { Queue } from "bullmq"
import { queueConnection } from '../connection';
import { NotificationJobData } from "../../types/notification.types";


export const notificationQueue = new Queue<NotificationJobData>("notification", {
    connection: queueConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 500,
    },
});


//await lagana hai ki nahi pata nahi 
export async function enqueueNotification(data: NotificationJobData) {
    return notificationQueue.add("notify", data, {
        jobId: data.eventId,
    });
}