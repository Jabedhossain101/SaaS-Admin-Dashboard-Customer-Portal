'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  ShieldAlert,
  ShieldCheck,
  Building,
  Image as ImageIcon,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileCheck,
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
        <Card className="border-purple-900/30 bg-slate-900/60 shadow-xl">
          <CardHeader className="border-b border-slate-800/80 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-400" />
                  Modify Tenant Profile &amp; Role
                </CardTitle>
                <CardDescription className="text-xs text-slate-400 mt-1">
                  Elevate to administrator or configure profile parameters.
                </CardDescription>
              </div>
              <Badge variant="purple">Elevated Scope</Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {serverError && (
              <div className="rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300 flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>{serverError}</div>
              </div>
            )}

            {serverSuccess && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>{serverSuccess}</div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Display Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    {...register('fullName')}
                    type="text"
                    placeholder="Full Name"
                    disabled={isPending}
                    className={`w-full bg-slate-950/80 border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                      errors.fullName
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-800 focus:border-purple-500 focus:ring-purple-500'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] text-red-400 font-medium">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Role Selection Selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">
                  Assigned RBAC Security Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setValue('role', 'customer')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedRole === 'customer'
                        ? 'border-blue-500 bg-blue-950/30 text-white shadow-lg shadow-blue-500/10'
                        : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-sm text-white">
                      <Building className="w-4 h-4 text-blue-400" /> Customer Role
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Scoped strictly to own tenant dashboard and logs via RLS policies.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setValue('role', 'admin')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedRole === 'admin'
                        ? 'border-purple-500 bg-purple-950/40 text-white shadow-lg shadow-purple-500/20'
                        : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-sm text-white">
                      <ShieldAlert className="w-4 h-4 text-purple-400" /> Administrator Role
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Grants full unrestricted oversight, user management, and universal audit access.
                    </p>
                  </button>
                </div>
                {errors.role && (
                  <p className="text-[11px] text-red-400 font-medium">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Avatar URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Avatar URL</label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    {...register('avatarUrl')}
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    disabled={isPending}
                    className={`w-full bg-slate-950/80 border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                      errors.avatarUrl
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-800 focus:border-purple-500 focus:ring-purple-500'
                    }`}
                  />
                </div>
                {errors.avatarUrl && (
                  <p className="text-[11px] text-red-400 font-medium">
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
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
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
        <Card className="border-purple-900/30 bg-slate-900/50 p-6 space-y-4">
          <div className="flex items-center gap-4">
            {watchedAvatarUrl || user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={watchedAvatarUrl || user.avatarUrl || ''}
                alt={user.fullName}
                className="w-14 h-14 rounded-2xl object-cover border border-purple-500/40 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-lg border border-purple-500/30 shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-bold text-white truncate">{user.fullName}</div>
              <div className="text-xs text-slate-400 truncate font-mono">{user.email}</div>
              <Badge
                variant={selectedRole === 'admin' ? 'purple' : 'info'}
                className="text-[10px] mt-1 capitalize"
              >
                {selectedRole} Tier
              </Badge>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">User ID</span>
              <span className="text-slate-300 font-mono text-[11px] truncate max-w-[140px]">
                {user.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Account Status</span>
              <span className="text-emerald-400 font-medium">{user.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Registered</span>
              <span className="text-slate-300 font-mono text-[11px]">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </Card>

        {/* User Recent Logs */}
        <Card className="border-slate-800/80 bg-slate-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> User Activity History
            </span>
            <Badge variant="outline" className="text-[10px]">
              {userLogs.length} Events
            </Badge>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-60 overflow-y-auto">
            {userLogs.map((log) => (
              <div key={log.id} className="py-2.5 space-y-0.5">
                <div className="text-xs text-white font-medium truncate">
                  {log.action}
                </div>
                <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                  <span>IP: {log.ip_address || '127.0.0.1'}</span>
                  <span>
                    {new Date(log.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
