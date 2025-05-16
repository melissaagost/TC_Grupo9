import axios from "axios";

const BASE_URL = "/api"

const axiosInstance = axios.create({
   baseURL: BASE_URL
});

// Interceptor para agregar el token a cada request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // o sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;