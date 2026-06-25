import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, Search } from "lucide-react";
import { useGithubRepositories } from "../hooks/useGithubRepositories";
import { useLinkRepository } from "../hooks/useLinkRepositories";
import { useParams } from "react-router-dom";
import { apiErrors } from "@/shared/utils/errorHandler";
import { useState } from "react";
import type { GithubRepository } from "../types/github.types";
import GithubLogo from "@/shared/icons/GithubLogo";
import { Separator } from "@/components/ui/separator";

interface LinkRepositoresProps {
  projectId: string;
}

const LinkRepository = ({ projectId }: LinkRepositoresProps) => {
  const [open, setOpen] = useState(false);
  const { workspaceSlug } = useParams();
  const { data: repos, isLoading } = useGithubRepositories();
  const { mutateAsync, isPending } = useLinkRepository(workspaceSlug!, projectId!);

  async function handleLinkRepo(repoId: string, repoFullName: string) {
    try {
      const data = {
        repoId,
        repoFullName,
        projectId,
      };
      await mutateAsync({
        data,
        workspaceSlug: workspaceSlug || "",
      });
      setOpen(false);
    } catch (error) {
      const err = apiErrors(error);
      alert(err.error);
    }
  }

  const noRepo = repos?.length === 0 || repos === undefined || repos === null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl h-9 gap-2 text-[13px]">
          <GithubLogo size={14} />
          <span className="hidden sm:inline">Link Repo</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl p-0 gap-0 flex flex-col max-h-[85vh]">
        {/* Fixed Header */}
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#24292e]/10 border border-[#24292e]/20 shrink-0">
              <GithubLogo size={17} />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold font-heading tracking-tight">Link Repository</DialogTitle>
              <DialogDescription className="text-[13px] text-muted-foreground mt-0.5">
                Select a GitHub repository to link with this project.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator className="mb-2"></Separator>
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-muted-foreground" size={22} strokeWidth={1.5} />
            </div>
          ) : noRepo ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-muted/50 border border-border/30 mb-4">
                <Search size={22} className="text-muted-foreground/60" strokeWidth={1.5} />
              </div>
              <p className="text-[15px] font-semibold font-heading mb-1.5">No repositories found</p>
              <p className="text-[13px] text-muted-foreground text-center max-w-sm">
                Make sure your GitHub account is connected and has repositories.
              </p>
            </div>
          ) : (
            <div className="px-6 pb-6 space-y-1">
              {repos?.map((repo: GithubRepository, index: number) => (
                <div key={repo.id} className="relative">
                  {/* Subtle separator between items */}
                  {index > 0 && <div className="absolute top-0 left-12 right-0 h-px bg-border/20" />}
                  <button
                    disabled={isPending}
                    onClick={() => handleLinkRepo(String(repo.id), repo.fullName)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-accent/30 transition-all duration-150 group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-[#24292e]/5 border border-[#24292e]/10 shrink-0">
                        <GithubLogo size={14} />
                      </div>
                      <span className="text-[13px] font-medium truncate">{repo.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <ExternalLink
                        size={14}
                        className="text-muted-foreground/30 group-hover:text-muted-foreground/70 transition-all duration-150"
                      />
                      <span className="text-[11px] text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-all duration-150 opacity-0 group-hover:opacity-100">
                        Link
                      </span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        {!isLoading && !noRepo && repos && repos.length > 3 && (
          <div className="px-6 py-3 border-t border-border/30 shrink-0 text-center">
            <p className="text-[11px] text-muted-foreground/60">{repos.length} repositories available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LinkRepository;
