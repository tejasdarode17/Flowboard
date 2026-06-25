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
      <DialogContent className="sm:max-w-md rounded-2xl p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 border border-border/40 shrink-0">
              <Building2 size={17} className="text-foreground/70" strokeWidth={1.5} />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold font-heading tracking-tight">Workspace Settings</DialogTitle>
              <DialogDescription className="text-[13px] text-muted-foreground mt-0.5">
                Update your workspace name, description, or logo.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="px-6 pb-6">
          <WorkspaceForm
            onSubmit={handleSubmit}
            loading={isPending}
            defaultValues={defaultValues}
            onClose={() => setOpen(false)}
            submitLabel="Save changes"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateWorkspace;
