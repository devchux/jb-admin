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
  RegisteredAppUserListResponse,
  DeviceRegistrationListResponse,
  AccountCreationListResponse,
} from "@/types/response";
import {
  BillPaymentMetricsRequest,
  OperationsSummaryRequest,
  TransactionMetricsRequest,
  TransactionStatusDistributionRequest,
  AccountActivityDateRequest,
  AccountActivityListRequest,
} from "@/types/request";

class DashboardService {
  getNewRegistrationCount(params?: AccountActivityDateRequest): Promise<AxiosResponse<number>> {
    return apiService.get("base", "/api/dashboard/admin/app-users/new-registrations/count", params);
  }

  getNewRegistrations(params?: AccountActivityListRequest): Promise<AxiosResponse<RegisteredAppUserListResponse>> {
    return apiService.get("base", "/api/dashboard/admin/app-users/new-registrations", params);
  }

  getPendingFirstLoginCount(params?: AccountActivityDateRequest): Promise<AxiosResponse<number>> {
    return apiService.get("base", "/api/dashboard/admin/app-users/pending-first-login/count", params);
  }

  getPendingFirstLogins(params?: AccountActivityListRequest): Promise<AxiosResponse<RegisteredAppUserListResponse>> {
    return apiService.get("base", "/api/dashboard/admin/app-users/pending-first-login", params);
  }

  getNewDeviceRegistrationCount(params?: AccountActivityDateRequest): Promise<AxiosResponse<number>> {
    return apiService.get("base", "/api/dashboard/admin/devices/new-registrations/count", params);
  }

  getNewDeviceRegistrations(params?: AccountActivityListRequest): Promise<AxiosResponse<DeviceRegistrationListResponse>> {
    return apiService.get("base", "/api/dashboard/admin/devices/new-registrations", params);
  }

  getNewAccountCreationCount(params?: AccountActivityDateRequest): Promise<AxiosResponse<number>> {
    return apiService.get("base", "/api/dashboard/admin/accounts/new-creations/count", params);
  }

  getNewAccountCreations(params?: AccountActivityListRequest): Promise<AxiosResponse<AccountCreationListResponse>> {
    return apiService.get("base", "/api/dashboard/admin/accounts/new-creations", params);
  }

  getSummary(
    filter?: string,
  ): Promise<AxiosResponse<DashboardSummaryResponse>> {
    return apiService.get(
      "base",
      "/api/dashboard/admin/summary",
      filter ? { filter } : {},
    );
  }

  getUsersChart(filter?: string): Promise<AxiosResponse<ChartResponse>> {
    return apiService.get(
      "base",
      "/api/dashboard/admin/users/chart",
      filter ? { filter } : {},
    );
  }

  getTransactionsChart(filter?: string): Promise<AxiosResponse<ChartResponse>> {
    return apiService.get(
      "base",
      "/api/dashboard/admin/transactions/chart",
      filter ? { filter } : {},
    );
  }

  getAppUserMetrics(): Promise<AxiosResponse<AppUserMetricsResponse>> {
    return apiService.get("base", "/api/dashboard/admin/app-users/metrics");
  }

  getTransactionMetrics(
    params?: TransactionMetricsRequest,
  ): Promise<AxiosResponse<TransactionMetricsResponse>> {
    return apiService.get(
      "base",
      "/api/dashboard/admin/transactions/metrics",
      params,
    );
  }

  getTransactionStatusDistribution(
    params?: TransactionStatusDistributionRequest,
  ): Promise<AxiosResponse<TransactionStatusDistributionResponse>> {
    return apiService.get(
      "base",
      "/api/dashboard/admin/transactions/status-distribution",
      params,
    );
  }

  getBillPaymentSummary(
    params?: BillPaymentMetricsRequest,
  ): Promise<AxiosResponse<BillPaymentSummaryResponse>> {
    return apiService.get("base", "/api/admin/bill-payments/summary", params);
  }

  getBillPaymentServiceBreakdown(
    params?: BillPaymentMetricsRequest,
  ): Promise<AxiosResponse<OperationsSummaryResponse>> {
    return apiService.get(
      "base",
      "/api/admin/bill-payments/service-breakdown",
      params,
    );
  }

  getBillPaymentOperationsSummary(
    params?: OperationsSummaryRequest,
  ): Promise<AxiosResponse<OperationsSummaryResponse>> {
    return apiService.get(
      "base",
      "/api/admin/bill-payments/operations-summary",
      params,
    );
  }

  getTransferOperationsSummary(
    params?: OperationsSummaryRequest,
  ): Promise<AxiosResponse<OperationsSummaryResponse>> {
    return apiService.get(
      "base",
      "/api/admin/operations/transfers/summary",
      params,
    );
  }
}

export const dashboardService = new DashboardService();
