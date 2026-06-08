import prisma from "../lib/prisma";
import { CreateActivityInput } from "../types/activity.types";


export async function createActivity(data: CreateActivityInput) {
    const activity = await prisma.activity.create({
        data,
    });

    return activity
}

export async function getWorkspaceRecentActivities(workspaceId: string) {
    const activities = await prisma.activity.findMany({
        where: {
            workspaceId,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 10,
        include: {
            actor: {
                include: {
                    user: {
                        select: {
                            name: true,
                            username: true,
                            mobile: true,
                            email: true,
                            avatar: true,
                            // githubAccount: true,
                        }
                    }

                },
            },
        },
    });

    return activities
}


export async function getProjectRecentActivities(projectId: string) {
    const activities = await prisma.activity.findMany({
        where: {
            projectId,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 10,
        include: {
            actor: {
                include: {
                    user: {
                        select: {
                            name: true,
                            username: true,
                            mobile: true,
                            email: true,
                            avatar: true,
                            // githubAccount: true,
                        }
                    }
                },
            },
        },
    });

    return activities

}




