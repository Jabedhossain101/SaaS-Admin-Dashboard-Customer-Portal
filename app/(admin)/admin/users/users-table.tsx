'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Users,
  ShieldCheck,
  ShieldAlert,
  Edit,
  UserCheck,
  Inbox,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AdminUserData } from '@/app/actions/admin';

interface UsersTableProps {
  initialUsers: AdminUserData[];
}

export function UsersTable({ initialUsers }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');

  const filteredUsers = React.useMemo(() => {
    return initialUsers.filter((user) => {
      const matchesSearch =
        !searchTerm.trim() ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase().trim());

      const matchesRole =
        roleFilter === 'all' || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [initialUsers, searchTerm, roleFilter]);

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter users by role"
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="all">All Roles ({initialUsers.length})</option>
              <option value="customer">Customers Only</option>
              <option value="admin">Administrators Only</option>
            </select>
          </div>

          <Badge variant="purple" className="text-xs py-1">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-400" />
            {filteredUsers.length} Results
          </Badge>
        </div>
      </div>

      {/* Users Data Table */}
      <Card className="border-purple-900/30 bg-slate-900/60 shadow-xl overflow-hidden">
        <CardHeader className="border-b border-slate-800/80 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Registered Tenant Profiles
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1">
                Manage all profiles, grant administrator privileges, or update tenant details.
              </CardDescription>
            </div>
            <Badge variant="purple">Superadmin Scope</Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-950/40 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">User / Identity</th>
                    <th className="py-3.5 px-4">Role Tier</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Account Status</th>
                    <th className="py-3.5 px-4 hidden lg:table-cell">Created At</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                  {filteredUsers.map((user) => {
                    const initials = user.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    const createdDate = new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-800/30 transition-colors group"
                      >
                        {/* Name & Avatar */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3 min-w-0">
                            {user.avatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={user.avatarUrl}
                                alt={user.fullName}
                                className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                                {initials}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                                {user.fullName}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="py-4 px-4">
                          <Badge
                            variant={user.role === 'admin' ? 'purple' : 'info'}
                            className="text-xs capitalize gap-1"
                          >
                            {user.role === 'admin' ? (
                              <ShieldAlert className="w-3 h-3 text-purple-300" />
                            ) : (
                              <ShieldCheck className="w-3 h-3 text-blue-300" />
                            )}
                            {user.role}
                          </Badge>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 hidden md:table-cell">
                          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {user.status}
                          </div>
                        </td>

                        {/* Created Date */}
                        <td className="py-4 px-4 hidden lg:table-cell text-slate-400 font-mono text-[11px]">
                          {createdDate}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <Link href={`/admin/users/${user.id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs hover:border-purple-500/50 hover:text-purple-300"
                            >
                              <Edit className="w-3.5 h-3.5 mr-1" /> Edit Profile &amp; Role
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 px-4 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400 mx-auto">
                <Inbox className="w-7 h-7 text-slate-500" />
              </div>
              <h3 className="text-base font-bold text-white">No Users Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchTerm
                  ? `No user records match "${searchTerm}". Check the query or adjust the role filter.`
                  : 'No users registered yet.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
