'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, LogOut, ShieldCheck, ShieldAlert, User as UserIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { signOutAction } from '@/app/actions/auth';
import type { AppUser } from '@/types';

interface NavbarProps {
  user: {
    fullName: string | null;
    email: string;
    role: string;
    avatarUrl: string | null;
  };
  onOpenMobileMenu: () => void;
  title?: string;
  scopeBadge?: string;
}

export function Navbar({ user, onOpenMobileMenu, title, scopeBadge }: NavbarProps) {
  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const isSuperadmin = user.role === 'admin';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/90 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {isSuperadmin ? (
            <ShieldAlert className="w-4 h-4 text-purple-500 hidden sm:block" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-blue-500 hidden sm:block" />
          )}
          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
            {title || (isSuperadmin ? 'Admin Control Center' : 'Customer Workspace')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {scopeBadge && (
          <Badge
            variant={isSuperadmin ? 'purple' : 'info'}
            className="hidden sm:inline-flex"
          >
            {scopeBadge}
          </Badge>
        )}

        <ThemeToggle />

        {/* User Identity & Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-800">
          <div className="text-right hidden md:block">
            <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              {user.fullName || 'Authenticated User'}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
              {user.role} tier
            </div>
          </div>

          <Link href={isSuperadmin ? '/admin' : '/dashboard/profile'}>
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.fullName || 'User avatar'}
                className={`w-9 h-9 rounded-full object-cover border-2 transition-transform hover:scale-105 ${
                  isSuperadmin
                    ? 'border-purple-500/50 shadow-sm shadow-purple-500/20'
                    : 'border-blue-500/50 shadow-sm shadow-blue-500/20'
                }`}
              />
            ) : (
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm transition-transform hover:scale-105 ${
                  isSuperadmin
                    ? 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                    : 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                }`}
              >
                {initials}
              </div>
            )}
          </Link>

          <form action={signOutAction} className="ml-1">
            <button
              type="submit"
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
