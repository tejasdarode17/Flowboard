import { Link } from "react-router-dom";
import { CircleDot, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";
import { useUserIssues } from "@/features/projects/hooks/useUserIssues";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Issue } from "@/features/projects/types/issue.types";

const priorityStyles = {
  HIGH: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
  MEDIUM: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  LOW: "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-400",
};

const statusStyles = {
  TODO: { icon: CircleDot, color: "text-muted-foreground", label: "Todo" },
  IN_PROGRESS: { icon: AlertCircle, color: "text-blue-500", label: "In Progress" },
  DONE: { icon: CheckCircle2, color: "text-emerald-500", label: "Done" },
};

const MyIssuesDashboard = ({ workspaceSlug }: { workspaceSlug: string }) => {
  const { data: myIssues, isLoading } = useUserIssues(workspaceSlug);

  if (isLoading) {
    return <IssuesSkeleton />;
  }

  return (
    <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/30">
        <h2 className="font-semibold text-[15px]">Your Issues</h2>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          {myIssues?.length ? "Issues assigned to you" : "No issues assigned to you"}
        </p>
      </div>

      {/* Content */}
      {!myIssues?.length ? (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 mb-4">
            <CheckCircle2 size={24} className="text-emerald-500/70" strokeWidth={1.5} />
          </div>
          <h3 className="font-semibold text-[15px] mb-1">All clear</h3>
          <p className="text-[13px] text-muted-foreground text-center max-w-sm">No open issues assigned to you right now.</p>
        </div>
      ) : (
        <div className="divide-y divide-border/20">
          {myIssues.map((issue: Issue) => {
            const priority = priorityStyles[issue.priority as keyof typeof priorityStyles] || priorityStyles.MEDIUM;
            const status = statusStyles[issue.status as keyof typeof statusStyles] || statusStyles.TODO;
            const StatusIcon = status.icon;

            return (
              <Link
                key={issue.id}
                to={`/${workspaceSlug}/projects/${issue.project.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-accent/20 transition-all duration-150 group"
              >
                {/* Status icon */}
                <StatusIcon size={17} className={`${status.color} shrink-0 mt-0.5`} strokeWidth={1.5} />

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-medium truncate">{issue.title}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-medium shrink-0 ${priority}`}>{issue.priority}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[12px] text-muted-foreground flex items-center gap-1">
                      <span>{issue.project.emoji}</span>
                      <span className="truncate max-w-37.5">{issue.project.name}</span>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                    <span className={`text-[11px] font-medium ${status.color}`}>{status.label}</span>

                    {issue.assignee && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                        <Avatar className="h-4 w-4 rounded">
                          <AvatarImage src={issue.assignee.user?.avatar ?? ""} />
                          <AvatarFallback className="text-[8px] bg-accent rounded">{issue.assignee.user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <ArrowUpRight
                  size={15}
                  className="text-muted-foreground/30 group-hover:text-muted-foreground transition-all duration-200 shrink-0"
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Loading skeleton
const IssuesSkeleton = () => (
  //   <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
  //     <div className="px-6 py-4 border-b border-border/30">
  //       <Skeleton className="h-5 w-24" />
  //       <Skeleton className="h-4 w-36 mt-1" />
  //     </div>
  //     <div className="divide-y divide-border/20">
  //       {Array.from({ length: 4 }).map((_, i) => (
  //         <div key={i} className="flex items-center gap-4 px-6 py-4">
  //           <Skeleton className="h-4 w-4 shrink-0 mt-0.5" />
  //           <div className="space-y-1.5 flex-1">
  //             <div className="flex items-center gap-2">
  //               <Skeleton className="h-4 w-40" />
  //               <Skeleton className="h-5 w-14 rounded-md" />
  //             </div>
  //             <div className="flex items-center gap-2">
  //               <Skeleton className="h-3 w-32" />
  //               <Skeleton className="h-3 w-16" />
  //             </div>
  //           </div>
  //           <Skeleton className="h-4 w-4 shrink-0" />
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  <h1>loading</h1>
);

export default MyIssuesDashboard;
