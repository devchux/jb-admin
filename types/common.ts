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

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: "BROADCAST" | "INDIVIDUAL";
  targetUserId: string;
  sent: boolean;
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
  data: {
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
