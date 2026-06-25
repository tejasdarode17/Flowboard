import { Skeleton } from "@/components/ui/skeleton";

// Dashboard Shimmer
const DashboardShimmer = () => (
  <div className="px-4 py-6 md:px-8 md:py-8 max-w- mx-auto">
    {/* Header shimmer */}
    <div className="flex items-start gap-4 mb-8">
      <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>

    {/* Stats shimmer */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/40 bg-card/50 p-5">
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-8 w-12" />
        </div>
      ))}
    </div>

    {/* Content shimmer */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/40 bg-card/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-border/30">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48 mt-1" />
            </div>
            <div className="divide-y divide-border/20">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center gap-4 px-6 py-4">
                  <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-6">
        <div className="rounded-2xl border border-border/40 bg-card/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-border/30">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-36 mt-1" />
          </div>
          <div className="divide-y divide-border/20">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="flex items-center gap-4 px-6 py-4">
                <Skeleton className="h-4 w-4 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardShimmer;
