import { useParams } from "react-router-dom";
import type { Issue } from "../types/issue.types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CircleDot } from "lucide-react";
import { useIssuesUpdate } from "../hooks/useUpdateIssue";
import type { CreateIssueInput } from "../validations/issue.validations";
import IssueForm from "../../projects/components/IssueForm";

type Props = {
  issue: Issue | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const UpdateIssue = ({ issue, open, setOpen }: Props) => {
  const { workspaceSlug, projectId } = useParams();
  const issueId = issue?.id;

  const { mutateAsync, isPending } = useIssuesUpdate(workspaceSlug!, projectId!, () => setOpen(false));

  if (!issue) return null;

  const handleSubmit = (data: CreateIssueInput) => {
    return mutateAsync({
      workspaceSlug: workspaceSlug!,
      projectId: projectId!,
      issueId: issueId!,
      data,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
              <CircleDot size={17} className="text-amber-500" strokeWidth={1.5} />
            </div>

            <div>
              <DialogTitle className="text-lg font-semibold">Edit Issue</DialogTitle>
              <DialogDescription className="text-[13px] mt-0.5 truncate max-w-62.5">{issue.title}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          <IssueForm
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            loading={isPending}
            onClose={() => setOpen(false)}
            defaultValues={{
              title: issue.title,
              description: issue.description || "",
              priority: issue.priority,
              assignedTo: issue.assignedTo,
              status: issue.status,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateIssue;
