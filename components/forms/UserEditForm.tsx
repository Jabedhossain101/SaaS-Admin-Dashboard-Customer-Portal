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
  Phone,
  Globe,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { userAdminUpdateSchema, type UserAdminUpdateFormValues } from '@/lib/validations/user';
import { updateUserByAdminAction, type AdminUserData } from '@/app/actions/admin';
import { useToast } from '@/components/ui/toast';
import type { ActivityLog } from '@/types/database';

interface UserEditFormProps {
  user: AdminUserData;
  userLogs?: ActivityLog[];
}

export function UserEditForm({ user, userLogs = [] }: UserEditFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserAdminUpdateFormValues>({
    resolver: zodResolver(userAdminUpdateSchema),
    defaultValues: {
      fullName: user.fullName,
      phone: user.phone || '',
      timezone: user.timezone || 'UTC',
      role: user.role,
      status: user.status,
      plan: (user.plan as 'free' | 'pro' | 'enterprise') || 'free',
      avatarUrl: user.avatarUrl || '',
    },
  });

  const selectedRole = watch('role');
  const selectedStatus = watch('status');
  const watchedAvatarUrl = watch('avatarUrl');

  const onSubmit = async (data: UserAdminUpdateFormValues) => {
    setIsPending(true);
    try {
      const response = await updateUserByAdminAction(user.id, data);
      if (!response.success) {
        toast.error('Update failed', response.error);
        setIsPending(false);
        return;
      }
      toast.success('User updated!', response.message);
      setIsPending(false);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      toast.error('Error', msg);
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
    : 'U';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form Container */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-purple-200 dark:border-purple-900/30 bg-white dark:bg-slate-900/60 shadow-xl">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-500" />
                  Edit Tenant Profile &amp; Role
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Elevate permissions, modify status, or change subscription tier.
                </CardDescription>
              </div>
              <Badge variant="purple">Superadmin Scope</Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Display Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      {...register('fullName')}
                      type="text"
                      disabled={isPending}
                      className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-[11px] text-red-500 font-medium">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      {...register('phone')}
                      type="tel"
                      disabled={isPending}
                      className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Role Privilege Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setValue('role', 'customer')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedRole === 'customer'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-slate-900 dark:text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Building className="w-4 h-4 text-blue-500" /> Customer Tier
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Scoped strictly to tenant workspace.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setValue('role', 'admin')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedRole === 'admin'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-slate-900 dark:text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <ShieldAlert className="w-4 h-4 text-purple-500" /> Administrator Tier
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Universal read, write, and audit privileges.
                    </p>
                  </button>
                </div>
              </div>

              {/* Status & Plan Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Account Status
                  </label>
                  <select
                    {...register('status')}
                    disabled={isPending}
                    className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
                  >
                    <option value="active">Active (Full access)</option>
                    <option value="pending">Pending (Awaiting verification)</option>
                    <option value="suspended">Suspended (Access blocked)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Subscription Plan
                  </label>
                  <select
                    {...register('plan')}
                    disabled={isPending}
                    className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
                  >
                    <option value="free">Free Tier</option>
                    <option value="pro">Pro Tier</option>
                    <option value="enterprise">Enterprise Tier</option>
                  </select>
                </div>
              </div>

              {/* Avatar URL & Timezone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Avatar Image URL
                  </label>
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      {...register('avatarUrl')}
                      type="url"
                      placeholder="https://..."
                      disabled={isPending}
                      className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Timezone
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <select
                      {...register('timezone')}
                      disabled={isPending}
                      className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
                    >
                      <option value="UTC">UTC (Universal)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="America/Chicago">America/Chicago (CST)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  size="md"
                  variant="purple"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" /> Save User &amp; Role Settings
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* User Metadata & Activity Preview */}
      <div className="space-y-6">
        <Card className="border-purple-200 dark:border-purple-900/30 bg-white dark:bg-slate-900/50 p-6 space-y-4">
          <div className="flex items-center gap-4">
            {watchedAvatarUrl || user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={watchedAvatarUrl || user.avatarUrl || ''}
                alt="Avatar"
                className="w-14 h-14 rounded-2xl object-cover border border-purple-400 shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-lg border border-purple-500/20">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {user.fullName}
              </div>
              <div className="text-xs text-slate-400 truncate font-mono">{user.email}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge variant={selectedRole === 'admin' ? 'purple' : 'info'} className="text-[10px] capitalize">
                  {selectedRole}
                </Badge>
                <Badge
                  variant={selectedStatus === 'active' ? 'success' : selectedStatus === 'pending' ? 'warning' : 'destructive'}
                  className="text-[10px] capitalize"
                >
                  {selectedStatus}
                </Badge>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">User ID</span>
              <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                {user.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Subscription Plan</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                {user.plan}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Registered</span>
              <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </Card>

        {/* User Activity Stream */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" /> Recent User Events
            </span>
            <Badge variant="outline" className="text-[10px]">
              {userLogs.length} Events
            </Badge>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-60 overflow-y-auto">
            {userLogs.map((log) => (
              <div key={log.id} className="py-2.5 space-y-0.5">
                <div className="text-xs text-slate-800 dark:text-white font-medium truncate">
                  {log.action}
                </div>
                <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                  <span>{log.description || 'System event'}</span>
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
