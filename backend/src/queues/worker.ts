import { Worker } from "bullmq";
import { createNotificationWorker } from "./notification/notification.worker";

const workers: Worker[] = [];

export function startWorkers() {
    workers.push(createNotificationWorker())
    console.log(`Started ${workers.length} worker(s)`);
}

export async function closeWorkers() {
    await Promise.all(workers.map((w) => w.close()));
}