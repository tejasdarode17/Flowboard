import { useQuery } from "@tanstack/react-query";
import { getMyIssuesApi } from "../services/issue.services";

export const useUserIssues = (workspaceSlug: string) => {
    return useQuery({
        queryKey: ["myIssues", workspaceSlug],
        queryFn: () => getMyIssuesApi(workspaceSlug!),
        enabled: !!workspaceSlug,
    });

}