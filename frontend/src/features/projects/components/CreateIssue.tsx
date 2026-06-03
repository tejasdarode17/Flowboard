import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import IssueForm from "./issueForm";
import { useIssueCreate } from "../hooks/useIssueCreate";
import type { CreateIssueInput } from "../validations/issue.validations";

const CreateIssue = () => {
  const [open, setOpen] = useState(false);
  const { workspaceSlug, projectId } = useParams();
  const { mutateAsync, isPending } = useIssueCreate(workspaceSlug!, projectId!, () => setOpen(false));

  function handleSubmit(data: CreateIssueInput) {
    return mutateAsync({ workspaceSlug: workspaceSlug!, projectId: projectId!, data });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus size={15} />
          Create Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground">
              <Building2 size={16} className="text-background" />
            </div>
            <div>
              <DialogTitle className="font-syne text-lg tracking-tight">Create Issue</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">Add a new issue to this project.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <IssueForm onSubmit={handleSubmit} loading={isPending} submitLabel="Create Issue" />
      </DialogContent>
    </Dialog>
  );
};

export default CreateIssue;
