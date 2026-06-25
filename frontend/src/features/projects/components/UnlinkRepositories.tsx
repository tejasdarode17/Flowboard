import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, AlertCircle, Unlink } from "lucide-react";
import GithubLogo from "@/shared/icons/GithubLogo";
import { toast } from "sonner";
import { useUnlinkRepository } from "../hooks/useUnlinkRepository";
import { Separator } from "@/components/ui/separator";

interface UnlinkRepositoryProps {
  projectId: string;
  workspaceSlug: string;
}

const UnlinkRepository = ({ projectId, workspaceSlug }: UnlinkRepositoryProps) => {
  const [open, setOpen] = useState(false);
  const { mutate: unlink, isPending } = useUnlinkRepository(workspaceSlug, projectId);

  const handleUnlink = () => {
    unlink(
      { workspaceSlug, projectId },
      {
        onSuccess: () => {
          toast.success("Repository unlinked successfully");
          setOpen(false);
        },
        onError: () => {
          toast.error("Failed to unlink repository");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl h-9 gap-2 text-[13px]">
          <Unlink size={14} />
          <span className="hidden sm:inline">Unlink</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#24292e]/10 border border-[#24292e]/20 shrink-0">
              <GithubLogo size={25} />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold font-heading tracking-tight">Unlink Repository</DialogTitle>
              <DialogDescription className="text-[13px] text-muted-foreground mt-0.5">
                This will disconnect the GitHub repository from this project.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
      <Separator className="mb-2"></Separator>

        <div className="px-6 pb-6 space-y-4">
          {/* Info */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/40">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-[#24292e]/10 border border-[#24292e]/20 shrink-0">
              <GithubLogo size={16} />
            </div>
            <p className="text-[13px] text-muted-foreground">Project will no longer receive commit events and activity updates.</p>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-[12px] text-amber-600 dark:text-amber-400">
              You can re-link the repository anytime from project settings. Existing issues will not be affected.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1 rounded-xl h-10 text-[13px]" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="flex-1 rounded-xl h-10 text-[13px] gap-2" disabled={isPending} onClick={handleUnlink}>
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Unlinking...
                </>
              ) : (
                <>
                  <Unlink size={14} />
                  Unlink Repository
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnlinkRepository;
