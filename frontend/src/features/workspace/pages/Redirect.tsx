import { Navigate } from "react-router-dom";
import { useWorkspaces } from "../hooks/useWorkspaces";

const Redirect = () => {
  
  const { data: workspaces, isLoading } = useWorkspaces();
  if (isLoading) return <h1 className="flex justify-between items-center h-screen">Loading</h1>;
  if (!workspaces?.length) return <Navigate to="/workspace/create" replace />;

  const lastSlug = localStorage.getItem("lastWorkspace");
  const valid = workspaces.find((ws) => ws.slug === lastSlug);
  const slug = valid?.slug ?? workspaces[0].slug;

  return <Navigate to={`/${slug}`} replace />;
};

export default Redirect;
