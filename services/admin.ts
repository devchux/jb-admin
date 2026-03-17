import { LoginRequest } from "@/types/request";
import { apiService } from "./api";
import { LoginResponse } from "@/types/response";
import { AxiosResponse } from "axios";

class AdminService {
  loginAdminUser(data: LoginRequest): Promise<AxiosResponse<LoginResponse>> {
    return apiService.post("base", "/v1/admin/users/login", data);
  }
}

export const adminService = new AdminService();
