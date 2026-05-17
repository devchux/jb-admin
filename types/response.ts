import {
  AppUser,
  AuditLog,
  GeneratedReport,
  Notification,
  ReportPreviewRow,
  SupportTicket,
  Transaction,
  User,
} from "./common";

export type PaginatedResponse<T> = {
  totalElements: number;
  totalPages: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    offset: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    unpaged: boolean;
  };
  size: number;
  content: T[];
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
};

export type LoginResponse = {
  status: string;
  message: string;
  data: {
    user: User;
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    "not-before-policy": number;
    session_state: string;
    scope: string;
  };
};

export type NotificationListResponse = PaginatedResponse<Notification>;

export type GeneratedReportListResponse = PaginatedResponse<GeneratedReport>;

export type UserListResponse = PaginatedResponse<User>;

export type AppUserListResponse = PaginatedResponse<AppUser>;

export type AuditLogListResponse = PaginatedResponse<AuditLog>;

export type TransactionListResponse = PaginatedResponse<Transaction>;

export type SupportTicketListResponse = PaginatedResponse<SupportTicket>;

export type DashboardSummaryResponse = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalTransactions: number;
  totalTransactionAmount: number;
  totalInflows: number;
  totalOutflows: number;
};

export type ChartResponse = {
  labels: string[];
  inflows: number[];
  outflows: number[];
};

export type AppUserMetricsResponse = {
  totalRegisteredUsers: number;
  newEnrollmentsToday: number;
  activeUsersToday: number;
  failedEnrollmentAttempts: number;
  failedLoginAttempts: number;
  lockedProfiles: number;
};

export type TransactionMetricsResponse = {
  totalTransactions: number;
  totalTransactionValue: number;
  successRate: number;
  failedTransactions: number;
  pendingTransactions: number;
  reversedTransactions?: number;
};

export type AdminAccessMetricsResponse = {
  totalAdminUsers: number;
  activeAdminUsers: number;
  activePercentage: number;
  inactiveAdminUsers: number;
  lockedAccounts: number;
  pendingFirstLogin: number;
  passwordResetRequired: number;
  noRecentLogin: number;
};

export type BroadcastMetricsResponse = {
  totalBroadcasts: number;
  scheduled: number;
  sent: number;
  draft: number;
  failed: number;
};

export type ReportPreviewResponse = {
  reportType: string;
  reportName: string;
  dateRange: string;
  serviceType: string;
  statusFilter: string;
  totalRows: number;
  sampleSize: number;
  rows: ReportPreviewRow[];
};
