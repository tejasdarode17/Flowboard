import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import type { Notification } from "../types/notification.types";

const Notifications = () => {
  const { workspaceSlug } = useParams();

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useNotifications(workspaceSlug!);

  const notifications = useMemo(() => {
    return data?.pages.flatMap((page) => page.notifications) ?? [];
  }, [data]);

  if (isLoading) {
    return <div className="p-6">Loading notifications...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">Failed to load notifications.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Notifications</h1>

        <p className="text-sm text-muted-foreground">Stay up to date with activity in this workspace.</p>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">No notifications yet.</div>
      ) : (
        <>
          <div className="space-y-3">
            {notifications.map((notification: Notification) => (
              <div key={notification.id} className={`rounded-lg border p-4 transition-colors ${!notification.read ? "bg-muted/50" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-medium">{notification.title}</h2>

                    <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                  </div>

                  {!notification.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
                </div>

                {notification.project && (
                  <div className="mt-2">
                    <span className="rounded-md border bg-muted px-2 py-1 text-xs">{notification.project.name}</span>
                  </div>
                )}

                <p className="mt-3 text-xs text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition hover:bg-muted disabled:opacity-60"
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
        </>
      )}
    </div>
  );
};

export default Notifications;
