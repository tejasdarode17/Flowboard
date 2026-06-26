import { useState } from "react";
import { useParams } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Trash2, Calendar, User, Flag } from "lucide-react";
import IssueStatusBadge from "./IssueStatusBadge";
import IssuePriorityBadge from "./IssuePriorityBadge";
import UpdateIssue from "./UpdateIssue";
import DeleteIssue from "./DeleteIssue";
import { useIssues } from "../hooks/useIssues";

type Props = {
  issueId: string;
  open: boolean;
  onClose: () => void;
};

const IssueDetails = ({ issueId, open, onClose }: Props) => {
  const { workspaceSlug, projectId } = useParams();
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: issues } = useIssues(workspaceSlug!, projectId!);

  const issue = issues?.find((issue) => issue.id === issueId);

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(value) => {
          if (!value) onClose();
        }}
      >
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto  [&>button]:hidden">
          <SheetHeader className="mb-3">
            <div className="flex items-start justify-between gap-3">
              <SheetTitle className="font-syne text-lg leading-snug">{issue?.title}</SheetTitle>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={(e) => {
                    e.currentTarget.blur();
                    setUpdateOpen(true);
                  }}
                  className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-accent/50 transition-all duration-150"
                >
                  <Pencil size={14} className="text-muted-foreground" />
                </button>

                <button
                  onClick={() => setDeleteOpen(true)}
                  className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 transition-all duration-150"
                >
                  <Trash2 size={14} className="text-red-700 hover:text-red-800" />
                </button>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-6">
            {/* Description */}
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Description</p>
              {issue?.description ? (
                <p className="text-[13px] text-foreground leading-relaxed">{issue?.description}</p>
              ) : (
                <div className="flex items-center justify-center py-8 rounded-xl bg-muted/20 border border-border/20">
                  <p className="text-[13px] text-muted-foreground">No description provided</p>
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="rounded-xl border border-border/40 divide-y divide-border/30">
              {/* Status */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <span>Status</span>
                </div>
                <IssueStatusBadge
                  issueId={issue?.id || ""}
                  status={issue?.status || "TODO"}
                  workspaceSlug={workspaceSlug!}
                  projectId={projectId!}
                />
              </div>

              {/* Priority */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <Flag size={13} />
                  <span>Priority</span>
                </div>
                <IssuePriorityBadge priority={issue?.priority || "Medium"} />
              </div>

              {/* Assignee */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <User size={13} />
                  <span>Assignee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6 rounded-full border border-border/40">
                    <AvatarImage src={issue?.assignee?.user?.avatar} />
                    <AvatarFallback className="text-[10px]">{issue?.assignee?.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-[12px]">{issue?.assignee?.user?.name}</span>
                </div>
              </div>

              {/* Creator */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <User size={13} />
                  <span>Created by</span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6 rounded-full border border-border/40">
                    <AvatarImage src={issue?.creator?.user?.avatar} />
                    <AvatarFallback className="text-[10px]">{issue?.creator?.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-[12px]">{issue?.creator?.user?.name}</span>
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                  <Calendar size={13} />
                  <span>Created</span>
                </div>
                <span className="text-[12px] text-muted-foreground">
                  {new Date(issue?.createdAt || "").toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <UpdateIssue issue={issue!} open={updateOpen} setOpen={setUpdateOpen} />

      <DeleteIssue
        workspaceSlug={workspaceSlug!}
        issueId={issueId}
        projectId={projectId!}
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          onClose();
        }}
      />
    </>
  );
};

export default IssueDetails;
