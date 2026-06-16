import { PushEvent, PullRequestEvent, IssuesEvent, IssueCommentEvent, Release, ReleaseEvent } from "@octokit/webhooks-types";

export type GithubEvent =
    | "push"
    | "pull_request"


export type GithubWebhookPayload =
    | PushEvent
    | PullRequestEvent
