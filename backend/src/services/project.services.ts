import slugify from "slugify";
import prisma from "../lib/prisma";
import AppError from "../utils/AppError";
import { Prisma } from "@prisma/client";
import { ProjectInput, UpdateProjectInput } from "../validations/project.validations";
import { createActivity } from "./activites.services";


export async function createProject(data: ProjectInput, workspaceId: string, actorId: string) {
    const existing = await prisma.project.findFirst({
        where: {
            name: data.name,
            workspaceId,
        },
    });

    if (existing) {
        throw new AppError("Project with same name already exist", 409);
    }

    const slug = slugify(data.name, {
        lower: true,
        strict: true,
        trim: true,
    });

    const project = await prisma.$transaction(async (tx) => {
        const project = await tx.project.create({
            data: {
                name: data.name,
                slug,
                description: data.description,
                emoji: data.emoji,
                emojiId: data.emojiId,
                workspaceId,
            },
        });

        await createActivity(
            {
                workspaceId,
                projectId: project.id,

                actorId,

                action: "PROJECT_CREATED",

                entityType: "PROJECT",
                entityId: project.id,
                entityName: project.name,
            },
            tx
        );

        return project;
    });

    return project;
}


export async function updateProject(data: UpdateProjectInput, workspaceId: string, projectId: string, actorId: string) {
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            workspaceId,
        },
    });

    if (!project) throw new AppError("Project not found", 404);

    const updatedData: Prisma.ProjectUpdateInput = {};

    if (data.name && data.name !== project.name) {
        updatedData.name = data.name;
        updatedData.slug = slugify(data.name, {
            lower: true,
            strict: true,
            trim: true,
        });
    }

    if (data.description !== undefined) {
        updatedData.description = data.description;
    }

    if (data.emoji !== undefined) {
        updatedData.emoji = data.emoji;
    }

    if (data.emojiId !== undefined) {
        updatedData.emojiId = data.emojiId;
    }

    const updatedProject = await prisma.$transaction(async (tx) => {
        const updated = await tx.project.update({
            where: { id: projectId },
            data: updatedData,
        });

        await createActivity(
            {
                workspaceId,
                projectId: project.id,

                actorId,

                action: "PROJECT_UPDATED",

                entityType: "PROJECT",
                entityId: project.id,
                entityName: updated.name,

                metadata: {
                    oldName: project.name,
                    newName: updated.name,
                },
            },
            tx
        );

        return updated;
    });

    return updatedProject;
}


export async function getProjects(workspaceId: string) {
    const projects = await prisma.project.findMany({ where: { workspaceId: workspaceId } })
    return projects
}


export async function getProjectDetails(projectId: string) {
    const project = await prisma.project.findFirst({ where: { id: projectId }, include: { projectGithub: true } })
    if (!project) {
        throw new AppError("Project not found", 404);
    }
    return project
}


export async function deleteProject(projectId: string, workspaceId: string, actorId: string) {
 
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            workspaceId,
        },
    });

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    await prisma.$transaction(async (tx) => {
        await tx.project.delete({
            where: {
                id: project.id,
            },
        });

        await createActivity(
            {
                workspaceId,
                projectId: project.id,

                actorId,

                action: "PROJECT_DELETED",

                entityType: "PROJECT",
                entityId: project.id,
                entityName: project.name,
            },
            tx
        );
    });

    return {
        success: true,
    };
}


