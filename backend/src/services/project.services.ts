import slugify from "slugify";
import prisma from "../lib/prisma";
import AppError from "../utils/AppError";
import { Prisma } from "@prisma/client";
import { ProjectInput, UpdateProjectInput } from "../validations/project.validations";

export async function createProject(data: ProjectInput, workspaceId: string,) {

    const existing = await prisma.project.findFirst({
        where: { name: data.name, workspaceId: workspaceId }
    })
    if (existing) {
        throw new AppError("Project with same name already exist", 409)
    }

    const slug = slugify(data.name, {
        lower: true,
        strict: true,
        trim: true,
    });

    const project = await prisma.project.create({
        data: {
            name: data.name,
            slug: slug,
            description: data.description,
            emoji: data.emoji,
            emojiId: data.emojiId,
            workspaceId: workspaceId,
        }
    })

    return project

}


export async function updateProject(data: UpdateProjectInput, workspaceId: string, projectId: string) {

    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            workspaceId,
        },
    });

    if (!project) {
        throw new AppError("Project not found", 404);
    }

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

    try {
        return await prisma.project.update({
            where: { id: projectId, },
            data: updatedData,
        });
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new AppError("Project with same name already exists", 409);
        }
        throw error;
    }
}


export async function getProjects(workspaceId: string) {
    const projects = await prisma.project.findMany({ where: { workspaceId: workspaceId } })
    return projects
}


export async function getProjectDetails(projectId: string) {

    const project = await prisma.project.findFirst({ where: { id: projectId }, include: { projectGitHub: true } })
    if (!project) {
        throw new AppError("Project not found", 404);
    }
    return project
}

