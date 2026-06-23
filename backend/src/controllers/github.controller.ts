import { NextFunction, Request, Response } from "express";
import { getGithubAuthUrl, getGithubRepositories, handleGithubCallback, linkRepositoryToProject, processGitHubWebhook, unlinkGithubAccount, unlinkRepositoryFromProject, } from "../services/github.services";
import AppError from "../utils/AppError";
import { generateGitHubState } from "../utils/jwt";
import { linkRepositorySchema } from "../validations/github.validations";
import { verifyGitHubWebhookSignature } from "../utils/githubUtils";
import { GithubEvent, GithubWebhookPayload, } from "../types/githubWebhook.types";
import prisma from "../lib/prisma";


export async function connectGitHubController(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return next(new AppError("Not Athunticated", 400));
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return next(new AppError("Athunticated", 400));
        }

        const state = generateGitHubState(userId, user?.username);
        const url = getGithubAuthUrl(state);

        return res.status(200).json({
            success: true,
            data: url,
            message: "Connection Successfull",

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

        const { username } = await handleGithubCallback(String(code), String(state))

        return res.redirect(`${process.env.CLIENT_URL}/profile/${username}/settings`);

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

        const repositories = await getGithubRepositories(userId);

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

        const userId = req.user?.userId

        if (!userId) {
            return next(new AppError("Unauthorized", 401));
        }

        const repository = await linkRepositoryToProject(body.projectId, body.repoId, body.repoFullName, userId);

        return res.status(200).json({
            success: true,
            message: "Repository linked successfully",
            data: repository,
        });

    } catch (error) {
        next(error);
    }
}


export async function unlinkGithubAccountController(req: Request, res: Response) {
    const userId = req.user?.userId;
    if (!userId) throw new AppError("Unauthorized", 401);

    await unlinkGithubAccount(userId);

    res.status(200).json({
        success: true,
        message: "GitHub account unlinked successfully",
    });
}

export async function unlinkRepositoryController(req: Request, res: Response) {
    const userId = req.user?.userId;
    const { projectId } = req.params;

    if (!userId) throw new AppError("Unauthorized", 401);
    if (!projectId || Array.isArray(projectId)) throw new AppError("Unauthorized", 401);

    await unlinkRepositoryFromProject(projectId, userId);

    res.status(200).json({
        success: true,
        message: "Repository unlinked successfully",
    });
}


export async function githubWebhookController(req: Request, res: Response, next: NextFunction) {
    try {
        const signature =
            req.headers["x-hub-signature-256"];

        if (!signature || Array.isArray(signature)) {
            return next(new AppError("Missing webhook signature", 401));
        }

        const isValid = verifyGitHubWebhookSignature(req.body as Buffer, signature);

        if (!isValid) {
            return next(new AppError("Invalid webhook signature", 401));
        }

        const event = req.headers["x-github-event"];

        if (!event || Array.isArray(event)) {
            return next(new AppError("Missing GitHub event", 400));
        }

        const supportedEvents: GithubEvent[] = [
            "push",
            "pull_request",
        ];

        if (!supportedEvents.includes(event as GithubEvent)) {
            return res.status(200).json({
                success: true,
                message: "Event ignored",
            });
        }

        const payload = JSON.parse((req.body as Buffer).toString("utf8")) as GithubWebhookPayload;

        const deliveryId = req.headers["x-github-delivery"];

        console.log("Webhook verified");
        console.log("Event:", event);
        console.log("Delivery ID:", deliveryId);

        await processGitHubWebhook(event as GithubEvent, payload);

        return res.status(200).json({
            success: true,
        });

    } catch (error) {
        next(error);
    }
}