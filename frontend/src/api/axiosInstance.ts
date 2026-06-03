import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";


interface RetryConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

let isRefreshing = false;

let failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
    failedQueue.forEach((p) => {
        if (error) {
            p.reject(error);
        } else {
            p.resolve(null);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,  //success req should go to their endpoint

    async (error: AxiosError) => {
        const originalRequest = error.config as RetryConfig;

        // safety check if orignal req itself is not exist
        if (!originalRequest) {
            return Promise.reject(error);
        }

        // don't intercept refresh endpoint itself
        if (
            originalRequest.url?.includes("/api/auth/refresh") ||
            originalRequest.url?.includes("/api/auth/login") ||
            originalRequest.url?.includes("/api/auth/register") ||
            originalRequest.url?.includes("/api/auth/google/login")
        ) {
            return Promise.reject(error);
        }

        //handle only 401
        if (error.response?.status === 401 && !originalRequest._retry) {

            // if refresh already running then push requests to queue here race conditions is prevented
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return api(originalRequest);
                });
            }

            // first request becomes leader 
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await api.get("/api/auth/refresh");
                processQueue(null);
                return api(originalRequest);
            } catch (err) {
                // refresh failed reject all queued requests
                processQueue(err);

                //logout user and clear his state 
                if (error.response?.status === 401) {
                    try {
                        await api.post("/api/auth/logout");
                    } catch (logoutErr) {
                        console.log("Logout API failed:", logoutErr);
                    }
                    const { default: store } = await import("@/redux/store");
                    const { clearUser } = await import("@/redux/authSlice");
                    store.dispatch(clearUser());
                }

                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;