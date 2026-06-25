import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIssuesStatusUpdate } from "../hooks/useIssueStatusUpdate";
import type { IssueStatus } from "../types/issue.types";
import { apiErrors } from "@/shared/utils/errorHandler";
import { toast } from "sonner";

const STATUS_CONFIG = {
  TODO: { label: "Todo", className: "text-slate-500" },
  IN_PROGRESS: { label: "In Progress", className: "text-blue-500" },
  DONE: { label: "Done", className: "text-emerald-500" },
};

interface IssueStatusBadgeProps {
  issueId: string;
  status: IssueStatus;
  workspaceSlug: string;
  projectId: string;
}

const IssueStatusBadge = ({ issueId, status, workspaceSlug, projectId }: IssueStatusBadgeProps) => {
  const { mutateAsync: updateStatus } = useIssuesStatusUpdate(workspaceSlug, projectId);

  const handleStatusChange = async (val: IssueStatus) => {
    try {
      await updateStatus({ workspaceSlug, projectId, issueId, status: val });
    } catch (error) {
      const err = apiErrors(error);
      toast.error(err.error || "Failed to change status");
    }
  };

  return (
    <Select value={status} onValueChange={(val: IssueStatus) => handleStatusChange(val)}>
      <SelectTrigger className="h-7 px-2.5 rounded-lg text-[11px] font-medium border-border/40 bg-muted/30 hover:bg-accent/30 transition-all duration-150">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        {Object.entries(STATUS_CONFIG).map(([key, { label, className }]) => (
          <SelectItem key={key} value={key} className={`text-[12px] rounded-lg ${className}`}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default IssueStatusBadge;
