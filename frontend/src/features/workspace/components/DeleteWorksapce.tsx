import { Loader2, Trash2, AlertCircle } from "lucide-react";
import { useDeleteWorkspace } from "../hooks/useDeleteWorksapce";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type DeleteWorkspaceProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  workspaceSlug: string;
  workspaceName: string;
};

const DeleteWorkspace = ({ open, setOpen, workspaceSlug, workspaceName }: DeleteWorkspaceProps) => {
  const { mutateAsync, isPending } = useDeleteWorkspace(workspaceSlug);

  async function handleDelete() {
    await mutateAsync();
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="rounded-xl h-9 gap-2 text-[13px] shrink-0">
          <Trash2 size={14} strokeWidth={1.5} />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md rounded-2xl p-0 gap-0">
        <AlertDialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 shrink-0">
              <Trash2 size={17} className="text-red-500" strokeWidth={1.5} />
            </div>
            <AlertDialogTitle className="text-lg font-semibold font-heading tracking-tight text-left">
              Delete {workspaceName}?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-[13px] text-muted-foreground text-left">
            This will permanently delete this workspace and all its data. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Warning */}
        <div className="mx-6 mb-4 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/20">
          <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-[12px] text-red-600 dark:text-red-400">
            All projects, issues, members, and linked repositories will be permanently removed.
          </p>
        </div>

        <AlertDialogFooter className="px-6 pb-6 flex-row gap-2">
          <AlertDialogCancel
            disabled={isPending}
            className="flex-1 rounded-xl h-10 text-[13px] mt-0"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleDelete}
            disabled={isPending}
            variant="destructive"
            className="flex-1 rounded-xl h-10 text-[13px] gap-2"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={14} />
                Delete Workspace
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWorkspace;