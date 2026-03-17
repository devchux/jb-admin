import {
  CreateBroadcastNotificationRequest,
  PaginatedRequest,
} from "@/types/request";
import { apiService } from "./api";
import { NotificationListResponse } from "@/types/response";
import { AxiosResponse } from "axios";

class NotificationService {
  getAllNotifications(
    request: PaginatedRequest,
  ): Promise<AxiosResponse<NotificationListResponse>> {
    return apiService.get("base", "/admin/notifications", request);
  }

  getUserNotifications(
    userId: string,
    request: PaginatedRequest,
  ): Promise<AxiosResponse<NotificationListResponse>> {
    return apiService.get(
      "base",
      `/admin/notifications/user/${userId}`,
      request,
    );
  }

  createBroadcast(
    request: CreateBroadcastNotificationRequest,
  ): Promise<AxiosResponse<Notification>> {
    return apiService.post("base", "/admin/notifications/broadcast", request);
  }
}

export const notificationService = new NotificationService();
