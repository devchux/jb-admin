import { AxiosResponse } from "axios";
import { apiService } from "./api";
import { ChartResponse, DashboardSummaryResponse } from "@/types/response";

class DashboardService {
  getSummary(
    filter?: string,
  ): Promise<AxiosResponse<DashboardSummaryResponse>> {
    return apiService.get(
      "base",
      "/dashboard/admin/summary",
      filter ? { filter } : {},
    );
  }

  getUsersChart(filter?: string): Promise<AxiosResponse<ChartResponse>> {
    return apiService.get(
      "base",
      "/dashboard/admin/users/chart",
      filter ? { filter } : {},
    );
  }

  getTransactionsChart(filter?: string): Promise<AxiosResponse<ChartResponse>> {
    return apiService.get(
      "base",
      "/dashboard/admin/transactions/chart",
      filter ? { filter } : {},
    );
  }
}

export const dashboardService = new DashboardService();
