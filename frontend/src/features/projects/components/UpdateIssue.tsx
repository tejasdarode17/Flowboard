import { useParams } from "react-router-dom";
import type { Issue } from "../types/issue.types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIssuesUpdate } from "../hooks/useIssueUpdate";
import IssueForm from "./issueForm";
import type { CreateIssueInput } from "../validations/issue.validations";

type Props = {
  issue: Issue | null;
  open: boolean;
  onClose: () => void;
};

const UpdateIssue = ({ issue, open, onClose }: Props) => {
  const issueId = issue?.id;
  const { workspaceSlug, projectId } = useParams();
  const { mutateAsync, isPending } = useIssuesUpdate(workspaceSlug!, projectId!, onClose);

  function handleSubmit(data: CreateIssueInput) {
    return mutateAsync({ workspaceSlug: workspaceSlug!, issueId: issueId!, projectId: projectId!, data });
  }

  if (!issue) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-syne text-lg">Issue Details</SheetTitle>
        </SheetHeader>
        <IssueForm
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          defaultValues={{
            title: issue.title,
            description: issue.description || "",
            priority: issue.priority,
            assignedTo: issue.assignedTo,
          }}
          loading={isPending}
        />
      </SheetContent>
    </Sheet>
  );
};

export default UpdateIssue;
