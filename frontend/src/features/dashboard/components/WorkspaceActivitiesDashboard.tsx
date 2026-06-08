import { Clock } from "lucide-react";
import { useWorkspaceActivities } from "../hooks/useWorkspaceActivities";
import formatRelativeTime from "@/shared/utils/formatDate";
import { activityFormat } from "../utils/activityFormat";
import type { Activity } from "../types/activity.types";

interface Props {
  workspaceSlug: string;
}

const WorkspaceActivityDashboard = ({ workspaceSlug }: Props) => {
  const { data: activities, isLoading } = useWorkspaceActivities(workspaceSlug);

  if (isLoading) {
    return (
      <div className="rounded-xl border p-6">
        <p className="text-sm text-muted-foreground">Loading activities...</p>
      </div>
    );
  }

  if (!activities?.length) {
    return (
      <div className="rounded-xl border p-8 text-center">
        <Clock className="mx-auto h-5 w-5 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-background">
      <div className="border-b px-6 py-4">
        <h2 className="font-semibold">Recent Activity</h2>
        <p className="text-sm text-muted-foreground">Latest workspace updates</p>
      </div>

      <div>
        {activities.map((activity: Activity) => (
          <div key={activity.id} className="border-b last:border-b-0 px-6 py-4">
            {/* Action */}
            <p className="text-sm leading-relaxed">
              <span className="font-medium">{activity.actor.user.name}</span> {activityFormat(activity)}
            </p>

            {/* Main Content */}
            {activity.action === "PUSH" ? (
              <>
                {activity.metadata?.commitMessage && <p className="mt-1 text-sm font-medium">{String(activity.metadata.commitMessage)}</p>}

                <p className="mt-1 text-xs text-muted-foreground">
                  {activity.entityName}
                  {activity.targetName && ` • ${activity.targetName}`}
                </p>
              </>
            ) : (
              <>
                {activity.entityName && <p className="mt-1 text-sm font-medium">{activity.entityName}</p>}

                {activity.targetName && <p className="mt-1 text-xs text-muted-foreground">Project • {activity.targetName}</p>}
              </>
            )}

            {/* Time */}
            <p className="mt-2 text-xs text-muted-foreground">{formatRelativeTime(activity.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkspaceActivityDashboard;
