'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Activity,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Building,
  Home,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { signOutAction } from '@/app/actions/auth';

interface CustomerShellProps {
  user: {
    fullName: string;
    email: string;
    role: string;
    avatarUrl: string | null;
  };
  children: React.ReactNode;
}

export function CustomerShell({ user, children }: CustomerShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  const navItems = [
    {
      title: 'Dashboard Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: 'Profile & Security',
      href: '/dashboard/profile',
      icon: User,
      badge: null,
    },
    {
      title: 'Activity History',
      href: '/dashboard/activity',
      icon: Activity,
      badge: 'Live',
    },
  ];

  // Close mobile drawer on route change
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'CU';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900/95 border-r border-slate-800/80 backdrop-blur-xl transition-all duration-300 ${
          collapsed ? 'md:w-20' : 'md:w-64'
        } ${
          sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            {(!collapsed || sidebarOpen) && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-sm text-white tracking-tight leading-tight">
                  SaaS Portal
                </span>
                <span className="text-[10px] text-blue-400 font-medium">Customer Area</span>
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

        {/* User Mini Profile in Sidebar */}
        <div className="p-3 border-b border-slate-800/60">
          <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 ${collapsed && !sidebarOpen ? 'justify-center' : ''}`}>
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-8 h-8 rounded-full object-cover border border-blue-500/30 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">
                {initials}
              </div>
            )}
            {(!collapsed || sidebarOpen) && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-white truncate">{user.fullName}</span>
                <span className="text-[10px] text-slate-400 truncate">{user.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <div className={`px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 ${collapsed && !sidebarOpen ? 'text-center' : ''}`}>
            {collapsed && !sidebarOpen ? '•••' : 'Main Menu'}
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                } ${collapsed && !sidebarOpen ? 'justify-center' : ''}`}
                title={collapsed ? item.title : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                {(!collapsed || sidebarOpen) && (
                  <span className="truncate flex-1">{item.title}</span>
                )}
                {(!collapsed || sidebarOpen) && item.badge && (
                  <Badge variant="success" className="px-1.5 py-0 text-[9px]">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors ${
              collapsed && !sidebarOpen ? 'justify-center' : ''
            }`}
            title="Public Homepage"
          >
            <Home className="w-4 h-4 shrink-0" />
            {(!collapsed || sidebarOpen) && <span>Public Overview</span>}
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
        <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-400 hidden sm:block" />
              <span className="text-xs font-semibold text-slate-300">
                Customer Workspace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="info" className="hidden sm:inline-flex text-[11px] py-0.5">
              <Sparkles className="w-3 h-3 mr-1 text-blue-400" /> RLS Isolated
            </Badge>

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight">
                  {user.fullName}
                </div>
                <div className="text-[10px] text-blue-400 capitalize">{user.role}</div>
              </div>

              <Link href="/dashboard/profile">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-blue-500/40 hover:ring-2 hover:ring-blue-500/40 transition-all cursor-pointer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm cursor-pointer">
                    {initials}
                  </div>
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
