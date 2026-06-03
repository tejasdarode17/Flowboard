import { NextFunction, Request, Response } from "express";
import { getGitHubAuthUrl, getGitHubRepositories, handleGitHubCallback, linkRepositoryToProject } from "../services/github.services";
import AppError from "../utils/AppError";
import { generateGitHubState } from "../utils/jwt";
import { linkRepositorySchema } from "../validations/github.validations";


export async function connectGitHubController(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.userId;
        const workspaceSlug = req.workspace.slug;

        if (!userId || !workspaceSlug) {
            return next(new AppError("Missing context", 400));
        }

        const state = generateGitHubState(userId, workspaceSlug);
        const url = getGitHubAuthUrl(state);

        return res.status(200).json({
            success: true,
            data: url,
        });

    } catch (error) {
        next(error);
    }
}


export async function githubCallbackController(req: Request, res: Response, next: NextFunction) {
    try {
        const code = req.query.code;
        const state = req.query.state;

        if (!code || Array.isArray(code)) {
            return next(new AppError("GitHub code required", 400));
        }

        if (!state || Array.isArray(state)) {
            return next(new AppError("GitHub state required", 400));
        }

        const { workspaceSlug } = await handleGitHubCallback(String(code), String(state))

        return res.redirect(`${process.env.CLIENT_URL}/${workspaceSlug}/settings?github=connected`);

    } catch (error) {
        next(error);
    }
}


export async function getGitHubRepositoriesController(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return next(new AppError("Unauthorized", 401));
        }

        const repositories = await getGitHubRepositories(userId);

        return res.status(200).json({
            success: true,
            message: "Repositories fetched successfully",
            data: repositories,
        });

    } catch (error) {
        next(error);
    }
}


export async function linkRepositoryController(req: Request, res: Response, next: NextFunction) {
    try {
        const body = linkRepositorySchema.parse(req.body);

        const repository = await linkRepositoryToProject(body.projectId, body.repoId, body.repoFullName);

        return res.status(200).json({
            success: true,
            message: "Repository linked successfully",
            data: repository,
        });
        
    } catch (error) {
        next(error);
    }
}