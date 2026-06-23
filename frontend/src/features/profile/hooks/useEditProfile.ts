import { editUserProfileApi } from './../services/profile.services';
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useEditProfile = (username: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: editUserProfileApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-profile", username] });
            queryClient.invalidateQueries({ queryKey: ["members"] });
        },
    })
}