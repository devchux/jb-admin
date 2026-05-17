import { useStore } from "@/store";
import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { LoginResponse } from "@/types/response";

type AuthAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuth?: boolean;
};

type AuthAxiosConfig = AxiosRequestConfig & {
  skipAuth?: boolean;
};

let refreshRequest: Promise<LoginResponse> | null = null;

const logout = () => {
  useStore.getState().reset();
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};

const refreshAccessToken = async () => {
  const refreshToken = useStore.getState().refresh;

  if (!refreshToken) {
    throw new Error("Refresh token is unavailable");
  }

  if (!refreshRequest) {
    refreshRequest = axios
      .post<LoginResponse>(
        "/api/proxy?service=base&endpoint=/v1/admin/users/refresh-token",
        { refreshToken },
        { skipAuth: true } as AuthAxiosConfig,
      )
      .then((response) => response.data)
      .finally(() => {
        refreshRequest = null;
      });
  }

  const response = await refreshRequest;
  const { access_token, refresh_token, user } = response.data;
  const store = useStore.getState();

  store.setToken(access_token, refresh_token);
  store.setUser(user);

  return access_token;
};

axios.interceptors.request.use(
  (config) => {
    const authConfig = config as AuthAxiosRequestConfig;
    if (authConfig.skipAuth) {
      return config;
    }

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
  async (error: AxiosError) => {
    const originalConfig = error.config as AuthAxiosRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalConfig ||
      originalConfig._retry ||
      originalConfig.skipAuth
    ) {
      return Promise.reject(error);
    }

    originalConfig._retry = true;

    try {
      const accessToken = await refreshAccessToken();
      originalConfig.headers.Authorization = `Bearer ${accessToken}`;
      return axios(originalConfig);
    } catch (refreshError) {
      logout();
      return Promise.reject(refreshError);
    }
  },
);

export default axios;
