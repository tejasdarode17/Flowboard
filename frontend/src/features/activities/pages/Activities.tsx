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
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, isRefetching } = useActivities(workspaceSlug!, range);

  const activities = useMemo(() => {
    return data?.pages.flatMap((page) => page.activities as Activity[]) ?? [];
  }, [data]);

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-225 mx-auto">
      {/* Header - Always visible, no shimmer */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Activity Feed</h1>
        <p className="text-[13px] text-muted-foreground mt-1.5">
          Stay updated with project changes, issue updates, member activity, and GitHub events across your workspace.
        </p>
      </div>

      {/* Filters - Always visible, no shimmer */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { label: "All", value: undefined },
          { label: "Today", value: "today" },
          { label: "This Week", value: "week" },
          { label: "Last 30 Days", value: "month" },
        ].map((filter) => (
          <button
            key={filter.label}
            onClick={() => setRange(filter.value as "today" | "week" | "month" | undefined)}
            disabled={isRefetching}
            className={`
              rounded-xl border px-4 py-2 text-[13px] font-medium
              transition-all duration-150
              ${range === filter.value ? "bg-primary/10 border-primary/20 text-primary" : "border-border/40 hover:bg-accent/20"}
              ${isRefetching ? "opacity-60 cursor-not-allowed" : ""}
            `}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Content Area - Shows shimmer only when loading/refetching */}
      {isLoading || isRefetching ? (
        <ActivitySkeleton />
      ) : activities.length > 0 ? (
        <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="divide-y divide-border/20">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm px-8 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-border/40 bg-muted/50">
            <Clock3 size={20} className="text-muted-foreground" strokeWidth={1.5} />
          </div>
          <h2 className="text-[15px] font-semibold">No activity yet</h2>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            Activities will appear here as your team collaborates, updates issues, and connects GitHub events.
          </p>
        </div>
      )}

      {/* Load More */}
      {activities.length > 0 && hasNextPage && !isRefetching && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="
              inline-flex items-center gap-2 rounded-xl border border-border/40
              px-5 py-2.5 text-[13px] font-medium
              transition-all duration-150 hover:bg-accent/20
              disabled:cursor-not-allowed disabled:opacity-60
            "
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}

      {/* End */}
      {activities.length > 0 && !hasNextPage && !isRefetching && (
        <div className="mt-6 text-center">
          <p className="text-[13px] text-muted-foreground">You've reached the end of the activity feed.</p>
        </div>
      )}
    </div>
  );
};

export default Activities;
