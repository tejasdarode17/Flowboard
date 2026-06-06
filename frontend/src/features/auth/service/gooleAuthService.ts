import api from "@/api/axiosInstance";

export const googleOAuthApi = async (googleToken: string) => {
    const response = await api.post("/api/auth/google/login", { googleToken });
    console.log(response);
    
    return response
};
