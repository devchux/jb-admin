import { AxiosResponse } from "axios";
import { apiService } from "./api";
import {
  AppUserMetricsResponse,
  ChartResponse,
  DashboardSummaryResponse,
  TransactionMetricsResponse,
} from "@/types/response";
import { TransactionMetricsRequest } from "@/types/request";

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

  getAppUserMetrics(): Promise<AxiosResponse<AppUserMetricsResponse>> {
    return apiService.get("base", "/dashboard/admin/app-users/metrics");
  }

  getTransactionMetrics(
    params?: TransactionMetricsRequest,
  ): Promise<AxiosResponse<TransactionMetricsResponse>> {
    return apiService.get(
      "base",
      "/dashboard/admin/transactions/metrics",
      params,
    );
  }
}

export const dashboardService = new DashboardService();
