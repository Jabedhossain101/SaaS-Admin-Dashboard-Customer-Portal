import { Profile, ActivityLog, UserRole, Database } from './database';

export * from './database';

export interface AppUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: string;
  roleRequired?: UserRole[];
}

export interface SystemStatus {
  supabaseConfigured: boolean;
  dbConnection: 'connected' | 'mock_mode';
  environment: 'development' | 'production' | 'test';
  timestamp: string;
}
