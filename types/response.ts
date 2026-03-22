import {
  AuditLog,
  Notification,
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

export type UserListResponse = PaginatedResponse<User>;

export type AuditLogListResponse = PaginatedResponse<AuditLog>;

export type TransactionListResponse = PaginatedResponse<Transaction>;

export type SupportTicketListResponse = PaginatedResponse<SupportTicket>;
