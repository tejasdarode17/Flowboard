import { Job, Worker } from "bullmq";
import prisma from "../../lib/prisma";
import { queueConnection } from "../connection";
import { emitToUser, emitToWorkspace } from "../../socket/socket";
import { NotificationJobData } from "../../types/notification.types";


export async function processNotification(job: Job<NotificationJobData>) {

    const { eventId, audience, payload } = job.data;

    if (audience.type === "member") {
        const notification = await prisma.notification.upsert({
            where: { eventId_memberId: { eventId, memberId: audience.memberId } },
            update: {},
            create: { ...payload, memberId: audience.memberId, eventId },
            include: { project: true },
        });

        try {
            emitToUser(audience.userId, "notification:new", notification);
        } catch (err) {
            console.error("Notification emit failed:", err);
        }
        return;
    }

    if (audience.type === "workspace") {
        const members = await prisma.member.findMany({
            where: { workspaceId: audience.workspaceId },
            select: { id: true },
        });
        if (members.length === 0) return;

        await prisma.notification.createMany({
            data: members.map((m) => ({ ...payload, memberId: m.id, eventId })),
            skipDuplicates: true,
        });

        try {
            emitToWorkspace(audience.workspaceId, "notification:new", {
                ...payload,
                id: eventId,
                createdAt: new Date().toISOString(),
            });
        } catch (err) {
            console.error("Notification emit failed:", err);
        }
    }
}

export function createNotificationWorker() {
    const worker = new Worker<NotificationJobData>("notification", processNotification, {
        connection: queueConnection,
        concurrency: 5,
    });

    worker.on("failed", (job, err) => console.error("Notification job failed:", job?.id, err.message));
    worker.on("error", (err) => console.error("Notification worker error:", err));

    return worker;
}
