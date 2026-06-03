import { useDroppable } from "@dnd-kit/core";
import IssueCard from "./IssueCard";
import type { Issue } from "../types/issue.types";

type Props = {
  id: string;
  label: string;
  color: string;
  issues: Issue[];
};

const KanbanColumn = ({ id, label, color, issues }: Props) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border p-4 transition-colors duration-200 ${isOver ? "border-primary/50 bg-accent/30" : "border-border/40"}`}
    >
      {/* Column Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${color}`} />
          <h2 className="font-semibold text-[14px]">{label}</h2>
        </div>
        <span className="rounded-md bg-muted px-2 py-1 text-xs">{issues.length}</span>
      </div>

      {/* Issues */}
      <div className="space-y-3 min-h-20">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}

        {issues.length === 0 && (
          <div className="flex items-center justify-center h-20 rounded-xl border border-dashed border-border/40">
            <p className="text-xs text-muted-foreground">Drop here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
