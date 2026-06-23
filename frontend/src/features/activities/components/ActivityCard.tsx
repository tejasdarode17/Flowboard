import type { Activity } from "../types/activity.types";
import { getActivityIcon } from "./ActivityIcons";
import formatDate from "@/shared/utils/formatDate";
import { formatActivity } from "../utils/formatActivity";

type ActivityCardProps = {
  activity: Activity;
};

const ActivityCard = ({ activity }: ActivityCardProps) => {
  const Icon = getActivityIcon(activity.action);

  const user = activity?.actor?.user;

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const projectName = Boolean(activity?.project?.name);

  return (
    <div className="flex gap-4 px-5 py-5 transition-colors hover:bg-muted/30">
      {/* Timeline */}
      <div className="relative flex flex-col items-center shrink-0">
        <div className="z-10 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border bg-background">
          {user?.avatar ? (
            <img src={user?.avatar} alt={user?.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs font-semibold">{initials}</span>
          )}
        </div>

        <div className="mt-2 w-px flex-1 bg-border" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg border bg-muted p-2 shrink-0">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            {/* Main sentence */}
            <p className="text-sm leading-relaxed wrap-break-words">
              <span className="font-semibold">{user?.name}</span> {formatActivity(activity)}
            </p>

            {projectName && (
              <div className="mt-3">
                <span className="inline-flex items-center rounded-md border bg-muted px-2 py-1 text-xs font-medium">
                  📁 {activity.project?.name}
                </span>
              </div>
            )}

            {/* Status / Priority */}
            {activity.metadata?.from &&
              activity.metadata?.to &&
              (activity.action === "ISSUE_STATUS_CHANGED" || activity.action === "ISSUE_PRIORITY_CHANGED") && (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-md border bg-muted px-2 py-1 font-medium">{activity.metadata.from}</span>

                  <span className="text-muted-foreground">→</span>

                  <span className="rounded-md border bg-muted px-2 py-1 font-medium">{activity.metadata.to}</span>
                </div>
              )}

            {/* Assignment */}
            {activity.metadata?.fromMemberName && activity.metadata?.toMemberName && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-md border bg-muted px-2 py-1">{activity.metadata.fromMemberName}</span>

                <span className="text-muted-foreground">→</span>

                <span className="rounded-md border bg-muted px-2 py-1">{activity.metadata.toMemberName}</span>
              </div>
            )}

            {/* Role */}
            {activity.metadata?.oldRole && activity.metadata?.newRole && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-md border bg-muted px-2 py-1">{activity.metadata.oldRole}</span>

                <span className="text-muted-foreground">→</span>

                <span className="rounded-md border bg-muted px-2 py-1">{activity.metadata.newRole}</span>
              </div>
            )}

            {/* Issue rename */}
            {activity.metadata?.oldTitle && activity.metadata?.newTitle && activity.metadata.oldTitle !== activity.metadata.newTitle && (
              <div className="mt-3 rounded-lg border bg-muted/40 p-3 text-xs space-y-2">
                <div>
                  <span className="text-muted-foreground">Old title</span>

                  <p className="font-medium wrap-break-words">{activity.metadata.oldTitle}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">New title</span>

                  <p className="font-medium wrap-break-words">{activity.metadata.newTitle}</p>
                </div>
              </div>
            )}

            {/* PUSH */}
            {activity.action === "PUSH" && (
              <>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {activity.metadata?.repository && (
                    <span className="rounded-md border bg-muted px-2 py-1">{activity.metadata.repository}</span>
                  )}

                  {activity.metadata?.branch && <span className="rounded-md border bg-muted px-2 py-1">🌿 {activity.metadata.branch}</span>}

                  {activity.metadata?.commitSha && (
                    <span className="rounded-md border bg-muted px-2 py-1 font-mono">{activity.metadata.commitSha}</span>
                  )}
                </div>

                {activity.metadata?.commitMessage && (
                  <div className="mt-3 rounded-lg border bg-muted/40 px-3 py-2">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Commit Message</p>

                    <p className="mt-1 text-sm italic wrap-break-words">"{activity.metadata.commitMessage}"</p>
                  </div>
                )}

                {activity.metadata?.commitUrl && (
                  <a
                    href={String(activity.metadata.commitUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex text-xs text-primary hover:underline"
                  >
                    View Commit →
                  </a>
                )}
              </>
            )}

            {/* Pull Requests */}
            {["PR_OPENED", "PR_MERGED", "PR_CLOSED", "PR_REOPENED"].includes(activity.action) && (
              <>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {activity.metadata?.number && (
                    <span className="rounded-md border bg-muted px-2 py-1">PR #{activity.metadata.number}</span>
                  )}

                  {activity.metadata?.sourceBranch && (
                    <span className="rounded-md border bg-muted px-2 py-1">🌿 {activity.metadata.sourceBranch}</span>
                  )}

                  {activity.metadata?.targetBranch && (
                    <span className="rounded-md border bg-muted px-2 py-1">→ {activity.metadata.targetBranch}</span>
                  )}
                </div>

                {activity.metadata?.url && (
                  <a
                    href={String(activity.metadata.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex text-xs text-primary hover:underline"
                  >
                    View Pull Request →
                  </a>
                )}
              </>
            )}

            {/* Time */}
            <p className="mt-4 text-xs text-muted-foreground">{formatDate(activity.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
