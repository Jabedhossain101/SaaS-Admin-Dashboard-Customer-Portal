'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  ShieldAlert,
  ShieldCheck,
  Image as ImageIcon,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  adminUserUpdateSchema,
  type AdminUserUpdateFormValues,
} from '@/lib/validations/admin';
import {
  updateUserByAdminAction,
  type AdminUserData,
} from '@/app/actions/admin';
import type { ActivityLog } from '@/types/database';
import { formatDate } from '@/lib/utils/formatDate';

interface UserEditFormProps {
  user: AdminUserData;
  userLogs: ActivityLog[];
}

export function UserEditForm({ user, userLogs }: UserEditFormProps) {
  const router = useRouter();
  const [serverSuccess, setServerSuccess] = React.useState<string | null>(null);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdminUserUpdateFormValues>({
    resolver: zodResolver(adminUserUpdateSchema),
    defaultValues: {
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl || '',
    },
  });

  const selectedRole = watch('role');
  const watchedAvatarUrl = watch('avatarUrl');

  const onSubmit = async (data: AdminUserUpdateFormValues) => {
    setServerError(null);
    setServerSuccess(null);
    setIsPending(true);

    try {
      const response = await updateUserByAdminAction(user.id, data);

      if (!response.success) {
        setServerError(response.error || 'Failed to update user record');
        setIsPending(false);
        return;
      }

      setServerSuccess(response.message || 'User privileges and profile updated!');
      setIsPending(false);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setServerError(message);
      setIsPending(false);
    }
  };

  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'US';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Edit Form */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md shadow-sm dark:shadow-xl">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Edit Profile &amp; Role Assignments
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Update database identity records and assign platform privileges.
                </CardDescription>
              </div>
              <Badge variant="purple" className="text-xs font-semibold">
                Superadmin Scope
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {serverError && (
              <div className="rounded-lg border border-red-500/30 bg-red-50 dark:bg-red-950/40 p-3 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>{serverError}</div>
              </div>
            )}

            {serverSuccess && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>{serverSuccess}</div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Display / Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    {...register('fullName')}
                    type="text"
                    placeholder="Jane Doe"
                    disabled={isPending}
                    className={`w-full bg-white dark:bg-slate-950/80 border rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 ${
                      errors.fullName
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] text-red-500 font-medium">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Role Selection Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Role &amp; Permission Scope
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Customer Option */}
                  <button
                    type="button"
                    onClick={() => setValue('role', 'customer')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedRole === 'customer'
                        ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-bold">Customer Tier</span>
                    </div>
                    <p className="text-[11px] mt-1 text-slate-500 dark:text-slate-400">
                      Standard tenant workspace with profile management and self-activity logs.
                    </p>
                  </button>

                  {/* Admin Option */}
                  <button
                    type="button"
                    onClick={() => setValue('role', 'admin')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedRole === 'admin'
                        ? 'border-purple-500 bg-purple-50/80 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs font-bold">Administrator Tier</span>
                    </div>
                    <p className="text-[11px] mt-1 text-slate-500 dark:text-slate-400">
                      Elevated platform permissions: user management, global analytics, and audit logs.
                    </p>
                  </button>
                </div>
              </div>

              {/* Avatar URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Avatar URL</label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    {...register('avatarUrl')}
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    disabled={isPending}
                    className={`w-full bg-white dark:bg-slate-950/80 border rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 ${
                      errors.avatarUrl
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                  />
                </div>
                {errors.avatarUrl && (
                  <p className="text-[11px] text-red-500 font-medium">
                    {errors.avatarUrl.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  size="md"
                  variant="primary"
                  disabled={isPending}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md font-semibold text-xs"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" /> Save User Details &amp; Role
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* User Metadata & Log Feed */}
      <div className="space-y-6">
        {/* Identity Summary Card */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-4">
            {watchedAvatarUrl || user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={watchedAvatarUrl || user.avatarUrl || ''}
                alt={user.fullName}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-purple-500/40 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-purple-500/20 text-indigo-600 dark:text-purple-300 flex items-center justify-center font-bold text-lg border border-indigo-200 dark:border-purple-500/30 shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.fullName}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate font-mono">{user.email}</div>
              <Badge
                variant={selectedRole === 'admin' ? 'purple' : 'info'}
                className="text-[10px] mt-1 capitalize font-semibold"
              >
                {selectedRole} Tier
              </Badge>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">User ID</span>
              <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px] truncate max-w-[140px]">
                {user.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Account Status</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{user.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Registered</span>
              <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                {formatDate(user.createdAt)}
              </span>
            </div>
          </div>
        </Card>

        {/* User Recent Logs */}
        <Card className="border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 backdrop-blur-md shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> User Activity History
            </span>
            <Badge variant="outline" className="text-[10px] font-semibold">
              {userLogs.length} Events
            </Badge>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-60 overflow-y-auto">
            {userLogs.map((log) => (
              <div key={log.id} className="py-2.5 space-y-0.5">
                <div className="text-xs text-slate-900 dark:text-white font-medium truncate">
                  {log.action}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex justify-between">
                  <span>{log.description || 'Logged event'}</span>
                  <span>{formatDate(log.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
