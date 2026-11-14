import prisma from "../lib/prisma";
import AppError from "../utils/AppError";
import { issueInput, UpdateissueInput } from "../validations/issue.validations";
import { enqueueActivity } from "../queues/activity/activity.queue";
import { randomUUID } from "node:crypto";
import { enqueueNotification } from "../queues/notification/notification.queue";
import { CreateActivityInput } from "../types/activity.types";

export async function createIssue(data: issueInput, projectId: string, actorId: string) {

    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
        },
    });

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const issue = await prisma.issue.create({
        data: {
            title: data.title,
            description: data.description,

            status: data.status ?? "TODO",
            priority: data.priority ?? "Medium",

            projectId,

            assignedTo: data.assignedTo,
            createdBy: actorId,
        },
    })


    try {
        await enqueueActivity(
            {
                eventId: randomUUID(),
                workspaceId: project.workspaceId,
                projectId: project.id,
                actorId,
                action: "ISSUE_CREATED",
                entityType: "ISSUE",
                entityId: issue.id,
                entityName: issue.title,
            },
        );
    } catch (error) {
        console.error("Failed to enqueue activity", error)
    }


    // Notification
    if (data.assignedTo && data.assignedTo !== actorId) {
        try {
            const [creator, assignee] = await Promise.all([
                // creator means loggedin user jo crete kar rahh hai issue actor
                //assignee mean jisko bhejna hai ye jisko assigenhua hai 
                prisma.member.findUnique({
                    where: {
                        id: actorId,
                    },
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                }),

                prisma.member.findUnique({
                    where: {
                        id: data.assignedTo,
                    },
                    select: {
                        userId: true,
                    },
                }),
            ]);

            if (assignee) {
                await enqueueNotification({
                    eventId: randomUUID(),
                    audience: {
                        type: "member",
                        memberId: data.assignedTo,
                        userId: assignee.userId
                    },
                    payload: {
                        workspaceId: project.workspaceId,

                        projectId,

                        title: "Issue assigned",

                        message: `${creator?.user.name ?? "Someone"} assigned "${issue.title}" to you in ${project.name}`,

                        type: "ISSUE_ASSIGNED",

                        entityId: issue.id,
                        entityType: "ISSUE",

                        metadata: {
                            assignedBy: actorId,
                            issueTitle: issue.title,
                        },
                    }
                })
            }
        } catch (error) {
            console.error("Notification Failed", error)
        }
    }
    return issue;
}



