import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { setAuthToken } from "./authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Separate instance to avoid infinite interceptor loops
const refreshApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Attach access token to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as CustomRequestConfig;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && error.response?.data?.code === "TOKEN_EXPIRED") {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      try {
        const { data } = await refreshApi.post("/auth/refresh", {
          refresh_token: refreshToken,
        });
        const newAccessToken = data.data.access_token;

        setAuthToken(newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        localStorage.removeItem("access_token");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
