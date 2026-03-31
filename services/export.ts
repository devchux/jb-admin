import { apiService } from "./api";

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
}

export const exportService = new ExportService();
