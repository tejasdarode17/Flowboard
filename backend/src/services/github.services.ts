import axios from "axios";
import prisma from "../lib/prisma";
import AppError from "../utils/AppError";
import { verifyGitHubState } from "../utils/jwt";
import { GithubEvent, GithubWebhookPayload, } from "../types/githubWebhook.types";
import { IssueCommentEvent, IssuesEvent, PullRequestEvent, PushEvent } from "@octokit/webhooks-types";
import { extractGithubUsername } from "../utils/githubUtils";
import { Prisma } from "@prisma/client";
import { createActivity } from "./activites.services";

export function getGithubAuthUrl(state: string) {
    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        redirect_uri: process.env.GITHUB_CALLBACK_URL!,
        scope: "repo",
        state,
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
}


export async function handleGithubCallback(code: string, state: string) {

    const { userId, workspaceSlug } = verifyGitHubState(state);

    const params = new URLSearchParams();
    params.append("client_id", process.env.GITHUB_CLIENT_ID!);
    params.append("client_secret", process.env.GITHUB_CLIENT_SECRET!);
    params.append("code", code);

    const tokenResponse = await axios.post("https://github.com/login/oauth/access_token",
        params.toString(),
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );
    
    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
        throw new AppError("Failed to get GitHub token", 400);
    }

    const githubUser = await axios.get("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github+json",
        },
    });

    const data = githubUser.data;

    const account = await prisma.githubAccount.upsert({
        where: { userId },
        update: {
            accessToken,
            githubId: String(data.id),
            username: data.login,
        },
        create: {
            userId,
            accessToken,
            githubId: String(data.id),
            username: data.login,
        },
    });

    return { account, workspaceSlug };
}


export async function getGithubRepositories(userId: string) {

    const githubAccount = await prisma.githubAccount.findUnique({
        where: { userId, },
    });

    if (!githubAccount) {
        throw new AppError("GitHub account not connected", 400);
    }

    const response = await axios.get("https://api.github.com/user/repos",
        {
            headers: {
                Authorization: `Bearer ${githubAccount.accessToken}`,
                Accept: "application/vnd.github+json",
            },
        }
    );

    return response.data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        private: repo.private,
        defaultBranch: repo.default_branch,
    }));

}


//this service used in linkRepositoryToProject not in controller
export async function getExistingGithubWebhook(accessToken: string, repoFullName: string) {

    const [owner, repo] = repoFullName.split("/");
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/hooks`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github+json",
            },
        }
    );

    const hooks = response.data;

    const existingWebhook = hooks.find((hook: any) => hook.config?.url === `${process.env.BACKEND_URL}/api/github/webhook`);

    return existingWebhook;
}

//this service used in linkRepositoryToProject not in controller
export async function createGithubWebhook(accessToken: string, repoFullName: string) {

    const existingWebhook = await getExistingGithubWebhook(accessToken, repoFullName);

    if (existingWebhook) {
        return existingWebhook;
    }

    const [owner, repo] = repoFullName.split("/");

    const response = await axios.post(`https://api.github.com/repos/${owner}/${repo}/hooks`,
        {
            name: "web",
            active: true,
            events: ["push", "pull_request"],
            config: {
                url: `${process.env.BACKEND_URL}/api/github/webhook`,
                content_type: "json",
                secret: process.env.GITHUB_WEBHOOK_SECRET,
            },
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github+json",
            },
        }
    );

    return response.data;
}


export async function linkRepositoryToProject(projectId: string, repoId: string, repoFullName: string, userId: string) {

    const project = await prisma.project.findUnique({
        where: { id: projectId },
    });

    if (!project) {
        throw new AppError("Project not found", 404);
    }

    const existingLink = await prisma.projectGithub.findUnique({
        where: { projectId },
    });

    if (existingLink) {
        throw new AppError("Repository already linked to this project", 400);
    }

    const githubAccount = await prisma.githubAccount.findUnique({
        where: { userId },
    });

    if (!githubAccount) {
        throw new AppError("GitHub account not connected", 400);
    }

    const webhook = await createGithubWebhook(
        githubAccount.accessToken,
        repoFullName
    );

    const projectGithub = await prisma.projectGithub.create({
        data: {
            projectId,
            repoId,
            repoFullName,
            webhookId: String(webhook.id),
        },
    });

    return projectGithub;
}



