export type LoginRequest = {
  username: string;
  password: string;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type ForgotPasswordRequest = {
  username: string;
};

export type ResetPasswordRequest = {
  userId: string;
  password: string;
  otp: string;
};

export type PaginatedRequest = {
  page: number;
  size: number;
  sortBy?: string;
  search?: string;
};

export type TransactionListRequest = PaginatedRequest & {
  dateFilter?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
};

export type TransactionMetricsRequest = {
  dateFilter?: string;
  startDate?: string;
  endDate?: string;
  service?: string;
  status?: string;
};

export type BillPaymentMetricsRequest = {
  dateFilter?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  status?: string;
};

export type OperationsSummaryRequest = {
  dateFilter?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
};

export type TransactionStatusDistributionRequest = {
  dateFilter?: string;
  startDate?: string;
  endDate?: string;
  service?: string;
};

export type AdminAccessMetricsRequest = {
  noRecentLoginCutoff?: string;
};

export type ReportRequest = {
  reportType: string;
  dateRange: string;
  startDate?: string | null;
  endDate?: string | null;
  serviceType: string;
  statusFilter: string;
  format: string;
};

export type CreateBroadcastNotificationRequest = {
  title: string;
  message: string;
  scheduledAt: string;
  createdBy: string;
  type: "BROADCAST" | "INDIVIDUAL";
  targetGroups: string[];
  targetUsers: string[];
  targetUserId: string;
  draft: boolean;
  channel?: "IN_APP" | "PUSH_NOTIFICATION" | "SMS";
};

export type CreateUserRequest = {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  roleId: string;
  permissionNames: string[];
};

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export type CreateRoleRequest = {
  name: string;
  description: string;
  permissionNames: string[];
};

export type SupportTicketRequest = PaginatedRequest & {
  status?: string;
}
