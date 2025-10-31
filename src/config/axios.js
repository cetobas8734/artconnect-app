import axios from "axios";
import { useAuthStore } from "@/stores/auth.js";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config) => {
    const authStore = useAuthStore();
    const token = authStore.jwtToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const authStore = useAuthStore();
    if (error.response && error.response.status === 401) {
      console.error(
        "401 Unauthorized: JWT token invalid or expired. Logging out."
      );
      authStore.logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
