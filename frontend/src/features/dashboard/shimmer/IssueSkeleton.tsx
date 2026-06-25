import { Skeleton } from "@/components/ui/skeleton";

const IssuesSkeleton = () => (
  <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-border/30">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-4 w-36 mt-1" />
    </div>
    <div className="divide-y divide-border/20">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4">
          <Skeleton className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-5 w-14 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-4 w-4 shrink-0" />
        </div>
      ))}
    </div>
  </div>
);

export default IssuesSkeleton;
