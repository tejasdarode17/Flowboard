import type { Activity } from "../types/activity.types";

export function activityFormat(activity: Activity) {
    switch (activity.action) {

        case "PROJECT_CREATED":
            return "created project";

        case "PROJECT_UPDATED":
            return "updated project";

        case "PROJECT_DELETED":
            return "deleted project";

        case "ISSUE_CREATED":
            return "created issue";

        case "ISSUE_UPDATED":
            return "updated issue";

        case "ISSUE_DELETED":
            return "deleted issue";

        case "ISSUE_STATUS_CHANGED":
            return `moved issue from ${activity.metadata?.from} to ${activity.metadata?.to}`;

        case "ISSUE_PRIORITY_CHANGED":
            return `changed priority from ${activity.metadata?.from} to ${activity.metadata?.to}`;

        case "ISSUE_ASSIGNED":
            return "assigned issue";

        case "MEMBER_ADDED":
            return "added member";

        case "MEMBER_REMOVED":
            return "removed member";

        case "MEMBER_ROLE_CHANGED":
            return `changed role from ${activity.metadata?.oldRole} to ${activity.metadata?.newRole}`;

        case "PUSH":
            return activity?.metadata?.commitCount  > 1 ? `pushed ${activity?.metadata?.commitCount} commits` : "pushed code";

        case "PR_OPENED":
            return "opened pull request";

        case "PR_MERGED":
            return "merged pull request";

        case "PR_CLOSED":
            return "closed pull request";

        case "PR_REOPENED":
            return "reopened pull request";

        case "ISSUE_COMPLETED":
            return "closed issue";

        case "ISSUE_REOPENED":
            return "reopened issue";

        case "COMMENT_ADDED":
            return "commented on issue";

        default:
            return "performed an action";
    }
}