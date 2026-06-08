import prisma from "../lib/prisma";
import AppError from "../utils/AppError";
import { issueInput, UpdateissueInput } from "../validations/issue.validations";
import { createActivity } from "./activites.services";



export async function createIssue(data: issueInput, projectId: string, creatorId: string) {

    const project = await prisma.project.findUnique({
        where: { id: projectId, },
    });

    if (!project) throw new Error("Project not found");


    const issue = await prisma.issue.create({
        data: {
            title: data.title,
            description: data.description,
            status: data.status ?? "TODO",
            priority: data.priority ?? "Medium",
            projectId,
            assignedTo: data.assignedTo,
            createdBy: creatorId,
        },
    });

    await createActivity({
        workspaceId: project.workspaceId,
        projectId: project.id,

        actorId: creatorId,
        action: "ISSUE_CREATED",

        entityType: "ISSUE",
        entityId: issue.id,
        entityName: issue.title,

        targetType: "PROJECT",
        targetId: project.id,
        targetName: project.name,
    });

    return issue;
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

    const issues = prisma.issue.findMany({
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


export async function updateIssue(issueId: string, data: UpdateissueInput, actorId: string) {

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

    const updatedIssue = await prisma.issue.update({
        where: {
            id: issueId,
        },
        data,
    });

    // STATUS CHANGED
    if (data.status && data.status !== issue.status) {
        await createActivity({
            workspaceId: issue.project.workspaceId,
            projectId: issue.projectId,

            actorId,

            action: "ISSUE_STATUS_CHANGED",

            entityType: "ISSUE",
            entityId: issue.id,
            entityName: issue.title,

            targetType: "PROJECT",
            targetId: issue.project.id,
            targetName: issue.project.name,

            metadata: {
                from: issue.status,
                to: data.status,
            },
        });
    }

    // PRIORITY CHANGED
    if (data.priority && data.priority !== issue.priority) {
        await createActivity({
            workspaceId: issue.project.workspaceId,
            projectId: issue.projectId,

            actorId,

            action: "ISSUE_PRIORITY_CHANGED",

            entityType: "ISSUE",
            entityId: issue.id,
            entityName: issue.title,

            targetType: "PROJECT",
            targetId: issue.project.id,
            targetName: issue.project.name,

            metadata: {
                from: issue.priority,
                to: data.priority,
            },
        });
    }

    // ASSIGNEE CHANGED
    if (data.assignedTo && data.assignedTo !== issue.assignedTo) {
        const assignee = await prisma.member.findUnique({
            where: {
                id: data.assignedTo,
            },
            include: {
                user: true,
            },
        });

        await createActivity({
            workspaceId: issue.project.workspaceId,
            projectId: issue.projectId,

            actorId,

            action: "ISSUE_ASSIGNED",

            entityType: "ISSUE",
            entityId: issue.id,
            entityName: issue.title,

            targetType: "MEMBER",
            targetId: assignee?.id,
            targetName: assignee?.user.name,
        });
    }

    // TITLE / DESCRIPTION UPDATED
    const titleChanged = data.title !== undefined && data.title !== issue.title;
    const descriptionChanged = data.description !== undefined && data.description !== issue.description;

    if (titleChanged || descriptionChanged) {
        await createActivity({
            workspaceId: issue.project.workspaceId,
            projectId: issue.projectId,

            actorId,

            action: "ISSUE_UPDATED",

            entityType: "ISSUE",
            entityId: issue.id,
            entityName: updatedIssue.title,

            targetType: "PROJECT",
            targetId: issue.project.id,
            targetName: issue.project.name,
        });
    }

    return updatedIssue;
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

    if (!issue) throw new AppError("Issue not found", 404);


    await prisma.issue.delete({
        where: {
            id: issueId,
        },
    });

    await createActivity({
        workspaceId: issue.project.workspaceId,
        projectId: issue.projectId,

        actorId,

        action: "ISSUE_DELETED",

        entityType: "ISSUE",
        entityId: issue.id,
        entityName: issue.title,

        targetType: "PROJECT",
        targetId: issue.project.id,
        targetName: issue.project.name,
    });

    return {
        success: true,
    };
}
