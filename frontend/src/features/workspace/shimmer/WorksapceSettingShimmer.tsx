import { Skeleton } from "@/components/ui/skeleton";

const WorkspaceSettingsShimmer = () => (
  <div className="px-4 py-6 md:px-8 md:py-8 max-w-225 mx-auto">
    {/* Header */}
    <div className="mb-8 space-y-2">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-4 w-72" />
    </div>

    <div className="space-y-6">
      {/* General Section */}
      <div className="rounded-2xl border border-border/40 bg-card/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-9 w-16 rounded-xl" />
        </div>
        <div className="px-6 py-5">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-500/20 bg-card/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-500/20 space-y-1.5">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-52" />
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default WorkspaceSettingsShimmer;
