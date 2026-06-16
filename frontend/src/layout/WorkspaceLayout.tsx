import { useRTNotifications } from "@/features/notifications/useRTNotifications";
import { useWorkspaces } from "@/features/workspace/hooks/useWorkspaces";
import { connectSocket } from "@/shared/lib/socket";
import { useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";

const WorkspaceLayout = () => {
  const { workspaceSlug } = useParams();
  const { data: workspaces } = useWorkspaces();
  const workspace = workspaces?.find((w) => w.slug === workspaceSlug);

  useRTNotifications(workspaceSlug!);
  
  useEffect(() => {
    const socket = connectSocket();
    if (workspace?.id) {
      socket?.emit("join:workspace", workspace.id);
    }
  }, [workspace?.id]);

  if (!workspaceSlug) return <Navigate to="/create-workspace" replace />;
  return <Outlet />;
};

export default WorkspaceLayout;
