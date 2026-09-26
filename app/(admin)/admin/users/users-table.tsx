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
  Inbox,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AdminUserData } from '@/app/actions/admin';
import { formatDate } from '@/lib/utils/formatDate';

interface UsersTableProps {
  initialUsers: AdminUserData[];
}

const ITEMS_PER_PAGE = 8;

export function UsersTable({ initialUsers }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  const [currentPage, setCurrentPage] = React.useState(1);

  // Debounced/filtered users
  const filteredUsers = React.useMemo(() => {
    return initialUsers.filter((user) => {
      const matchesSearch =
        !searchTerm.trim() ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase().trim());

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [initialUsers, searchTerm, roleFilter]);

  // Reset pagination when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter users by role"
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
            >
              <option value="all">All Roles ({initialUsers.length})</option>
              <option value="customer">Customers Only</option>
              <option value="admin">Administrators Only</option>
            </select>
          </div>

          <Badge variant="purple" className="text-xs py-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-600 dark:text-purple-400" />
            {filteredUsers.length} Results
          </Badge>
        </div>
      </div>

      {/* Users Data Table Card */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md shadow-sm dark:shadow-xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Registered Tenant Profiles
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage all profiles, grant administrator privileges, or update tenant details.
              </CardDescription>
            </div>
            <Badge variant="purple" className="text-xs font-semibold">
              Superadmin Scope
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {paginatedUsers.length > 0 ? (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/75 dark:bg-slate-950/40 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="py-3.5 px-4 sm:px-6">User / Identity</th>
                      <th className="py-3.5 px-4">Role Tier</th>
                      <th className="py-3.5 px-4 hidden md:table-cell">Account Status</th>
                      <th className="py-3.5 px-4 hidden lg:table-cell">Created At</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
                    {paginatedUsers.map((user) => {
                      const initials = user.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);

                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group"
                        >
                          {/* Name & Avatar */}
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex items-center gap-3 min-w-0">
                              {user.avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={user.avatarUrl}
                                  alt={user.fullName}
                                  className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200 dark:border-slate-700">
                                  {initials}
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {user.fullName}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role Badge */}
                          <td className="py-4 px-4">
                            <Badge
                              variant={user.role === 'admin' ? 'purple' : 'info'}
                              className="text-xs capitalize gap-1 font-semibold"
                            >
                              {user.role === 'admin' ? (
                                <ShieldAlert className="w-3 h-3 text-purple-600 dark:text-purple-300" />
                              ) : (
                                <ShieldCheck className="w-3 h-3 text-blue-600 dark:text-blue-300" />
                              )}
                              {user.role}
                            </Badge>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 hidden md:table-cell">
                            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {user.status}
                            </div>
                          </td>

                          {/* Created Date */}
                          <td className="py-4 px-4 hidden lg:table-cell text-slate-500 dark:text-slate-400 text-[11px]">
                            {formatDate(user.createdAt)}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 sm:px-6 text-right">
                            <Link href={`/admin/users/${user.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400"
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of{' '}
                    {filteredUsers.length} users
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-8 px-2.5 text-xs"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
                    </Button>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 px-1">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="h-8 px-2.5 text-xs"
                    >
                      Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 px-4 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-400 mx-auto">
                <Inbox className="w-7 h-7 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No Users Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
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
