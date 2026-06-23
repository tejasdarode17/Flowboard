// issue.controllers.ts
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { createIssue, deleteIssue, getIssues, getMyIssues, updateIssue, } from "../services/issues.services";
import { issueSchema, updateissueSchema, } from "../validations/issue.validations";


export async function createIssueController(req: Request, res: Response, next: NextFunction) {
    try {
        const projectId = req.params.projectId;
        const creatorId = req.member?.id;

        if (!projectId || Array.isArray(projectId)) {
            return next(new AppError("Project Id is required", 401))
        }

        if (!creatorId) {
            return next(new AppError("Unauthorized", 401))
        }

        const body = issueSchema.parse(req.body);

        const issue = await createIssue(body, projectId, creatorId);

        return res.status(201).json({
            success: true,
            message: "Issue created successfully",
            data: issue
        });
    } catch (error) {
        next(error);
    }
};


export async function getIssuesController(req: Request, res: Response, next: NextFunction) {
    try {
        const projectId = req.params.projectId;
        if (!projectId || Array.isArray(projectId)) {
            return next(new AppError("project Id is required", 401))
        }

        const issues = await getIssues(projectId);

        return res.status(200).json({
            success: true,
            message: "Issues fetched successfully",
            data: issues
        });
    } catch (error) {
        next(error);
    }
};


export async function getMyIssuesController(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.userId;
        const workspaceId = req.workspace?.id;
        if (!userId || !workspaceId) return next(new AppError("Not authenticated", 401));
        const issues = await getMyIssues(workspaceId, userId);
        return res.status(200).json({
            success: true,
            message: "Issue fetched successfully",
            data: issues
        });
    } catch (error) {
        next(error);
    }
};


export async function updateIssueController(req: Request, res: Response, next: NextFunction) {
    try {
        const issueId = req.params.issueId;
        const memberId = req.member?.id

        if (!issueId || Array.isArray(issueId)) {
            return next(new AppError("issue Id is required", 401))
        }

        if (!memberId || Array.isArray(memberId)) {
            return next(new AppError("Unauthorized", 401))
        }

        const body = updateissueSchema.parse(req.body);
        const issue = await updateIssue(issueId, body, memberId);

        return res.status(200).json({
            success: true,
            message: "Issue updated successfully",
            data: issue
        });
    } catch (error) {
        next(error);
    }
};


export async function deleteIssueController(req: Request, res: Response, next: NextFunction) {
    try {
        const issueId = req.params.issueId;
        const memberId = req.member?.id

        if (!memberId || Array.isArray(memberId)) {
            return next(new AppError("Unauthorized", 401))
        }

        if (!issueId || Array.isArray(issueId)) {
            return next(new AppError("issue Id is required", 401))
        }

        await deleteIssue(issueId, memberId);

        return res.status(200).json({
            success: true,
            message: "Issue deleted successfully",
            data: null
        });
    } catch (error) {
        next(error);
    }
};