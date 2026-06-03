import { useMutation } from '@tanstack/react-query';
import googleAuth from '../config/firebase';
import { googleOAuth } from '../service/gooleAuthService';

export const useGoogleLogin = () => {
    return useMutation({
        mutationFn: async () => {
            const result = await googleAuth()
            const token = await result?.user?.getIdToken();
            if (!token) throw new Error("Failed to get Google token")
            return googleOAuth(token);
        },
        onError: (error) => {
            throw error
        }
    })
}

