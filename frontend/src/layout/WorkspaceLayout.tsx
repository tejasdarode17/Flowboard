import { useRTNotifications } from "@/features/notifications/hooks/useRTNotifications";
import { useWorkspaces } from "@/features/workspace/hooks/useWorkspaces";
import MainLoder from "@/shared/components/MainLoder";
import { connectSocket } from "@/shared/lib/socket";
import { useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";

const WorkspaceLayout = () => {
  const { workspaceSlug } = useParams();

  const { data: workspaces, isLoading } = useWorkspaces();
  const workspace = workspaces?.find((w) => w.slug === workspaceSlug);

  useEffect(() => {
    if (workspaceSlug) {
      localStorage.setItem("lastWorkspace", workspaceSlug);
    }
  }, [workspaceSlug]);

  useRTNotifications(workspaceSlug!);

  useEffect(() => {
    const socket = connectSocket();
    if (workspace?.id) {
      socket?.emit("join:workspace", workspace.id);
    }
  }, [workspace?.id]);

  if (isLoading) return <MainLoder />;
  if (!workspaceSlug) return <Navigate to="/create-workspace" replace />;

  if (!workspace) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default WorkspaceLayout;
