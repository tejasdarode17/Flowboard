import { Loader2 } from "lucide-react";
import { useDeleteWorkspace } from "../hooks/useDeleteWorksapce";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {workspaceName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the workspace and all its projects, issues, and members. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-red-700 text-white hover:bg-red-800">
            {isPending ? <Loader2 size={14} className="animate-spin" /> : "Delete workspace"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWorkspace;