export async function updateIssue(issueId: string, data: UpdateissueInput, actorId: string) {

    
    const issue = await prisma.issue.findUnique({
        where: { id: issueId },
        include: {
            project: true,
            assignee: {
                include: { user: { select: { name: true } } },
            },
        },
    });

    if (!issue) {
        throw new AppError("Issue not found", 404);
    }

    const statusChanged = data.status !== undefined && data.status !== issue.status;
    const priorityChanged = data.priority !== undefined && data.priority !== issue.priority;
    const assigneeChanged = data.assignedTo !== undefined && data.assignedTo !== issue.assignedTo;
    const titleChanged = data.title !== undefined && data.title !== issue.title;
    const descriptionChanged = data.description !== undefined && data.description !== issue.description;

    // jisko issue assign ho rahi hai
    let newAssignee: {
        id: string;
        user: { id: string; name: string | null };
    } | null = null;

    if (assigneeChanged) {
        // unassign (null) allow nahi hai, warna findUnique({ id: null }) crash karega
        if (!data.assignedTo) {
            throw new AppError("Assignee is required", 400);
        }

        newAssignee = await prisma.member.findUnique({
            where: { id: data.assignedTo },
            select: {
                id: true,
                user: { select: { id: true, name: true } },
            },
        });

        if (!newAssignee) {
            throw new AppError("Assignee not found", 404);
        }
    }

    // Ek hi write bacha, isliye transaction ki zaroorat nahi
    const updatedIssue = await prisma.issue.update({
        where: { id: issueId },
        data,
    });

    // ── Activities (commit ke baad enqueue, har ek ka alag eventId) ──
    const base = {
        workspaceId: issue.project.workspaceId,
        projectId: issue.projectId,
        actorId,
        entityType: "ISSUE",
        entityId: issue.id,
        entityName: issue.title,
    };

    const activities: CreateActivityInput[] = [];

    if (statusChanged) {
        activities.push({
            ...base,
            eventId: randomUUID(),
            action: "ISSUE_STATUS_CHANGED",
            metadata: { from: issue.status, to: data.status },
        });
    }

    if (priorityChanged) {
        activities.push({
            ...base,
            eventId: randomUUID(),
            action: "ISSUE_PRIORITY_CHANGED",
            metadata: { from: issue.priority, to: data.priority },
        });
    }

    if (assigneeChanged && newAssignee) {
        activities.push({
            ...base,
            eventId: randomUUID(),
            action: "ISSUE_ASSIGNED",
            metadata: {
                fromMemberId: issue.assignee?.id,
                fromMemberName: issue.assignee?.user.name,
                toMemberId: newAssignee.id,
                toMemberName: newAssignee.user.name,
            },
        });
    }

    if (titleChanged || descriptionChanged) {
        activities.push({
            ...base,
            eventId: randomUUID(),
            action: "ISSUE_UPDATED",
            entityName: updatedIssue.title,
            metadata: {
                oldTitle: issue.title,
                newTitle: updatedIssue.title,
                oldDescription: issue.description,
                newDescription: updatedIssue.description,
            },
        });
    }

    try {
        await Promise.all(activities.map((a) => enqueueActivity(a)));
    } catch (error) {
        console.error("Failed to enqueue activities", error);
    }

    // ── Notification: sirf jab assignee badla ho aur khud ko assign na kiya ho ──
    if (assigneeChanged && newAssignee && newAssignee.id !== actorId) {
        try {
            const actor = await prisma.member.findUnique({
                where: { id: actorId },
                include: { user: { select: { name: true } } },
            });

            await enqueueNotification({
                eventId: randomUUID(),
                audience: {
                    type: "member",
                    memberId: newAssignee.id,   // DB row isi member ki
                    userId: newAssignee.user.id, // emit isi user ke room mein
                },
                payload: {
                    workspaceId: issue.project.workspaceId,
                    projectId: issue.projectId,
                    title: "Issue assigned",
                    message: `${actor?.user.name ?? "Someone"} assigned "${updatedIssue.title}" to you in ${issue.project.name}`,
                    type: "ISSUE_ASSIGNED",
                    entityId: updatedIssue.id,
                    entityType: "ISSUE",
                    metadata: {
                        assignedBy: actorId,
                        issueTitle: updatedIssue.title,
                    },
                },
            });
        } catch (error) {
            console.error("Failed to enqueue notification", error);
        }
    }

    return updatedIssue;
}



export async function getIssues(projectId: string) {
    const issues = await prisma.issue.findMany({
        where: { projectId },
        include: {
            assignee: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                            email: true,
                        }
                    }
                }
            },
            creator: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                            email: true,
                        }
                    }
                }
            },
        },
        orderBy: { createdAt: "desc" }
    });

    return issues
}



export async function getMyIssues(workspaceId: string, userId: string) {

    const member = await prisma.member.findUnique({
        where: { userId_workspaceId: { userId, workspaceId } },
    });

    if (!member) throw new AppError("Not a member", 403);

    const issues = await prisma.issue.findMany({
        where: {
            assignedTo: member.id,
        },
        include: {
            project: { select: { name: true, emoji: true, id: true } },
        },
        orderBy: { createdAt: "desc" },
    });
    return issues
}



export async function deleteIssue(issueId: string, actorId: string) {

    const issue = await prisma.issue.findUnique({
        where: {
            id: issueId,
        },
        include: {
            project: true,
        },
    });

    if (!issue) {
        throw new AppError("Issue not found", 404);
    }

    await prisma.issue.delete({
        where: {
            id: issueId,
        },
    });

    try {
        await enqueueActivity(
            {
                eventId: randomUUID(),
                workspaceId: issue.project.workspaceId,
                projectId: issue.projectId,

                actorId,

                action: "ISSUE_DELETED",

                entityType: "ISSUE",
                entityId: issue.id,
                entityName: issue.title,

                metadata: {
                    issueTitle: issue.title,
                },
            },
        )
    } catch (error) {
        console.error("Failed to enqueue activity", error)
    }

    return { success: true }
}