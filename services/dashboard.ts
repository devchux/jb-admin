import { AxiosResponse } from "axios";
import { apiService } from "./api";
import {
  AppUserMetricsResponse,
  BillPaymentSummaryResponse,
  ChartResponse,
  DashboardSummaryResponse,
  OperationsSummaryResponse,
  TransactionMetricsResponse,
  TransactionStatusDistributionResponse,
} from "@/types/response";
import {
  BillPaymentMetricsRequest,
  OperationsSummaryRequest,
  TransactionMetricsRequest,
  TransactionStatusDistributionRequest,
} from "@/types/request";

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

  getTransactionStatusDistribution(
    params?: TransactionStatusDistributionRequest,
  ): Promise<AxiosResponse<TransactionStatusDistributionResponse>> {
    return apiService.get(
      "base",
      "/dashboard/admin/transactions/status-distribution",
      params,
    );
  }

  getBillPaymentSummary(
    params?: BillPaymentMetricsRequest,
  ): Promise<AxiosResponse<BillPaymentSummaryResponse>> {
    return apiService.get("base", "/admin/bill-payments/summary", params);
  }

  getBillPaymentServiceBreakdown(
    params?: BillPaymentMetricsRequest,
  ): Promise<AxiosResponse<OperationsSummaryResponse>> {
    return apiService.get(
      "base",
      "/admin/bill-payments/service-breakdown",
      params,
    );
  }

  getBillPaymentOperationsSummary(
    params?: OperationsSummaryRequest,
  ): Promise<AxiosResponse<OperationsSummaryResponse>> {
    return apiService.get(
      "base",
      "/admin/bill-payments/operations-summary",
      params,
    );
  }

  getTransferOperationsSummary(
    params?: OperationsSummaryRequest,
  ): Promise<AxiosResponse<OperationsSummaryResponse>> {
    return apiService.get(
      "base",
      "/admin/operations/transfers/summary",
      params,
    );
  }
}

export const dashboardService = new DashboardService();
