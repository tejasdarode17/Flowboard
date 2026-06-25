import { useParams } from "react-router-dom";
import type { Issue } from "../types/issue.types";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useIssuesUpdate } from "../hooks/useUpdateIssue";
import type { CreateIssueInput } from "../validations/issue.validations";
import IssueForm from "../../projects/components/IssueForm";
import { CircleDot,  } from "lucide-react";

type Props = {
  issue: Issue | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const UpdateIssue = ({ issue, open, setOpen }: Props) => {
  const issueId = issue?.id;
  const { workspaceSlug, projectId } = useParams();
  const { mutateAsync, isPending } = useIssuesUpdate(workspaceSlug!, projectId!, () => setOpen(false));

  function handleSubmit(data: CreateIssueInput) {
    return mutateAsync({ workspaceSlug: workspaceSlug!, issueId: issueId!, projectId: projectId!, data });
  }

  if (!issue) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
                <CircleDot size={15} className="text-amber-500" strokeWidth={1.5} />
              </div>
              <div>
                <SheetTitle className="text-[15px] font-semibold font-heading tracking-tight">Edit Issue</SheetTitle>
                <p className="text-[12px] text-muted-foreground mt-0.5 truncate max-w-62.5">{issue.title}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-5">
          <IssueForm
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            defaultValues={{
              title: issue.title,
              description: issue.description || "",
              priority: issue.priority,
              assignedTo: issue.assignedTo,
              status: issue.status,
            }}
            loading={isPending}
            onClose={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateIssue;
