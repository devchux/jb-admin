export type LoginRequest = {
  username: string;
  password: string;
};

export type PaginatedRequest = {
  page: number;
  size: number;
  sortBy?: string;
  search?: string;
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
};

export type CreateUserRequest = {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  roleId: string;
  permissionNames: string[];
};

export type CreateRoleRequest = {
  name: string;
  description: string;
  permissionNames: string[];
};
