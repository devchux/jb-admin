import {
  ForgotPasswordRequest,
  LoginRequest,
  RefreshTokenRequest,
  ResetPasswordRequest,
} from "@/types/request";
import { apiService } from "./api";
import { LoginResponse } from "@/types/response";
import { AxiosResponse } from "axios";

class AdminService {
  loginAdminUser(data: LoginRequest): Promise<AxiosResponse<LoginResponse>> {
    return apiService.post("base", "/v1/admin/users/login", data);
  }

  refreshToken(
    data: RefreshTokenRequest,
  ): Promise<AxiosResponse<LoginResponse>> {
    return apiService.post("base", "/v1/admin/users/refresh-token", data);
  }

  forgotPassword(data: ForgotPasswordRequest): Promise<AxiosResponse<void>> {
    return apiService.post("base", "/v1/admin/users/forgot-password", data);
  }

  resetPassword(data: ResetPasswordRequest): Promise<AxiosResponse<void>> {
    return apiService.post("base", "/v1/admin/users/reset-password", data);
  }
}

export const adminService = new AdminService();
