import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useGithubRepositories } from "../hooks/useGithubRepositories";
import { useLinkRepository } from "../hooks/useLinkRepositories";
import { useParams } from "react-router-dom";
import type { GitHubRepository } from "../types/github.types";

interface Props {
  projectId: string;
}

const LinkRepository = ({ projectId }: Props) => {
  const { workspaceSlug } = useParams();

  const { data: repos, isLoading } = useGithubRepositories();
  const { mutateAsync, isPending } = useLinkRepository(workspaceSlug!, projectId!);

  console.log(repos);

  async function handleLinkRepo(repoId: string, repoFullName: string) {
    await mutateAsync({
      projectId,
      repoId,
      repoFullName,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Link Repository</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Repository</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <div className="space-y-2">
            {repos?.map((repo: GitHubRepository) => (
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
