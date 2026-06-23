import { Navigate } from "react-router-dom";
import { useWorkspaces } from "../../workspace/hooks/useWorkspaces";
import MainLoder from "@/shared/components/MainLoder";

const Redirect = () => {
  
  const { data: workspaces, isLoading } = useWorkspaces();
  if (isLoading) return <MainLoder></MainLoder>;
  if (!workspaces?.length) return <Navigate to="/workspace/create" replace />;

  const lastSlug = localStorage.getItem("lastWorkspace");
  const valid = workspaces.find((ws) => ws.slug === lastSlug);
  const slug = valid?.slug ?? workspaces[0].slug;

  localStorage.setItem("lastWorkspace", slug);

  return <Navigate to={`/${slug}`} replace />;
};

export default Redirect;
