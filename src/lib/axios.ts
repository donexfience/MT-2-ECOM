import axios from "axios";

type AxiosResponse = Parameters<Parameters<typeof axios.interceptors.response.use>[0]>[0];
type AxiosError = Parameters<Parameters<typeof axios.interceptors.response.use>[1]>[0];
type InternalAxiosRequestConfig = Parameters<Parameters<typeof axios.interceptors.request.use>[0]>[0];

interface QueuedRequest {
  resolve: (value: AxiosResponse) => void;
  reject: (reason: AxiosError) => void;
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  withCredentials: true,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: string | null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(new Error(error));
    } else {
      prom.resolve({} as AxiosResponse);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const excludedPaths = ["/api/auth/login", "/api/auth/signup"];

    // Skip retry logic for login/signup routes
    if (excludedPaths.some((path) => originalRequest.url?.includes(path))) {
      return Promise.reject(error);
    }

    // Handle 401 errors (unauthorized)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err: AxiosError) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        await axiosInstance.post("/api/auth/refresh");
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        const errorMessage = refreshError instanceof Error 
          ? refreshError.message 
          : typeof refreshError === "string" 
          ? refreshError 
          : "An unknown error occurred";
        
        processQueue(errorMessage);

        if (typeof window !== "undefined") {
          window.location.href = "/sign-in";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;