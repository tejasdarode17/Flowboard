import { Skeleton } from "@/components/ui/skeleton";

const ProjectsShimmer = () => (
  <div className="px-4 py-6 md:px-8 md:py-8 max-w-400 mx-auto">
    {/* Header shimmer */}
    <div className="mb-8 space-y-2">
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-4 w-56" />
    </div>

    {/* Grid shimmer */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-5">
          {/* Top section */}
          <div className="flex items-start gap-3.5">
            <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-auto pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-14" />
            </div>
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ProjectsShimmer;
