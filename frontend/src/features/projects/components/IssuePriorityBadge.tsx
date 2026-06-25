import { ArrowUp, ArrowRight, ArrowDown } from "lucide-react";
import type { IssuePriority } from "../types/issue.types";

const PRIORITY_CONFIG = {
  High: {
    label: "High",
    icon: ArrowUp,
    className: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
  },
  Medium: {
    label: "Medium",
    icon: ArrowRight,
    className: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  Low: {
    label: "Low",
    icon: ArrowDown,
    className: "border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400",
  },
};

const IssuePriorityBadge = ({ priority }: { priority: IssuePriority }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Medium;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-medium ${config.className}`}>
      <Icon size={10} strokeWidth={2} />
      {config.label}
    </span>
  );
};

export default IssuePriorityBadge;
