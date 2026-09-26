'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  CreditCard,
  Activity,
  Home,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { signOutAction } from '@/app/actions/auth';

interface CustomerSidebarProps {
  user: {
    fullName: string | null;
    email: string;
    role: string;
    avatarUrl: string | null;
  };
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function CustomerSidebar({
  user,
  collapsed,
  onToggleCollapse,
}: CustomerSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      title: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: 'Profile Settings',
      href: '/dashboard/profile',
      icon: User,
      badge: null,
    },
    {
      title: 'Account & Plan',
      href: '/dashboard/account',
      icon: CreditCard,
      badge: null,
    },
    {
      title: 'Activity History',
      href: '/dashboard/activity',
      icon: Activity,
      badge: 'Live',
    },
  ];

  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'CU';

  return (
    <aside
      className={`hidden lg:flex fixed top-0 bottom-0 left-0 z-40 flex-col bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800/80 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight leading-tight">
                SaaS Portal
              </span>
              <span className="text-[10px] text-blue-500 dark:text-blue-400 font-semibold">
                Customer Space
              </span>
            </div>
          )}
        </Link>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Mini Profile Strip */}
      <div className="p-3 border-b border-slate-200/80 dark:border-slate-800/60">
        <div
          className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.fullName || 'User'}
              className="w-8 h-8 rounded-full object-cover border border-blue-500/40 shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center text-xs font-bold shrink-0">
              {initials}
            </div>
          )}
          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user.fullName || 'Customer'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">
                {user.email}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div
          className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 ${
            collapsed ? 'text-center' : ''
          }`}
        >
          {collapsed ? '•••' : 'Tenant Menu'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.title : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                }`}
              />
              {!collapsed && <span className="truncate flex-1">{item.title}</span>}
              {!collapsed && item.badge && (
                <Badge variant="success" className="px-1.5 py-0 text-[9px]">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Links */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1.5">
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Public Homepage"
        >
          <Home className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Public Overview</span>}
        </Link>

        <form action={signOutAction} className="w-full">
          <button
            type="submit"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