export async function processGitHubWebhook(event: GithubEvent, payload: GithubWebhookPayload) {
    const repoFullName = payload.repository.full_name;

    const projectGithub = await prisma.projectGithub.findFirst({
        where: {
            repoFullName,
        },
        include: {
            project: true,
        },
    });

    if (!projectGithub) return;

    const username = extractGithubUsername(payload, event);

    if (!username) return;

    const githubAccount = await prisma.githubAccount.findFirst({
        where: {
            username,
        },
    });

    if (!githubAccount) return;

    const member = await prisma.member.findFirst({
        where: {
            userId: githubAccount.userId,
            workspaceId: projectGithub.project.workspaceId,
        },
    });

    if (!member) return;

    // ==================================
    // PUSH
    // ==================================

    if (event === "push") {
        const pushPayload = payload as PushEvent;

        await createActivity({
            workspaceId: projectGithub.project.workspaceId,
            projectId: projectGithub.projectId,
            actorId: member.id,

            action: "PUSH",

            entityType: "BRANCH",
            entityId: pushPayload.ref,
            entityName: pushPayload.ref.replace("refs/heads/", ""),

            targetType: "PROJECT",
            targetId: projectGithub.project.id,
            targetName: projectGithub.project.name,

            metadata: {
                repository: pushPayload.repository.full_name,
                commitCount: pushPayload.commits.length,
                commitMessage: pushPayload.head_commit?.message,
            },
        });

        return;
    }

    // ==================================
    // PULL REQUEST
    // ==================================

    if (event === "pull_request") {
        const prPayload = payload as PullRequestEvent;

        const actionMap: Record<string, string> = {
            opened: "PR_OPENED",
            closed: prPayload.pull_request.merged
                ? "PR_MERGED"
                : "PR_CLOSED",
            reopened: "PR_REOPENED",
        };

        const activityAction =
            actionMap[prPayload.action];

        if (!activityAction) return;

        await createActivity({
            workspaceId: projectGithub.project.workspaceId,
            projectId: projectGithub.projectId,
            actorId: member.id,

            action: activityAction,

            entityType: "PULL_REQUEST",
            entityId: String(prPayload.number),
            entityName: prPayload.pull_request.title,

            targetType: "PROJECT",
            targetId: projectGithub.project.id,
            targetName: projectGithub.project.name,

            metadata: {
                number: prPayload.number,
                url: prPayload.pull_request.html_url,
            },
        });

        return;
    }

    // ==================================
    // ISSUE
    // ==================================

    if (event === "issues") {
        const issuePayload = payload as IssuesEvent;

        const actionMap: Record<string, string> = {
            opened: "ISSUE_CREATED",
            closed: "ISSUE_COMPLETED",
            reopened: "ISSUE_REOPENED",
        };

        const activityAction =
            actionMap[issuePayload.action];

        if (!activityAction) return;

        await createActivity({
            workspaceId: projectGithub.project.workspaceId,
            projectId: projectGithub.projectId,
            actorId: member.id,

            action: activityAction,

            entityType: "ISSUE",
            entityId: String(issuePayload.issue.number),
            entityName: issuePayload.issue.title,

            targetType: "PROJECT",
            targetId: projectGithub.project.id,
            targetName: projectGithub.project.name,
        });

        return;
    }

    // ==================================
    // ISSUE COMMENT
    // ==================================

    if (event === "issue_comment") {
        
        const commentPayload = payload as IssueCommentEvent;

        if (commentPayload.action !== "created") {
            return;
        }

        await createActivity({
            workspaceId: projectGithub.project.workspaceId,
            projectId: projectGithub.projectId,
            actorId: member.id,

            action: "COMMENT_ADDED",

            entityType: "ISSUE",
            entityId: String(commentPayload.issue.number),
            entityName: commentPayload.issue.title,

            targetType: "PROJECT",
            targetId: projectGithub.project.id,
            targetName: projectGithub.project.name,
        });

        return;
    }
}