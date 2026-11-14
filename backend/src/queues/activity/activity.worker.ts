import { Job, Worker } from "bullmq";
import { CreateActivityInput } from "../../types/activity.types";
import { queueConnection } from "../connection";
import { createActivity } from "../../services/activites.services";

export async function processActivities(job: Job<CreateActivityInput>) {
    const data = job.data;
    await createActivity(data)
}

export function createActivityWorker() {
    const worker = new Worker<CreateActivityInput>("activity", processActivities, {
        connection: queueConnection,
        concurrency: 5,
    });

    worker.on("failed", (job, err) => console.error("Activity job failed:", job?.id, err.message));
    worker.on("error", (err) => console.error("Activity worker error:", err));

    return worker;
}
