import { Worker } from "bullmq";
import { createNotificationWorker } from "./notification/notification.worker";
import { createActivityWorker } from "./activity/activity.worker";

const workers: Worker[] = [];

export function startWorkers() {
    workers.push(createNotificationWorker())
    workers.push(createActivityWorker())
    console.log(`Started ${workers.length} worker(s)`);
}

export async function closeWorkers() {
    await Promise.all(workers.map((w) => w.close()));
}