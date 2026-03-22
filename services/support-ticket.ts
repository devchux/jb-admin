import { PaginatedRequest } from "@/types/request";
import { apiService } from "./api";
import { AxiosResponse } from "axios";
import { SupportTicketListResponse } from "@/types/response";

class SupportTicketService {
  getTickets(
    params: PaginatedRequest,
  ): Promise<AxiosResponse<SupportTicketListResponse>> {
    return apiService.get("base", "/admin/support-tickets", params);
  }
}

export const supportTicketService = new SupportTicketService();
