import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, CheckCircle2, Unlink } from "lucide-react";
import { useGithubConnect } from "../hooks/useGithubConnect";
import { apiErrors } from "@/shared/utils/errorHandler";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { toast } from "sonner";
import { useGithubDisconnect } from "../hooks/useGithubDisconnect";
import { useState } from "react";
import GithubLogo from "@/shared/icons/GithubLogo";

const ConnectUserGithub = () => {
  const { userData } = useAppSelector((store) => store.auth);
  const [isGitHubConnected, setIsGitHubConnected] = useState<boolean>(Boolean(userData?.githubAccount));

  const { mutateAsync: connect, isPending: connectLoading } = useGithubConnect();

  async function handleConnectGitHub() {
    try {
      const githubUrl = await connect();
      window.location.href = githubUrl;
    } catch (error) {
      const err = apiErrors(error);
      toast.error(err.error);
    }
  }

  const { mutateAsync: disconnect, isPending: disconnectLoading } = useGithubDisconnect();

  async function handleDisconnectGitHub() {
    try {
      await disconnect();
      toast.success("GitHub disconnected successfully");
      setIsGitHubConnected(false);
    } catch (error) {
      const err = apiErrors(error);
      toast.error(err.error);
    }
  }

  return (
    <div className="rounded-xl border border-border/40 bg-muted/30 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#24292e]/10 border border-[#24292e]/20 shrink-0">
            <GithubLogo></GithubLogo>
          </div>

          <div className="min-w-0">
            <h3 className="text-[14px] font-semibold">GitHub</h3>
            <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">
              Connect your GitHub account to link repositories, receive commit events, and track development activity.
            </p>

            {isGitHubConnected && userData?.githubAccount && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Connected</span>
                </div>
                <span className="text-[12px] text-muted-foreground">@{userData.githubAccount.username}</span>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0">
          {isGitHubConnected ? (
            <Button
              onClick={handleDisconnectGitHub}
              disabled={disconnectLoading}
              variant="outline"
              size="sm"
              className="rounded-xl h-9 gap-2 text-[13px] border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-600"
            >
              {disconnectLoading ? <Loader2 size={14} className="animate-spin" /> : <Unlink size={14} />}
              Disconnect
            </Button>
          ) : (
            <Button
              onClick={handleConnectGitHub}
              disabled={connectLoading}
              size="sm"
              className="rounded-xl h-9 gap-2 text-[13px] bg-[#24292e] hover:bg-[#1b1f23] text-white"
            >
              {connectLoading ? <Loader2 size={14} className="animate-spin" /> : <ExternalLink size={14} />}
              Connect
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectUserGithub;
