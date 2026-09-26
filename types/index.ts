import { Profile, ActivityLog, UserRole, UserStatus, UserPlan, Database } from './database';

export * from './database';

export interface AppUser {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  timezone: string;
  role: UserRole;
  status: UserStatus;
  plan: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  meta?: PaginationMeta;
  error?: {
    message: string;
    code: string;
    details?: unknown;
  };
}

export interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  totalCustomers: number;
  totalAdmins: number;
  totalLogs: number;
  growthRate: number;
  signupTrends: {
    date: string;
    customers: number;
    admins: number;
    total: number;
  }[];
  planDistribution: {
    plan: string;
    count: number;
  }[];
  statusDistribution: {
    status: string;
    count: number;
  }[];
}
