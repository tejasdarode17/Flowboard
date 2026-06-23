import { useMutation, useQueryClient } from "@tanstack/react-query"
import { chnageRoleApi } from "../services/workspace.services"

export const useUpdateMemberRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: chnageRoleApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["worksapces"] });
            queryClient.invalidateQueries({ queryKey: ["members"] });
        }
    })
}

