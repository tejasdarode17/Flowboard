import { projectSchema } from '../validations/project.validations';
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { createProject, getProjectDetails, getProjects, updateProject } from '../services/project.services';

export async function createProjectController(req: Request, res: Response, next: NextFunction) {
    try {

        const workspaceId = req.workspace.id
        const body = projectSchema.parse(req.body)
        const project = await createProject(body, workspaceId,)

        return res.status(200).json({
            success: "true",
            message: "Project created Successfully",
            data: project
        })

    } catch (error) {
        next(error)
    }
}


export async function updateProjectController(req: Request, res: Response, next: NextFunction) {

    try {
        const workspaceId = req.workspace.id
        const projectId = req.params.projectId

        if (!projectId || Array.isArray(projectId)) {
            return next(new AppError("Workspace Id is required", 401))
        }

        const body = projectSchema.parse(req.body)
        const project = await updateProject(body, workspaceId, projectId)

        return res.status(200).json({
            success: "true",
            message: "Project updated Successfully",
            data: project
        })

    } catch (error) {
        next(error)
    }
}


export async function getProjectsController(req: Request, res: Response, next: NextFunction) {
    try {

        const workspaceId = req.workspace.id
        const projects = await getProjects(workspaceId)

        return res.status(200).json({
            success: "true",
            message: "Projects fetched Successfully",
            data: projects
        })

    } catch (error) {
        next(error)
    }
}


export async function getProjectDetailsController(req: Request, res: Response, next: NextFunction) {
    try {
        const projectId = req.params.projectId

        if (!projectId || Array.isArray(projectId)) {
            return next(new AppError("Workspace Id is required", 401))
        }
        const project = await getProjectDetails(projectId)

        return res.status(200).json({
            success: "true",
            message: "Project fetched Successfully",
            data: project
        })

    } catch (error) {
        next(error)
    }
}


