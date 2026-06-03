import { Building2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import WorkspaceForm from "./WorkspaceForm";
import { useWrokspaceCreate } from "../hooks/useWorkspaceCreate";

type CreateWorkspaceProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateWorkspace = ({ open, setOpen }: CreateWorkspaceProps) => {
  const { mutateAsync, isPending } = useWrokspaceCreate(() => setOpen(false));

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
              <DialogTitle className="font-syne text-lg tracking-tight">Create workspace</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">A workspace is where your team manages projects and issues.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <WorkspaceForm onSubmit={handleSubmit} loading={isPending} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspace;
