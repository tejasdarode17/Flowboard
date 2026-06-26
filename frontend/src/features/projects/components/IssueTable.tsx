import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleDot, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";
import type { Issue } from "../types/issue.types";
import IssuePriorityBadge from "./IssuePriorityBadge";
import IssueStatusBadge from "./IssueStatusBadge";
import { useState } from "react";
import IssueDetails from "./IssueDetails";

const STATUS_ICONS = {
  TODO: CircleDot,
  IN_PROGRESS: Clock,
  DONE: CheckCircle2,
};

const STATUS_COLORS = {
  TODO: "text-slate-500",
  IN_PROGRESS: "text-blue-500",
  DONE: "text-emerald-500",
};

interface IssueTableViewProps {
  issues: Issue[];
  workspaceSlug: string;
  projectId: string;
}

const IssueTableView = ({ issues, workspaceSlug, projectId }: IssueTableViewProps) => {
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  if (!issues.length) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-muted/50 border border-border/30 mb-5">
            <CircleDot size={28} className="text-muted-foreground/60" strokeWidth={1.5} />
          </div>
          <h2 className="text-[17px] font-semibold font-heading mb-1.5">No issues yet</h2>
          <p className="text-[13px] text-muted-foreground text-center max-w-sm">
            Create your first issue to start tracking work for this project.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-border/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30 bg-muted/30">
              <th className="px-5 py-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider w-[40%]">Issue</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Priority</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Assignee</th>
              <th className="px-5 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {issues.map((issue) => {
              const StatusIcon = STATUS_ICONS[issue.status as keyof typeof STATUS_ICONS] || CircleDot;
              const statusColor = STATUS_COLORS[issue.status as keyof typeof STATUS_COLORS] || "text-muted-foreground";

              return (
                <tr
                  key={issue.id}
                  onClick={() => setSelectedIssueId(issue.id)}
                  className="hover:bg-accent/20 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-start gap-3">
                      <StatusIcon size={16} className={`${statusColor} mt-0.5 shrink-0`} strokeWidth={1.5} />
                      <div className="min-w-0">
                        <p className="font-medium text-[13px] truncate">{issue.title}</p>
                        {/* {issue.description && <p className="text-[11px] text-muted-foreground truncate mt-0.5">{issue.description}</p>} */}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <IssuePriorityBadge priority={issue.priority} />
                  </td>
                  <td className="px-5 py-3.5">
                    <IssueStatusBadge issueId={issue.id} status={issue.status} workspaceSlug={workspaceSlug} projectId={projectId} />
                  </td>
                  <td className="px-5 py-3.5">
                    {issue.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 rounded-md border border-border/40">
                          <AvatarImage src={issue.assignee.user?.avatar} className="rounded-md" />
                          <AvatarFallback className="text-[10px] bg-accent rounded-md">
                            {issue.assignee.user?.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[12px] text-muted-foreground truncate max-w-30">{issue.assignee.user?.name}</span>
                      </div>
                    ) : (
                      <span className="text-[12px] text-muted-foreground/50">Unassigned</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <ArrowUpRight
                      size={14}
                      className="text-muted-foreground/30 group-hover:text-muted-foreground transition-all duration-150"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <IssueDetails issueId={selectedIssueId!} open={!!selectedIssueId} onClose={() => setSelectedIssueId(null)} />
    </>
  );
};

export default IssueTableView;
