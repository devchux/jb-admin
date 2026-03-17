import { PaginatedRequest } from "@/types/request";
import { apiService } from "./api";
import { AxiosResponse } from "axios";
import { AuditLogListResponse } from "@/types/response";

class AuditLogService {
  getLogs(
    params: PaginatedRequest,
  ): Promise<AxiosResponse<AuditLogListResponse>> {
    return apiService.get("base", "/v1/admin/audit-logs", params);
  }

  exportLog(ids: number[]): Promise<AxiosResponse<string>> {
    return apiService.get("base", "/v1/admin/audit-logs/export", { ids });
  }
}

export const auditLogService = new AuditLogService();
