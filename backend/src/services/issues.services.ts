import prisma from "../lib/prisma";
import AppError from "../utils/AppError";
import { issueInput, UpdateissueInput } from "../validations/issue.validations";



export async function createIssue(data: issueInput, projectId: string, creatorId: string) {

    const issue = await prisma.issue.create({
        data: {
            title: data.title,
            description: data.description,
            status: data.status ?? "TODO",
            priority: data.priority ?? "Medium",
            projectId: projectId,
            assignedTo: data.assignedTo,
            createdBy: creatorId
        }
    })

    return issue
};


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
};


export async function updateIssue(issueId: string, data: UpdateissueInput) {
    const issue = await prisma.issue.findUnique({ where: { id: issueId } });
    if (!issue) throw new AppError("Issue not found", 404);

    return prisma.issue.update({
        where: { id: issueId },
        data,
    });
}


export async function deleteIssue(issueId: string) {
    return prisma.issue.delete({ where: { id: issueId } });
};

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