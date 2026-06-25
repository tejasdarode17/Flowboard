import { Skeleton } from "@/components/ui/skeleton";

const MembersShimmer = () => (
  <div className="px-4 py-6 md:px-8 md:py-8 max-w-300 mx-auto">
    {/* Header shimmer */}
    <div className="mb-8 space-y-2">
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-4 w-56" />
    </div>

    {/* Separator */}
    <Skeleton className="h-px w-full mb-6" />

    {/* Grid shimmer */}
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 rounded-2xl border border-border/40 bg-card/50 p-4">
          <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-16 rounded-md" />
            </div>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default MembersShimmer;
