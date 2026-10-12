import { AxiosResponse } from "axios";
import { apiService } from "./api";
import {
  ApprovalListParams,
  RecordCheckerApprovalRecommendationRequest,
  RecordMakerApprovalRecommendationRequest,
} from "@/types/request";
import {
  ApprovalRecommendationResponse,
  ApprovalsListResponse,
  ApprovalStatusResponse,
} from "@/types/response";
import { cleanObject } from "@/lib/utils";

export class ApprovalService {
  recordMakerRecommendation(
    approvalRequestId: string,
    body: RecordMakerApprovalRecommendationRequest,
  ): Promise<AxiosResponse<ApprovalRecommendationResponse>> {
    return apiService.post(
      "base",
      `/approvals/${approvalRequestId}/maker-action`,
      body,
    );
  }

  recordCheckerRecommendation(
    approvalRequestId: string,
    body: RecordCheckerApprovalRecommendationRequest,
  ): Promise<AxiosResponse<ApprovalRecommendationResponse>> {
    return apiService.post(
      "base",
      `/approvals/${approvalRequestId}/checker-action`,
      body,
    );
  }

  getApprovals(
    params?: ApprovalListParams,
  ): Promise<AxiosResponse<ApprovalsListResponse>> {
    const query = params
      ? {
          ...params,
          requestedFrom: params.requestedFrom?.toISOString(),
          requestedTo: params.requestedTo?.toISOString(),
        }
      : {};
    return apiService.get(
      "base",
      "/approvals",
      cleanObject(query as Record<string, unknown>),
    );
  }

  getApprovalByRequestId(
    approvalRequestId: string,
  ): Promise<AxiosResponse<ApprovalRecommendationResponse>> {
    return apiService.get("base", `/approvals/${approvalRequestId}`);
  }

  getApprovalStatus(
    approvalRequestId: string,
  ): Promise<AxiosResponse<ApprovalStatusResponse>> {
    return apiService.get("base", `/approvals/${approvalRequestId}/status`);
  }
}

export const approvalService = new ApprovalService();
