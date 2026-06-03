import { useQuery } from "@tanstack/react-query";
import { getWorkspaceDetailsApi } from "../services/workspace.services";

export const useWorkspacesDetails = (workspaceSlug: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceSlug],
    queryFn: () => getWorkspaceDetailsApi(workspaceSlug),
    enabled: !!workspaceSlug,
    staleTime: 1000 * 60 * 5,
  });
};
