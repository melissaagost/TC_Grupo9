import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Interceptor de request para token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response para manejar errores
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Tu sesión ha expirado. Por favor iniciá sesión nuevamente.");

      localStorage.removeItem("token");
      setTimeout(() => {
        window.location.href = "/auth";
      }, 3000);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
