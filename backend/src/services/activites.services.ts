import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { ActivityFilters, CreateActivityInput } from "../types/activity.types";


export async function createActivity(data: CreateActivityInput, tx: Prisma.TransactionClient | typeof prisma = prisma) {
    const activity = await tx.activity.create({
        data,
    });

    return activity
}

export async function getActivities(workspaceId: string, filters: ActivityFilters) {

    const limit = Number(filters.limit) || 20;

    let dateFilter;

    if (filters.range === "today") {
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        dateFilter = {
            gte: start,
        };
    }

    if (filters.range === "week") {
        const start = new Date();
        start.setDate(start.getDate() - 7);

        dateFilter = {
            gte: start,
        };
    }

    if (filters.range === "month") {
        const start = new Date();
        start.setDate(start.getDate() - 30);

        dateFilter = {
            gte: start,
        };
    }



    const activities = await prisma.activity.findMany({
      
        where: {
            workspaceId,
            ...(dateFilter && { createdAt: dateFilter }),
        },

        include: {
            actor: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                            email: true,
                        },
                    },
                },
            },
            project: {
                select: {
                    name: true
                }
            }
        },

        orderBy: {
            createdAt: "desc",
        },

        take: limit + 1,

        ...(filters.cursor && {
            cursor: { id: filters.cursor },
            skip: 1,
        }),

    });

    const hasMore = activities.length > limit;
    const items = hasMore ? activities.slice(0, limit) : activities;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return {
        activities: items,
        nextCursor,
        hasMore,
    };
}


export async function getRecentActivities(workspaceId: string) {
    const activities = await prisma.activity.findMany({
        where: {
            workspaceId,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
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
                        }
                    }

                },
            },
        },
    });

    return activities
}













// export async function getProjectActivities(projectId: string) {
//     const activities = await prisma.activity.findMany({
//         where: {
//             projectId,
//         },
//         orderBy: {
//             createdAt: "desc",
//         },
//         take: 10,
//         include: {
//             actor: {
//                 include: {
//                     user: {
//                         select: {
//                             name: true,
//                             username: true,
//                             mobile: true,
//                             email: true,
//                             avatar: true,
//                         }
//                     }
//                 },
//             },
//         },
//     });

//     return activities

// }




