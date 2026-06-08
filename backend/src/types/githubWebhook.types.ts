import { PushEvent, PullRequestEvent, IssuesEvent, IssueCommentEvent, } from "@octokit/webhooks-types";


export type GithubWebhookPayload =
    | PushEvent
    | PullRequestEvent
    | IssuesEvent
    | IssueCommentEvent;

export type GithubEvent =
    | "push"
    | "pull_request"
    | "issues"
    | "issue_comment";