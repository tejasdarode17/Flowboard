import { Building2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import WorkspaceForm from "./WorkspaceForm";
import type { UpdateWorkspaceInput } from "../validations/workspace.validations";
import { useUpdateWorkspace } from "../hooks/useUpdateWorkspace";

type UpdateWorkspaceProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  defaultValues?: UpdateWorkspaceInput;
  workspaceSlug: string;
};

const UpdateWorkspace = ({ open, setOpen, defaultValues, workspaceSlug }: UpdateWorkspaceProps) => {
  const { mutateAsync, isPending } = useUpdateWorkspace(workspaceSlug, () => setOpen(false));
  async function handleSubmit(data: FormData) {
    return mutateAsync(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground">
              <Building2 size={16} className="text-background" />
            </div>
            <div>
              <DialogTitle className="font-syne text-lg tracking-tight">Update workspace</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">Update your workspace name, description, or logo.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <WorkspaceForm onSubmit={handleSubmit} loading={isPending} defaultValues={defaultValues} submitLabel="Save changes" />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateWorkspace;
