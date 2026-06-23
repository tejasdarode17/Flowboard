import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRemoveMember } from "../hooks/useRemoveMembers";
import { toast } from "sonner";
import type { WorkspaceMember } from "../types/workspaces.types";
import { apiErrors } from "@/shared/utils/errorHandler";

interface RemoveMemberDialogProps {
  member: WorkspaceMember;
  workspaceSlug: string;
  children: React.ReactNode;
}

const RemoveMember = ({ member, workspaceSlug, children }: RemoveMemberDialogProps) => {
  const [open, setOpen] = useState(false);
  const { mutate: removeMember, isPending } = useRemoveMember();

  const handleRemoveMember = () => {
    removeMember(
      { workspaceSlug, memberId: member.id },
      {
        onSuccess: () => {
          toast.success(`${member.user.name} removed from workspace`);
          setOpen(false);
        },
        onError: (error) => {
          const err = apiErrors(error);
          toast.error(err.error || "Failed to remove member");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-semibold">Remove Member</DialogTitle>
          <DialogDescription className="text-[13px]">Are you sure you want to remove this member from the workspace?</DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          {/* Member Info */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/40">
            <Avatar className="h-9 w-9 rounded-lg border border-border/40 shrink-0">
              <AvatarImage src={member.user.avatar ?? ""} className="rounded-lg" />
              <AvatarFallback className="bg-accent text-[11px] font-semibold rounded-lg">
                {member.user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-[13px] font-medium truncate">{member.user.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{member.user.email}</p>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/20">
            <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-[12px] text-red-600 dark:text-red-400">
              This action will remove all access to projects and issues in this workspace.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 rounded-xl h-10" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1 rounded-xl h-10 bg-red-700 hover:bg-red-800"
              disabled={isPending}
              onClick={handleRemoveMember}
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin mr-2" />
                  Removing...
                </>
              ) : (
                "Remove Member"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveMember;
