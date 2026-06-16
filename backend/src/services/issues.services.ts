import prisma from "../lib/prisma";
import AppError from "../utils/AppError";
import { issueInput, UpdateissueInput } from "../validations/issue.validations";
import { createActivity } from "./activites.services";
import { createNotification } from "./notification.services";
import { emitToUser } from "../socket/socket";

export async function createIssue(data: issueInput, projectId: string, actorId: string) {
    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
        },
    });

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    // Core business transaction activity and issue creation
    const issue = await prisma.$transaction(async (tx) => {
        const issue = await tx.issue.create({
            data: {
                title: data.title,
                description: data.description,

                status: data.status ?? "TODO",
                priority: data.priority ?? "Medium",

                projectId,

                assignedTo: data.assignedTo,
                createdBy: actorId,
            },
        });

        await createActivity(
            {
                workspaceId: project.workspaceId,
                projectId: project.id,

                actorId,

                action: "ISSUE_CREATED",

                entityType: "ISSUE",
                entityId: issue.id,
                entityName: issue.title,
            },
            tx
        );

        return issue;
    });

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
                const notification = await createNotification({
                    memberId: data.assignedTo, //owner of this notifications 
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
                });

              
                emitToUser(assignee.userId, "notification:new", notification)

            }
        } catch (error) {
            // notification related error we dont need at forntend.
            console.error("Failed to create notification:", error);
        }
    }
    return issue;
}


export async function updateIssue(issueId: string, data: UpdateissueInput, actorId: string) {

    const issue = await prisma.issue.findUnique({
        where: {
            id: issueId,
        },
        include: {
            project: true,
            assignee: {
                include: {
                    user: {
                        select: {
                            name: true,
                        },
                    },
                },
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

    //assignee means assignto jisko ye assign ho
    let newAssignee: {
        id: string;
        user: {
            name: string | null;
            id: string
        };
    } | null = null;

    if (assigneeChanged) {

        newAssignee = await prisma.member.findUnique({
            where: {
                id: data.assignedTo!,
            },
            select: {
                id: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!newAssignee) {
            throw new AppError("Assignee not found", 404);
        }
    }


    const updatedIssue = await prisma.$transaction(async (tx) => {

        const updatedIssue = await tx.issue.update({
            where: {
                id: issueId,
            },
            data,
        });

        if (statusChanged) {
            await createActivity(
                {
                    workspaceId: issue.project.workspaceId,
                    projectId: issue.projectId,

                    actorId,

                    action: "ISSUE_STATUS_CHANGED",

                    entityType: "ISSUE",
                    entityId: issue.id,
                    entityName: issue.title,

                    metadata: {
                        from: issue.status,
                        to: data.status,
                    },
                },
                tx
            );
        }

        if (priorityChanged) {
            await createActivity(
                {
                    workspaceId: issue.project.workspaceId,
                    projectId: issue.projectId,

                    actorId,

                    action: "ISSUE_PRIORITY_CHANGED",

                    entityType: "ISSUE",
                    entityId: issue.id,
                    entityName: issue.title,

                    metadata: {
                        from: issue.priority,
                        to: data.priority,
                    },
                },
                tx
            );
        }

        if (assigneeChanged && newAssignee) {
            await createActivity(
                {
                    workspaceId: issue.project.workspaceId,
                    projectId: issue.projectId,

                    actorId,

                    action: "ISSUE_ASSIGNED",

                    entityType: "ISSUE",
                    entityId: issue.id,
                    entityName: issue.title,

                    metadata: {
                        fromMemberId: issue.assignee.id,
                        fromMemberName: issue.assignee.user.name,

                        toMemberId: newAssignee.id,
                        toMemberName: newAssignee.user.name,
                    },
                },
                tx
            );

        }

        if (titleChanged || descriptionChanged) {
            await createActivity(
                {
                    workspaceId: issue.project.workspaceId,
                    projectId: issue.projectId,

                    actorId,

                    action: "ISSUE_UPDATED",

                    entityType: "ISSUE",
                    entityId: issue.id,
                    entityName: updatedIssue.title,

                    metadata: {
                        oldTitle: issue.title,
                        newTitle: updatedIssue.title,

                        oldDescription: issue.description,
                        newDescription: updatedIssue.description,
                    },
                },
                tx
            );
        }

        return updatedIssue;
    });



    //notification only if the assignee changed 
    if (assigneeChanged && newAssignee && newAssignee.id !== actorId) {

        try {
            const actor = await prisma.member.findUnique({
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
            });

            const notification = await createNotification({
                memberId: newAssignee.id,

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
            });

            
            emitToUser(newAssignee.user.id, "notification:new", notification)

        } catch (error) {
            console.error("Failed to create notification", error);
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
            status: { not: "DONE" },
        },
        include: {
            project: { select: { name: true, emoji: true, id: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
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

    await prisma.$transaction(async (tx) => {

        await tx.issue.delete({
            where: {
                id: issueId,
            },
        });

        await createActivity(
            {
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
            tx
        );
    });

    return {
        success: true,
    };
}