import { Button } from "@/components/ui/button";
import { GitGraphIcon, Loader2 } from "lucide-react";
import { useGithubConnect } from "../hooks/useGithubConnect";
import { apiErrors } from "@/shared/utils/errorHandler";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { useParams } from "react-router-dom";

const Settings = () => {
  const { workspaceSlug } = useParams();

  const { userData } = useAppSelector((store) => store.auth);

  const isGitHubConnected = Boolean(userData?.gitHubAccount);

  
  const { mutateAsync, isPending } = useGithubConnect(workspaceSlug!);

  async function handleConnectGitHub() {
    try {
      const githubUrl = await mutateAsync();
      window.location.href = githubUrl;
    } catch (error) {
      const err = apiErrors(error);
      console.log(err);
      alert(err.error);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage integrations and account preferences.</p>
      </div>

      <div className="rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GitGraphIcon className="h-8 w-8" />

            <div>
              <h2 className="font-medium">GitHub</h2>
              <p className="text-muted-foreground text-sm">
                Connect your GitHub account to link repositories and receive repository events.
              </p>
            </div>
          </div>

          {isGitHubConnected ? (
            <Button disabled variant="outline" className="bg-green-600">
              Connected (@{userData?.gitHubAccount?.username})
            </Button>
          ) : (
            <Button onClick={handleConnectGitHub} disabled={isPending} variant="outline">
              {isPending ? <Loader2 className="animate-spin" /> : "Connect GitHub"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
