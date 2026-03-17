import { useStore } from "@/store";
import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    const accessToken = useStore.getState().access ?? null;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error);
  },
);

export default axios;
