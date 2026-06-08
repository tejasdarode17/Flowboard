import crypto from "crypto";

import { PushEvent, PullRequestEvent, IssuesEvent, IssueCommentEvent, } from "@octokit/webhooks-types";
import { GithubEvent, GithubWebhookPayload } from "../types/githubWebhook.types";


export function verifyGitHubWebhookSignature(
    payload: Buffer,
    signature: string
) {
    const secret = process.env.GITHUB_WEBHOOK_SECRET!;

    const expectedSignature =
        "sha256=" +
        crypto
            .createHmac("sha256", secret)
            .update(payload)
            .digest("hex");

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(
        sigBuffer,
        expectedBuffer
    );
}


export function extractGithubUsername(payload: GithubWebhookPayload, event: GithubEvent): string | null {

    if (event === "push") {
        return (payload as PushEvent).pusher?.name ?? null
    }

    if (event === "pull_request") {
        return (payload as PullRequestEvent).pull_request?.user?.login ?? null
    }

    if (event === "issues") {
        return (payload as IssuesEvent).issue?.user?.login ?? null
    }

    if (event === "issue_comment") {
        return (payload as IssueCommentEvent).comment?.user?.login ?? null
    }

    return null;
}