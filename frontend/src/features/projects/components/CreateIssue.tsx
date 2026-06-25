import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CircleDot, Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import { useIssueCreate } from "../hooks/useICreateIssue";
import type { CreateIssueInput } from "../validations/issue.validations";
import IssueForm from "../../projects/components/IssueForm";
import { Button } from "@/components/ui/button";

type CreateIssueProp = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateIssue = ({ open, setOpen }: CreateIssueProp) => {
  const { workspaceSlug, projectId } = useParams();
  const { mutateAsync, isPending } = useIssueCreate(workspaceSlug!, projectId!, () => setOpen(false));

  function handleSubmit(data: CreateIssueInput) {
    return mutateAsync({ workspaceSlug: workspaceSlug!, projectId: projectId!, data });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl h-9 gap-2 text-[13px]">
          <Plus size={14} />
          <span className="hidden sm:inline">New Issue</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
              <CircleDot size={17} className="text-amber-500" strokeWidth={1.5} />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold font-heading tracking-tight">Create Issue</DialogTitle>
              <DialogDescription className="text-[13px] text-muted-foreground mt-0.5">
                Add a new issue to track work in this project.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="px-6 pb-6">
          <IssueForm onSubmit={handleSubmit} loading={isPending} onClose={() => setOpen(false)} submitLabel="Create Issue" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIssue;
