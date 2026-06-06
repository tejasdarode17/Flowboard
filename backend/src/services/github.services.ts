import axios from "axios";
import prisma from "../lib/prisma";
import AppError from "../utils/AppError";
import { verifyGitHubState } from "../utils/jwt";
import { extractGitHubUsername, } from "../utils/githubUtils";

export function getGitHubAuthUrl(state: string) {
    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        redirect_uri: process.env.GITHUB_CALLBACK_URL!,
        scope: "repo",
        state,
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
}


export async function handleGitHubCallback(code: string, state: string) {

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

    const account = await prisma.gitHubAccount.upsert({
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


export async function getGitHubRepositories(userId: string) {

    const githubAccount = await prisma.gitHubAccount.findUnique({
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
export async function getExistingGitHubWebhook(accessToken: string, repoFullName: string) {

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

    const existingWebhook = hooks.find(
        (hook: any) =>
            hook.config?.url === `${process.env.BACKEND_URL}/api/github/webhook`
    );

    return existingWebhook;
}

//this service used in linkRepositoryToProject not in controller
export async function createGitHubWebhook(accessToken: string, repoFullName: string) {

    const existingWebhook = await getExistingGitHubWebhook(accessToken, repoFullName);

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

    const existingLink = await prisma.projectGitHub.findUnique({
        where: { projectId },
    });

    if (existingLink) {
        throw new AppError("Repository already linked to this project", 400);
    }

    const githubAccount = await prisma.gitHubAccount.findUnique({
        where: { userId },
    });

    if (!githubAccount) {
        throw new AppError("GitHub account not connected", 400);
    }

    const webhook = await createGitHubWebhook(
        githubAccount.accessToken,
        repoFullName
    );

    const projectGithub = await prisma.projectGitHub.create({
        data: {
            projectId,
            repoId,
            repoFullName,
            webhookId: String(webhook.id),
        },
    });

    return projectGithub;
}


export async function processGitHubWebhook(event: string, payload: any) {
    const repoFullName = payload.repository?.full_name;
    if (!repoFullName) return;

    const projectGithub = await prisma.projectGitHub.findFirst({
        where: {
            repoFullName,
        },
        include: {
            project: true,
        },
    });

    if (!projectGithub) return;

    const username = extractGitHubUsername(payload, event);

    if (!username) return;

    const githubAccount = await prisma.gitHubAccount.findFirst({
        where: { username },
    });

    if (!githubAccount) return;

    const member = await prisma.member.findFirst({
        where: {
            userId: githubAccount.userId,
            workspaceId: projectGithub.project.workspaceId,
        },
    });

    if (!member) return;

    if (event === "push") {
        await prisma.activity.create({
            data: {
                workspaceId: projectGithub.project.workspaceId,
                projectId: projectGithub.projectId,
                actorId: member.id,
                action: "PUSH",
                metadata: payload,
            },
        });
    }

    if (event === "pull_request") {
        await prisma.activity.create({
            data: {
                workspaceId: projectGithub.project.workspaceId,
                projectId: projectGithub.projectId,
                actorId: member.id,
                action: `PR_${payload.action.toUpperCase()}`,
                metadata: payload.pull_request,
            },
        });
    }







}

