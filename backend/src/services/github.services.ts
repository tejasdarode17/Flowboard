import axios from "axios";
import prisma from "../lib/prisma";
import AppError from "../utils/AppError";
import { verifyGitHubState } from "../utils/jwt";
import { GithubEvent, GithubWebhookPayload, } from "../types/githubWebhook.types";
import { PullRequestEvent, PushEvent, } from "@octokit/webhooks-types";
import { extractGithubUsername } from "../utils/githubUtils";
import { createActivity } from "./activites.services";
import { createNotification } from "./notification.services";
import { ActivityAction } from "@prisma/client";
import { emitToWorkspace } from "../socket/socket";  

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

    const { userId, username } = verifyGitHubState(state);

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


    return { account, username };
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


export async function unlinkGithubAccount(userId: string) {
    const githubAccount = await prisma.githubAccount.findUnique({
        where: { userId },
    });
    if (!githubAccount) throw new AppError("GitHub account not connected", 400);
    await prisma.githubAccount.delete({ where: { userId } });
}


export async function unlinkRepositoryFromProject(projectId: string, userId: string) {
    const projectGithub = await prisma.projectGithub.findUnique({
        where: { projectId },
    });

    if (!projectGithub) throw new AppError("No repository linked to this project", 400);

    const githubAccount = await prisma.githubAccount.findUnique({
        where: { userId },
    });

    if (!githubAccount) throw new AppError("GitHub account not connected", 400);

    // webhook delete from github
    if (projectGithub.webhookId) {
        const [owner, repo] = projectGithub.repoFullName.split("/");
        try {
            await axios.delete(
                `https://api.github.com/repos/${owner}/${repo}/hooks/${projectGithub.webhookId}`,
                {
                    headers: {
                        Authorization: `Bearer ${githubAccount.accessToken}`,
                        Accept: "application/vnd.github+json",
                    },
                }
            );
        } catch (error) {
            console.error("Failed to delete webhook", error);
        }
    }

    await prisma.projectGithub.delete({ where: { projectId } });
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
        include: {
            user: true
        }
    });

    if (!member) return;

    const workspaceId = projectGithub.project.workspaceId;
    const projectId = projectGithub.projectId;

    // PUSH
    if (event === "push") {
        const push = payload as PushEvent;

        await createActivity({
            workspaceId,
            projectId,

            actorId: member.id,

            action: "PUSH",

            entityType: "BRANCH",
            entityId: push.ref,
            entityName: push.ref.replace("refs/heads/", ""),

            metadata: {
                repository: push.repository.full_name,
                commitCount: push.commits.length,
                commitMessage: push.head_commit?.message,
                commitSha: push.head_commit?.id?.slice(0, 7),
                commitUrl: push.head_commit?.url,
                branch: push.ref.replace("refs/heads/", ""),
            },
        });

        return;
    }

    // PULL REQUEST
    if (event === "pull_request") {
        const pr = payload as PullRequestEvent;

        const actionMap: Record<string, ActivityAction | null> = {
            opened: ActivityAction.PR_OPENED,
            closed: pr.pull_request.merged ? ActivityAction.PR_MERGED : ActivityAction.PR_CLOSED,
            reopened: ActivityAction.PR_REOPENED,
        };

        const action = actionMap[pr.action];

        if (!action) {
            return;
        }

        await prisma.$transaction(async (tx) => {
            await createActivity(
                {
                    workspaceId,
                    projectId,

                    actorId: member.id,

                    action,

                    entityType: "PULL_REQUEST",
                    entityId: String(pr.number),
                    entityName: pr.pull_request.title,

                    metadata: {
                        number: pr.number,
                        url: pr.pull_request.html_url,
                        repository: pr.repository.full_name,
                        sourceBranch: pr.pull_request.head.ref,
                        targetBranch: pr.pull_request.base.ref,
                    },
                },
                tx
            );
        });

        if (action === "PR_MERGED") {
            try {
                const members = await prisma.member.findMany({
                    where: {
                        workspaceId,
                        NOT: {
                            id: member.id,
                        },
                    },
                });

                await Promise.all(
                    members.map((m) =>
                        createNotification({
                            memberId: m.id,

                            workspaceId,
                            projectId,

                            title: "Pull Request Merged",

                            message: `${pr.pull_request.title} was merged`,

                            type: "PR_MERGED",

                            entityId: String(pr.number),
                            entityType: "PULL_REQUEST",

                            metadata: {
                                number: pr.number,
                                url: pr.pull_request.html_url,
                                repository: pr.repository.full_name,
                                sourceBranch: pr.pull_request.head.ref,
                                targetBranch: pr.pull_request.base.ref,
                            },
                        })
                    )
                );

                emitToWorkspace(workspaceId, "notification:new", {
                    workspaceId: workspaceId,
                    projectId,
                    title: "Pull Request Merged",
                    message: `${member.user.name} Merged Pull Request in ${projectGithub.project.name}`,

                    type: "PR_MERGED",

                    entityId: String(pr.number),
                    entityType: "PULL_REQUEST",

                    metadata: {
                        url: pr.pull_request.html_url,
                        prNumber: pr.number,
                        mergedBy: member.id,
                        mergedByName: member.user.name,
                        sourceBranch: pr.pull_request.head.ref,
                        targetBranch: pr.pull_request.base.ref,
                    },
                })

            } catch (error) {
                console.error(
                    "Failed to create PR notifications",
                    error
                );
            }
        }

        return;
    }
}




//if the owner disconncted himself forom the github we dont want to delete webhook cuz 
//there are still members who is creation events 
// export async function unlinkGithubAccount(userId: string) {
//   const githubAccount = await prisma.githubAccount.findUnique({
//     where: { userId },
//   });

//   if (!githubAccount) {
//     throw new AppError("GitHub account not connected", 400);
//   }

//   const linkedRepos = await prisma.projectGithub.findMany();

//   for (const repo of linkedRepos) {
//     if (!repo.webhookId) continue;

//     const [owner, repository] = repo.repoFullName.split("/");

//     try {
//       await axios.delete(
//         `https://api.github.com/repos/${owner}/${repository}/hooks/${repo.webhookId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${githubAccount.accessToken}`,
//             Accept: "application/vnd.github+json",
//           },
//         }
//       );
//     } catch (error) {
//       console.error(
//         `Failed to delete webhook for ${repo.repoFullName}`,
//         error
//       );
//     }
//   }

//   await prisma.projectGithub.deleteMany();

//   await prisma.githubAccount.delete({
//     where: { userId },
//   });

//   return {
//     success: true,
//     message: "GitHub account disconnected successfully",
//   };
// }