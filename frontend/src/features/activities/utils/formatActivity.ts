import type { Activity } from "../types/activity.types";

export function formatActivity(activity: Activity) {
    const entity = activity.entityName;

    switch (activity.action) {

        // Workspace
        case "WORKSPACE_CREATED":
            return "created the workspace";

        case "WORKSPACE_UPDATED":
            return "updated the workspace";


        // Projects
        case "PROJECT_CREATED":
            return entity
                ? `created project "${entity}"`
                : "created a project";

        case "PROJECT_UPDATED":
            return entity
                ? `updated project "${entity}"`
                : "updated a project";

        case "PROJECT_DELETED":
            return entity
                ? `deleted project "${entity}"`
                : "deleted a project";


        // Issues
        case "ISSUE_CREATED":
            return entity
                ? `created issue "${entity}"`
                : "created an issue";

        case "ISSUE_UPDATED": {
            const oldTitle = activity.metadata?.oldTitle;
            const newTitle = activity.metadata?.newTitle;

            if (
                oldTitle &&
                newTitle &&
                oldTitle !== newTitle
            ) {
                return `renamed issue from "${oldTitle}" to "${newTitle}"`;
            }

            return entity
                ? `updated issue "${entity}"`
                : "updated an issue";
        }

        case "ISSUE_DELETED":
            return entity
                ? `deleted issue "${entity}"`
                : "deleted an issue";

        case "ISSUE_STATUS_CHANGED":
            return entity
                ? `moved "${entity}" from ${activity.metadata?.from} → ${activity.metadata?.to}`
                : `changed issue status from ${activity.metadata?.from} → ${activity.metadata?.to}`;

        case "ISSUE_PRIORITY_CHANGED":
            return entity
                ? `changed "${entity}" priority from ${activity.metadata?.from} → ${activity.metadata?.to}`
                : `changed issue priority from ${activity.metadata?.from} → ${activity.metadata?.to}`;

        case "ISSUE_ASSIGNED": {
            const from = activity.metadata?.fromMemberName;
            const to = activity.metadata?.toMemberName;

            if (from && to) {
                return entity
                    ? `reassigned "${entity}" from ${from} → ${to}`
                    : `reassigned an issue from ${from} → ${to}`;
            }

            if (to) {
                return entity
                    ? `assigned "${entity}" to ${to}`
                    : `assigned an issue to ${to}`;
            }

            return entity
                ? `assigned "${entity}"`
                : "assigned an issue";
        }

        case "ISSUE_COMPLETED":
            return entity
                ? `completed "${entity}"`
                : "completed an issue";

        case "ISSUE_REOPENED":
            return entity
                ? `reopened "${entity}"`
                : "reopened an issue";


        // Members
        case "MEMBER_JOINED":
            return "joined the workspace";

        case "MEMBER_REMOVED":
            return activity.metadata?.removedMemberName
                ? `removed ${activity.metadata.removedMemberName} from the workspace`
                : "removed a member";

        case "MEMBER_ROLE_CHANGED":
            return entity
                ? `changed ${entity}'s role from ${activity.metadata?.oldRole} → ${activity.metadata?.newRole}`
                : "changed a member's role";


        // GitHub
        case "PUSH": {
            const count = activity.metadata?.commitCount;
            const repo = activity.metadata?.repository;

            if (count && repo) {
                return `pushed ${count} commit${count > 1 ? "s" : ""} to ${repo}`;
            }

            if (count) {
                return `pushed ${count} commit${count > 1 ? "s" : ""}`;
            }

            return "pushed code";
        }

        case "PR_OPENED":
            return entity
                ? `opened pull request: ${entity}`
                : "opened a pull request";

        case "PR_MERGED":
            return entity
                ? `merged pull request: ${entity}`
                : "merged a pull request";

        case "PR_CLOSED":
            return entity
                ? `closed pull request: ${entity}`
                : "closed a pull request";

        case "PR_REOPENED":
            return entity
                ? `reopened pull request: ${entity}`
                : "reopened a pull request";


        case "COMMENT_ADDED":
            return entity
                ? `commented on "${entity}"`
                : "added a comment";

        default:
            return "performed an action";
    }
}