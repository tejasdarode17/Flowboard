export function extractGitHubUsername(payload: any, event: string) {
    if (event === "push") return payload.pusher?.name;
    if (event === "pull_request") return payload.pull_request?.user?.login;
    return null;
}