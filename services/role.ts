import { AxiosResponse } from "axios";
import { apiService } from "./api";
import { Permission } from "@/types/common";
import { CreateRoleRequest } from "@/types/request";
import { useStore } from "@/store";

class RoleService {
  getRoles(params?: Record<string, string>) {
    return apiService.get("base", "/admin/roles", params);
  }

  getPermissions(): Promise<AxiosResponse<Permission[]>> {
    return apiService.get("base", "/admin/roles/permissions");
  }

  createRole(data: CreateRoleRequest) {
    const adminId = useStore.getState().user.id;
    return apiService.post("base", "/admin/roles", {
      ...data,
      createdBy: adminId,
    });
  }

  updateRole(id: string, data: CreateRoleRequest) {
    const adminId = useStore.getState().user.id;
    return apiService.put("base", `/admin/roles/${id}`, {
      ...data,
      lastModifiedBy: adminId,
    });
  }
}

export const roleService = new RoleService();
