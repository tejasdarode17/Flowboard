const ActivitySkeleton = () => {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="divide-y divide-border/20">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex gap-4 px-6 py-5 animate-pulse">
            {/* Avatar */}
            <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
            {/* Content */}
            <div className="flex-1 space-y-3">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
              <div className="flex gap-2">
                <div className="h-3 w-20 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitySkeleton;
