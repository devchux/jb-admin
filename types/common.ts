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

export type RegisteredAppUser = {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  hasLoginPin: boolean;
  accountLocked: boolean;
  failedLoginAttempts: number;
  lockoutTimestamp: string | null;
  registeredAt: string;
  modifiedAt: string;
  modifiedBy: string;
  registrationAccountNumber: string;
  registrationAccountType: string;
  registrationDeviceId: string;
  registrationDeviceName: string;
  registrationDeviceType: string;
  registrationSourceAction: string;
  registrationSourceService: string;
  registrationSourceTimestamp: string;
  registrationRequestPayload: unknown;
  registrationResponsePayload: unknown;
};

export type DeviceRegistration = {
  auditLogId: string | number;
  userId: string;
  email: string;
  action: string;
  status: string;
  serviceName: string;
  method: string;
  endpoint: string;
  ipAddress: string;
  registeredAt: string;
  deviceId: string;
  deviceName: string;
  deviceType: string;
  osVersion: string;
  appVersion: string;
  phoneNumber: string;
  accountNumber: string;
  description: string;
  requestPayload: unknown;
  responsePayload: unknown;
};

export type AccountCreation = {
  auditLogId: string | number;
  userId: string;
  email: string;
  action: string;
  status: string;
  serviceName: string;
  method: string;
  endpoint: string;
  ipAddress: string;
  createdAt: string;
  accountNumber: string;
  accountType: string;
  accountCategory: string;
  accountTier: string;
  cif: string;
  branchCode: string;
  phoneNumber: string;
  registrationAccountNumber: string;
  deviceId: string;
  description: string;
  requestPayload: unknown;
  responsePayload: unknown;
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

export const MakerApprovalRecommendationAction = {
  RECOMMEND_APPROVAL: "RECOMMEND_APPROVAL",
  PENDING_MAKER_REVIEW: "PENDING_MAKER_REVIEW",
  RECOMMEND_REJECTION: "RECOMMEND_REJECTION",
} as const;

export const CheckerApprovalRecommendationAction = {
  PENDING_CHECKER_REVIEW: "PENDING_CHECKER_REVIEW",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
} as const;

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ApprovalType = "CIB_ADMIN_APPLICATION";

export type ApprovalWorkflowState =
  | "PENDING_MAKER_REVIEW"
  | (typeof CheckerApprovalRecommendationAction)[keyof typeof CheckerApprovalRecommendationAction];

export type Approval = {
  approvalRequestId: string;
  approvalType: ApprovalType;
  corporateName: string;
  approvalStatus: ApprovalStatus;
  workflowState: ApprovalWorkflowState;
  requestedAt: string;
  createdAt: string;
  updatedAt: string;
};

export const AppImageCategory = {
  WELCOME: "WELCOME",
  CAROUSEL: "CAROUSEL",
  BANNER: "BANNER",
  LOGO: "LOGO",
  CARD_ARTWORK: "CARD_ARTWORK",
  OTHER: "OTHER",
} as const;

export type AppImage = {
  id: string;
  category: (typeof AppImageCategory)[keyof typeof AppImageCategory];
  title: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  displayOrder: number;
  active: true;
  checksum: string;
  contentUrl: string;
  createdAt: string;
  lastModifiedAt: string;
  createdBy: string;
  lastModifiedBy: string;
};
