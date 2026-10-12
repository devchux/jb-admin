import { apiService } from "./api";
import {
  AdminAccessMetricsRequest,
  BillPaymentMetricsRequest,
  TransactionMetricsRequest,
} from "@/types/request";

class ExportService {
  transactions(filter?: string) {
    return apiService.get(
      "base",
      "/api/admin/export/transactions",
      filter ? { filter } : {},
    );
  }

  dashboard(filter?: string) {
    return apiService.get(
      "base",
      "/api/admin/export/dashboard-metrics",
      filter ? { filter } : {},
    );
  }

  audit(filter?: string) {
    return apiService.get(
      "base",
      "/api/admin/export/audit-logs",
      filter ? { filter } : {},
    );
  }

  transactionDashboardMetrics(params?: TransactionMetricsRequest) {
    return apiService.getBlob(
      "base",
      "/api/admin/export/transaction-dashboard-metrics",
      params,
    );
  }

  adminAccessMetrics(params?: AdminAccessMetricsRequest) {
    return apiService.getBlob(
      "base",
      "/api/admin/export/admin-access-metrics",
      params,
    );
  }

  billPayments(params?: BillPaymentMetricsRequest) {
    return apiService.getBlob("base", "/api/admin/export/bill-payments", params);
  }
}

export const exportService = new ExportService();
