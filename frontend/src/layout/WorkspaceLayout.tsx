import { Navigate, Outlet, useParams } from "react-router-dom";

const WorkspaceLayout = () => {
  const { workspaceSlug } = useParams();
  if (!workspaceSlug) return <Navigate to="/create-workspace" replace />;
  return <Outlet />;
};

export default WorkspaceLayout;
