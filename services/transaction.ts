import { PaginatedRequest } from "@/types/request";
import { apiService } from "./api";
import { AxiosResponse } from "axios";
import { TransactionListResponse } from "@/types/response";

class TransactionService {
  getIntraTransactions(
    params: Pick<PaginatedRequest, "page" | "size">,
  ): Promise<AxiosResponse<TransactionListResponse>> {
    return apiService.get("base", "/v1/admin/transactions/intrabank", params);
  }

  getInterTransactions(
    params: Pick<PaginatedRequest, "page" | "size">,
  ): Promise<AxiosResponse<TransactionListResponse>> {
    return apiService.get("base", "/v1/admin/transactions/interbank", params);
  }

  getNQRTransactions(
    params: Pick<PaginatedRequest, "page" | "size">,
  ): Promise<AxiosResponse<TransactionListResponse>> {
    return apiService.get("base", "/v1/admin/transactions/nqr", params);
  }

  getElectricityTransactions(
    params: Pick<PaginatedRequest, "page" | "size">,
  ): Promise<AxiosResponse<TransactionListResponse>> {
    return apiService.get("base", "/v1/admin/transactions/electricity", params);
  }

  getOmniBillPaymentTransactions(
    params: Pick<PaginatedRequest, "page" | "size">,
  ): Promise<AxiosResponse<TransactionListResponse>> {
    return apiService.get(
      "base",
      "/v1/admin/transactions/bill-payment/omni",
      params,
    );
  }

  getMobileBillPaymentTransactions(
    params: Pick<PaginatedRequest, "page" | "size">,
  ): Promise<AxiosResponse<TransactionListResponse>> {
    return apiService.get(
      "base",
      "/v1/admin/transactions/bill-payment/mobile",
      params,
    );
  }

  getAirtimeDataTransactions(
    params: Pick<PaginatedRequest, "page" | "size">,
  ): Promise<AxiosResponse<TransactionListResponse>> {
    return apiService.get(
      "base",
      "/v1/admin/transactions/airtime-data",
      params,
    );
  }
}

export const transactionService = new TransactionService();
