export type Role = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  lastModifiedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  permissions: string[];
};

export type User = {
  id: string;
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  active: boolean;
  createdAt: string;
  lastModifiedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  role: Role;
  permissions: string[];
};

export type AppUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  otherName: string;
  dateOfBirth: string;
  phoneNumber: string;
  userId: string;
  photo: string;
  dateTimeCreated: string;
  dateTimeModified: string;
  modifiedBy: string;
  hasLoginPin: boolean;
  failedLoginAttempts: number;
  accountLocked: boolean;
  lockoutTimestamp: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  messagePreview?: string;
  type: "BROADCAST" | "INDIVIDUAL";
  audience?: string;
  channel?: string;
  status?: string;
  targetUserId: string;
  sent: boolean;
  draft?: boolean;
  failed?: boolean;
  scheduledAt: string;
  createdAt: string;
  sentAt: string;
  createdBy: string;
  readByUsers: string[];
};

export type Permission = {
  id: string;
  name: string;
  description: string;
  active: boolean;
};

export type AuditLog = {
  id: number;
  userId: string;
  email: string;
  action: string;
  method: string;
  endpoint: string;
  ipAddress: string;
  serviceName: string;
  requestPayload: string;
  responsePayload: string;
  status: string;
  timestamp: string;
};

export type Transaction = {
  id: string;
  creditAccount: string;
  debitAccount: string;
  amount: number;
  fee: number;
  narration: string;
  sessionID: string;
  appId: string;
  channelCode: number;
  accountNumber?: string;
  activationDate?: string;
  beneficiaryAccount?: string;
  status?: string;
  transactionAmount?: number;
  transactionKey?: string;
  transactionStatus?: string;
  transactionTimeStamp?: string;
  data?: {
    id: string;
    accountNumber: string;
    transactionKey: string;
    transactionType: string;
    transactionAmount: number;
    transactionDesc: string;
    beneficiaryBank: string;
    accountBranch: string;
    transactionLocation: string;
    clientIp: string;
    deviceNumber: string;
    activationDate: string;
    phoneNumber: string;
    beneficiaryAccount: string;
    balanceEnquiry: string;
    transactionAmountLocal: number;
    debitCreditIndicator: string;
    accountAvailableBalance: string;
    p1: string;
    p2: string;
    p3: string;
    p4: string;
    p5: string;
    p6: string;
    p7: string;
    p8: string;
    p9: string;
    p10: string;
    loginName: string;
  };
};

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export type SupportTicket = {
  id: string;
  userId: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
  status: TicketStatus;
  response: string;
  assignedTo: string;
  createdAt: string;
  lastModifiedAt: string;
  resolvedAt: string;
};

export type GeneratedReport = {
  id: string;
  reportType: string;
  reportName: string;
  dateRange: string;
  startDate: string | null;
  endDate: string | null;
  serviceType: string;
  statusFilter: string;
  generatedBy: string;
  generatedAt: string;
  rows: number;
  format: string;
  status: string;
  fileName: string;
};

export type ReportPreviewRow = {
  reference: string;
  date: string;
  channel: string;
  type: string;
  amount: number;
  status: string;
  details: string;
};
