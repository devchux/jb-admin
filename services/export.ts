import { apiService } from "./api";
import {
  AdminAccessMetricsRequest,
  TransactionMetricsRequest,
} from "@/types/request";

class ExportService {
  transactions(filter?: string) {
    return apiService.get(
      "base",
      "/admin/export/transactions",
      filter ? { filter } : {},
    );
  }

  dashboard(filter?: string) {
    return apiService.get(
      "base",
      "/admin/export/dashboard-metrics",
      filter ? { filter } : {},
    );
  }

  audit(filter?: string) {
    return apiService.get(
      "base",
      "/admin/export/audit-logs",
      filter ? { filter } : {},
    );
  }

  transactionDashboardMetrics(params?: TransactionMetricsRequest) {
    return apiService.getBlob(
      "base",
      "/admin/export/transaction-dashboard-metrics",
      params,
    );
  }

  adminAccessMetrics(params?: AdminAccessMetricsRequest) {
    return apiService.getBlob(
      "base",
      "/admin/export/admin-access-metrics",
      params,
    );
  }
}

export const exportService = new ExportService();
