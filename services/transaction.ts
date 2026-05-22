import { TransactionListRequest } from "@/types/request";
import { apiService } from "./api";
import { AxiosResponse } from "axios";
import { TransactionListResponse } from "@/types/response";

type WrappedTransactionListResponse =
  | TransactionListResponse
  | { data: TransactionListResponse };
type TransactionTableRequest = Pick<
  TransactionListRequest,
  "page" | "size" | "dateFilter" | "startDate" | "endDate" | "status"
>;

class TransactionService {
  private normalizeListResponse(
    response: AxiosResponse<WrappedTransactionListResponse>,
  ): AxiosResponse<TransactionListResponse> {
    const payload = response.data;
    const data = "content" in payload ? payload : payload.data;

    return {
      ...response,
      data,
    };
  }

  getIntraTransactions(
    params: TransactionTableRequest,
  ): Promise<AxiosResponse<TransactionListResponse>> {
    return apiService
      .get("base", "/v1/admin/transactions/intrabank", params)
      .then(this.normalizeListResponse);
  }

  getInterTransactions(
    params: TransactionTableRequest,
  ): Promise<AxiosResponse<TransactionListResponse>> {
    return apiService
      .get("base", "/v1/admin/transactions/interbank", params)
      .then(this.normalizeListResponse);
  }

  getNQRTransactions(
    params: TransactionTableRequest,
  ): Promise<AxiosResponse<TransactionListResponse>> {
    return apiService
      .get("base", "/v1/admin/transactions/nqr", params)
      .then(this.normalizeListResponse);
  }

  getElectricityTransactions(
    params: TransactionTableRequest,
  ): Promise<AxiosResponse<TransactionListResponse>> {
    return apiService
      .get("base", "/v1/admin/transactions/electricity", params)
      .then(this.normalizeListResponse);
  }

  getOmniBillPaymentTransactions(
    params: TransactionTableRequest,
  ): Promise<AxiosResponse<TransactionListResponse>> {
    return apiService
      .get("base", "/v1/admin/transactions/bill-payment/omni", params)
      .then(this.normalizeListResponse);
  }

  getMobileBillPaymentTransactions(
    params: TransactionTableRequest,
  ): Promise<AxiosResponse<TransactionListResponse>> {
    return apiService
      .get("base", "/v1/admin/transactions/bill-payment/mobile", params)
      .then(this.normalizeListResponse);
  }

  getAirtimeDataTransactions(
    params: TransactionTableRequest,
  ): Promise<AxiosResponse<TransactionListResponse>> {
    return apiService
      .get("base", "/v1/admin/transactions/airtime-data", params)
      .then(this.normalizeListResponse);
  }

  getTransactions(
    params: TransactionListRequest,
  ): Promise<AxiosResponse<TransactionListResponse>> {
    return apiService
      .get("base", "/v1/admin/transactions", params)
      .then(this.normalizeListResponse);
  }
}

export const transactionService = new TransactionService();
