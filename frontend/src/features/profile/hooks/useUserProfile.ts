import { useQuery } from "@tanstack/react-query";
import { getUserProfileApi } from "../services/profile.services";

export const useUserProfile = (username?: string) => {
  return useQuery({
    queryKey: ["user-profile", username],
    queryFn: () => getUserProfileApi(username!),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });
};