import api from "@/api/axiosInstance";

export const googleOAuth = async (googleToken: string) => {
    return api.post("/api/auth/google/login", { googleToken });
};
