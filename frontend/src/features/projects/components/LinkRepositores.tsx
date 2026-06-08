import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link, Loader2 } from "lucide-react";
import { useGithubRepositories } from "../hooks/useGithubRepositories";
import { useLinkRepository } from "../hooks/useLinkRepositories";
import { useParams } from "react-router-dom";
import { apiErrors } from "@/shared/utils/errorHandler";
import { useState } from "react";
import type { GithubRepository } from "../types/github.types";

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
      console.log(error);

      const err = apiErrors(error);
      console.log(err);
      alert(err.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Link></Link>
          Link Repository
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Repository</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <Loader2 className="w-full flex justify-center items-center animate-spin" />
        ) : (
          <div className="space-y-2">
            {repos?.map((repo: GithubRepository) => (
              <Button
                key={repo.id}
                variant="outline"
                className="w-full justify-start"
                disabled={isPending}
                onClick={() => handleLinkRepo(String(repo.id), repo.fullName)}
              >
                {repo.fullName}
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LinkRepository;
