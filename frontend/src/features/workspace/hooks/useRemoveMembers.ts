
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMemberApi } from "../services/workspace.services";

export const useRemoveMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeMemberApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
};