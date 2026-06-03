import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { EllipsisVertical, GripVertical } from "lucide-react";
import type { Issue } from "../types/issue.types";
import { useState } from "react";
import UpdateIssue from "./UpdateIssue";

const priorityConfig = {
  High: { color: "text-red-500", bg: "bg-red-500/10" },
  Medium: { color: "text-amber-500", bg: "bg-amber-500/10" },
  Low: { color: "text-green-500", bg: "bg-green-500/10" },
};

type Props = {
  issue: Issue;
  isDragging?: boolean;
};

const IssueCard = ({ issue, isDragging = false }: Props) => {
  const [open, setOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: issue.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const priority = priorityConfig[issue.priority as keyof typeof priorityConfig];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border bg-card p-4 transition-all duration-150 ${
        isDragging ? "opacity-50 shadow-lg rotate-1" : "hover:shadow-sm hover:border-border/60"
      }`}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <button
          {...listeners}
          {...attributes}
          className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors shrink-0"
        >
          <GripVertical size={14} />
        </button>

        <div className="flex-1 min-w-0">
          {/* Title + Priority */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[13px] font-medium leading-snug">{issue.title}</h3>
            <div className="flex gap-3 items-center">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${priority.bg} ${priority.color}`}>{issue.priority}</span>
              <EllipsisVertical size={15} className="cursor-pointer" onClick={() => setOpen(true)} />
            </div>
          </div>

          {/* Description */}
          {issue.description && <p className="mt-1.5 text-[12px] text-muted-foreground line-clamp-2">{issue.description}</p>}

          {/* Assignee */}
          {issue.assignee?.user?.name && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted border border-border/40 text-[10px] font-medium">
                {issue.assignee.user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-[11px] text-muted-foreground">{issue.assignee.user.name}</span>
            </div>
          )}
        </div>
      </div>
      <UpdateIssue open={open} onClose={() => setOpen(false)} issue={issue}></UpdateIssue>
    </div>
  );
};

export default IssueCard;
