import { Skeleton } from "@/components/ui/skeleton";

// Skeleton Component
const NotificationsSkeleton = () => (
  <div className="px-4 py-6 md:px-8 md:py-8 max-w-225 mx-auto">
    {/* Header */}
    <div className="mb-8 space-y-2">
      <Skeleton className="h-7 w-36" />
      <Skeleton className="h-4 w-64" />
    </div>

    {/* Notification items */}
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className={`rounded-2xl border p-5 ${index === 0 ? "border-border/60 bg-accent/10" : "border-border/40 bg-card/50"}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            {index === 0 && <Skeleton className="h-2 w-2 rounded-full shrink-0" />}
          </div>
          <div className="mt-3">
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>
          <Skeleton className="h-3 w-32 mt-3" />
        </div>
      ))}
    </div>
  </div>
);

export default NotificationsSkeleton;
