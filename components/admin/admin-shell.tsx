'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  Users,
  Database,
  Sliders,
  LogOut,
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  Home,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { signOutAction } from '@/app/actions/auth';

interface AdminShellProps {
  adminUser: {
    fullName: string;
    email: string;
    role: string;
    avatarUrl: string | null;
  };
  children: React.ReactNode;
}

export function AdminShell({ adminUser, children }: AdminShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  const navItems = [
    {
      title: 'Admin Overview',
      href: '/admin',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: 'User Management',
      href: '/admin/users',
      icon: Users,
      badge: 'Manage',
    },
    {
      title: 'System Audit Logs',
      href: '/admin/logs',
      icon: Database,
      badge: 'All Tenants',
    },
    {
      title: 'Security & Settings',
      href: '/admin/settings',
      icon: Sliders,
      badge: null,
    },
  ];

  React.useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const initials = adminUser.fullName
    ? adminUser.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'AD';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900/95 border-r border-purple-900/40 backdrop-blur-xl transition-all duration-300 ${
          collapsed ? 'md:w-20' : 'md:w-64'
        } ${
          sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-purple-900/30">
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/25 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            {(!collapsed || sidebarOpen) && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-sm text-white tracking-tight leading-tight">
                  Admin Portal
                </span>
                <span className="text-[10px] text-purple-400 font-semibold tracking-wide">
                  Superadmin Scope
                </span>
              </div>
            )}
          </Link>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Profile Strip */}
        <div className="p-3 border-b border-purple-900/20">
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-purple-950/20 border border-purple-900/40 ${
              collapsed && !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            {adminUser.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={adminUser.avatarUrl}
                alt={adminUser.fullName}
                className="w-8 h-8 rounded-full object-cover border border-purple-400/40 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xs font-bold text-purple-300 shrink-0">
                {initials}
              </div>
            )}
            {(!collapsed || sidebarOpen) && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-white truncate">
                  {adminUser.fullName}
                </span>
                <span className="text-[10px] text-purple-300 font-mono truncate">
                  {adminUser.email}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <div
            className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-purple-400/80 ${
              collapsed && !sidebarOpen ? 'text-center' : ''
            }`}
          >
            {collapsed && !sidebarOpen ? '•••' : 'Administration'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/10 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                } ${collapsed && !sidebarOpen ? 'justify-center' : ''}`}
                title={collapsed ? item.title : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                {(!collapsed || sidebarOpen) && (
                  <span className="truncate flex-1">{item.title}</span>
                )}
                {(!collapsed || sidebarOpen) && item.badge && (
                  <Badge variant="purple" className="px-1.5 py-0 text-[9px]">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-purple-900/30 space-y-2">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-950/20 border border-blue-900/20 transition-colors ${
              collapsed && !sidebarOpen ? 'justify-center' : ''
            }`}
            title="Switch to Customer Workspace"
          >
            <Building className="w-4 h-4 shrink-0 text-blue-400" />
            {(!collapsed || sidebarOpen) && <span>Customer View</span>}
          </Link>

          <form action={signOutAction} className="w-full">
            <button
              type="submit"
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/30 hover:text-red-300 border border-red-900/20 transition-colors cursor-pointer ${
                collapsed && !sidebarOpen ? 'justify-center' : ''
              }`}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {(!collapsed || sidebarOpen) && <span>Sign Out</span>}
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-purple-900/30 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400 hidden sm:block" />
              <span className="text-xs font-semibold text-slate-200">
                System Administration Control Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="purple" className="text-[11px] py-0.5">
              <Sparkles className="w-3 h-3 mr-1 text-purple-400" /> Administrator Mode
            </Badge>

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight">
                  {adminUser.fullName}
                </div>
                <div className="text-[10px] text-purple-400 font-semibold">Superadmin</div>
              </div>

              {adminUser.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={adminUser.avatarUrl}
                  alt={adminUser.fullName}
                  className="w-8 h-8 rounded-full object-cover border border-purple-500/50 shadow-sm"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {initials}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
