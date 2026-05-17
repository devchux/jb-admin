import { AxiosResponse } from "axios";
import { apiService } from "./api";
import { PaginatedRequest, ReportRequest } from "@/types/request";
import {
  GeneratedReportListResponse,
  ReportPreviewResponse,
} from "@/types/response";
import { GeneratedReport } from "@/types/common";

class ReportService {
  preview(
    request: ReportRequest,
  ): Promise<AxiosResponse<ReportPreviewResponse>> {
    return apiService.post("base", "/admin/reports/preview", request);
  }

  generate(
    request: ReportRequest,
    generatedBy?: string,
  ): Promise<AxiosResponse<GeneratedReport>> {
    return apiService.post("base", "/admin/reports/generate", request, {}, {
      headers: generatedBy ? { "Generated-By": generatedBy } : {},
    });
  }

  getGeneratedReports(
    request: PaginatedRequest,
  ): Promise<AxiosResponse<GeneratedReportListResponse>> {
    return apiService.get("base", "/admin/reports/generated", request);
  }

  download(id: string) {
    return apiService.getBlob("base", `/admin/reports/${id}/download`);
  }
}

export const reportService = new ReportService();
