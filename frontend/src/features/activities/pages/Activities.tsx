import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, Clock3 } from "lucide-react";

import ActivityCard from "../components/ActivityCard";
import ActivitySkeleton from "../components/ActivitySkeleton";
import { useActivities } from "../hooks/useActivities";
import type { Activity } from "../types/activity.types";

const Activities = () => {
  const { workspaceSlug } = useParams();

  const [range, setRange] = useState<"today" | "week" | "month" | undefined>(undefined);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useActivities(workspaceSlug!, range);

  const activities = useMemo(() => {
    return data?.pages.flatMap((page) => page.activities as Activity[]) ?? [];
  }, [data]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-8">
        <div className="mb-8">
          <div className="h-8 w-48 rounded bg-muted animate-pulse" />
          <div className="mt-2 h-4 w-80 rounded bg-muted animate-pulse" />
        </div>

        <ActivitySkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Activity Feed</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Stay updated with project changes, issue updates, member activity, and GitHub events across your workspace.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {[
          {
            label: "All",
            value: undefined,
          },
          {
            label: "Today",
            value: "today",
          },
          {
            label: "This Week",
            value: "week",
          },
          {
            label: "Last 30 Days",
            value: "month",
          },
        ].map((filter) => (
          <button
            key={filter.label}
            onClick={() => setRange(filter.value as "today" | "week" | "month" | undefined)}
            className={`
              rounded-full border px-4 py-2 text-sm font-medium
              transition-all
              ${range === filter.value ? "bg-primary text-primary-foreground border-primary shadow-sm" : "hover:bg-muted"}
            `}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      {activities.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border bg-background shadow-sm divide-y">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border bg-background px-8 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border bg-muted">
            <Clock3 className="h-7 w-7 text-muted-foreground" />
          </div>

          <h2 className="text-lg font-semibold">No activity yet</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Activities will appear here as your team collaborates, updates issues, and connects GitHub events.
          </p>
        </div>
      )}

      {/* Load More */}
      {activities.length > 0 && hasNextPage && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="
              inline-flex items-center gap-2 rounded-xl border
              px-5 py-2.5 text-sm font-medium
              transition-all hover:bg-muted hover:shadow-sm
              disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}

      {/* End */}
      {activities.length > 0 && !hasNextPage && (
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">You've reached the end of the activity feed.</p>
        </div>
      )}
    </div>
  );
};

export default Activities;
