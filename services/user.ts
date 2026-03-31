import { CreateUserRequest, PaginatedRequest } from "@/types/request";
import { UserListResponse } from "@/types/response";
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
}

export const userService = new UserService();
