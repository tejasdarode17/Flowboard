import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Loader2, Bell, BellOff } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import type { Notification } from "../types/notification.types";
import NotificationsSkeleton from "../shimmers/NotificationSkeleton";

const Notifications = () => {
  const { workspaceSlug } = useParams();
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useNotifications(workspaceSlug!);

  const notifications = useMemo(() => {
    return data?.pages.flatMap((page) => page.notifications) ?? [];
  }, [data]);

  if (isLoading) return <NotificationsSkeleton />;

  if (isError) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-8 max-w-225 mx-auto">
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto mb-4">
              <BellOff size={28} className="text-red-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-semibold font-heading mb-1">Failed to load notifications</h2>
            <p className="text-[13px] text-muted-foreground">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-225 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold font-heading tracking-tight">Notifications</h1>
        <p className="text-[13px] text-muted-foreground mt-1.5">
          {notifications.length > 0
            ? `Stay up to date with activity in this workspace`
            : "You'll see notifications about activity in your workspace here"}
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-border/40">
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-muted/50 border border-border/30 mb-5">
              <Bell size={28} className="text-muted-foreground/60" strokeWidth={1.5} />
            </div>
            <h2 className="text-[17px] font-semibold font-heading mb-1.5">No notifications</h2>
            <p className="text-[13px] text-muted-foreground text-center max-w-sm">
              You're all caught up! Notifications will appear here when there's activity.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {notifications.map((notification: Notification) => (
              <div
                key={notification.id}
                className={`rounded-2xl border p-5 transition-all duration-150 hover:shadow-sm ${
                  !notification.read ? "border-border/60 bg-accent/10" : "border-border/40 bg-card/50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-[14px] font-semibold">{notification.title}</h2>
                    <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">{notification.message}</p>
                  </div>

                  {!notification.read && <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                </div>

                {notification.project && (
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1 rounded-md border border-border/40 bg-muted/30 px-2 py-0.5 text-[11px] font-medium">
                      {notification.project.name}
                    </span>
                  </div>
                )}

                <p className="mt-3 text-[11px] text-muted-foreground/50">{new Date(notification.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="inline-flex items-center gap-2 rounded-xl border border-border/40 px-5 py-2.5 text-[13px] font-medium hover:bg-accent/30 transition-all duration-150 disabled:opacity-50"
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

          {!hasNextPage && notifications.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-[13px] text-muted-foreground">You've reached the end of notifications.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Notifications;
