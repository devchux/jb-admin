import {
  ChangePasswordRequest,
  CreateUserRequest,
  PaginatedRequest,
} from "@/types/request";
import {
  AdminAccessMetricsResponse,
  AppUserListResponse,
  UserListResponse,
} from "@/types/response";
import { apiService } from "./api";
import { AxiosResponse } from "axios";
import { User } from "@/types/common";
import { useStore } from "@/store";

class UserService {
  getAllUsers(
    params: PaginatedRequest,
  ): Promise<AxiosResponse<UserListResponse>> {
    return apiService.get("base", "/v1/admin/users", params);
  }

  getAppUsers(
    params: PaginatedRequest,
  ): Promise<AxiosResponse<AppUserListResponse>> {
    return apiService.get("base", "/v1/admin/userManagements", params);
  }

  createUser(data: CreateUserRequest): Promise<AxiosResponse<User>> {
    return apiService.post("base", "/v1/admin/users", data);
  }

  updateUser(
    id: string,
    data: CreateUserRequest,
  ): Promise<AxiosResponse<User>> {
    const adminId = useStore.getState().user.id;
    return apiService.put("base", `/v1/admin/users/${id}`, {
      ...data,
      createdBy: adminId,
    });
  }

  activateUser(id: string): Promise<AxiosResponse<void>> {
    return apiService.put("base", `/v1/admin/users/${id}/activate`);
  }

  deactivateUser(id: string): Promise<AxiosResponse<void>> {
    return apiService.put("base", `/v1/admin/users/${id}/deactivate`);
  }

  changePassword(data: ChangePasswordRequest): Promise<AxiosResponse<void>> {
    return apiService.put("base", "/v1/admin/users/change-password", data);
  }

  unlockAdminUserAccount(
    userId: string,
    adminUserId: string,
  ): Promise<AxiosResponse<void>> {
    return apiService.post(
      "base",
      `/v1/admin/users/admin/unlock-account/${userId}`,
      undefined,
      undefined,
      {
        headers: {
          "Admin-User-Id": adminUserId,
        },
      },
    );
  }

  unlockUser(id: string, adminId: string): Promise<AxiosResponse<void>> {
    return apiService.post("base", `/v1/admin/userManagements`, {
      userId: id,
      adminUserId: adminId,
    });
  }

  getAdminAccessMetrics(
    noRecentLoginCutoff?: string,
  ): Promise<AxiosResponse<AdminAccessMetricsResponse>> {
    return apiService.get(
      "base",
      "/v1/admin/users/access-control/metrics",
      noRecentLoginCutoff ? { noRecentLoginCutoff } : {},
    );
  }
}

export const userService = new UserService();
