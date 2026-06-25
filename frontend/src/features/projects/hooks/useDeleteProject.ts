import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProjectApi } from "../services/project.services";

export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProjectApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({ queryKey: ["project"] });
        },
    });
};