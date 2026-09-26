'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Mail,
  Phone,
  Globe,
  Image as ImageIcon,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Save,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  profileUpdateSchema,
  changePasswordSchema,
  type ProfileUpdateFormValues,
  type ChangePasswordFormValues,
} from '@/lib/validations/profile';
import {
  updateCustomerProfileAction,
  changeCustomerPasswordAction,
} from '@/app/actions/customer';
import { useToast } from '@/components/ui/toast';

interface ProfileFormProps {
  initialProfile: {
    id: string;
    email: string;
    fullName: string;
    phone: string | null;
    timezone: string;
    role: string;
    status: string;
    plan: string;
    avatarUrl: string | null;
  };
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const { toast } = useToast();
  const [isUpdatingProfile, setIsUpdatingProfile] = React.useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    watch: watchProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: initialProfile.fullName,
      phone: initialProfile.phone || '',
      timezone: initialProfile.timezone || 'UTC',
      avatarUrl: initialProfile.avatarUrl || '',
    },
  });

  const watchedAvatarUrl = watchProfile('avatarUrl');

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onProfileSubmit = async (data: ProfileUpdateFormValues) => {
    setIsUpdatingProfile(true);
    try {
      const response = await updateCustomerProfileAction(data);
      if (!response.success) {
        toast.error('Update failed', response.error);
        setIsUpdatingProfile(false);
        return;
      }
      toast.success('Profile saved!', response.message);
      setIsUpdatingProfile(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      toast.error('Error', message);
      setIsUpdatingProfile(false);
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordFormValues) => {
    setIsUpdatingPassword(true);
    try {
      const response = await changeCustomerPasswordAction(data);
      if (!response.success) {
        toast.error('Password change failed', response.error);
        setIsUpdatingPassword(false);
        return;
      }
      toast.success('Password updated!', response.message);
      resetPasswordForm();
      setIsUpdatingPassword(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update password';
      toast.error('Error', message);
      setIsUpdatingPassword(false);
    }
  };

  const initials = initialProfile.fullName
    ? initialProfile.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'CU';

  return (
    <div className="space-y-8">
      {/* 1. Profile Details Card */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xl">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Update your display name, phone contact, timezone, and public avatar.
              </CardDescription>
            </div>
            <Badge variant="info">Profile Scope</Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Avatar Preview */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div className="relative shrink-0">
              {watchedAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={watchedAvatarUrl}
                  alt="Avatar preview"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/40 shadow-md"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-md">
                  {initials}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white">Profile Photo</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Enter an image URL below to update your public avatar.
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    {...registerProfile('fullName')}
                    type="text"
                    placeholder="Your Full Name"
                    disabled={isUpdatingProfile}
                    className={`w-full bg-slate-50 dark:bg-slate-950/80 border rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      profileErrors.fullName
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                  />
                </div>
                {profileErrors.fullName && (
                  <p className="text-[11px] text-red-500 font-medium">
                    {profileErrors.fullName.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    {...registerProfile('phone')}
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    disabled={isUpdatingProfile}
                    className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Timezone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Timezone
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <select
                    {...registerProfile('timezone')}
                    disabled={isUpdatingProfile}
                    className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
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

              {/* Avatar URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Avatar Image URL
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    {...registerProfile('avatarUrl')}
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    disabled={isUpdatingProfile}
                    className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Read-Only Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={initialProfile.email}
                    disabled
                    className="w-full bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Assigned Role</label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={initialProfile.role}
                    disabled
                    className="w-full bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-500 capitalize cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="md" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Save Profile Details
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 2. Change Password Card */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xl" id="password">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-500" />
                Change Password &amp; Security
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Ensure your account uses a secure password of at least 6 characters.
              </CardDescription>
            </div>
            <Badge variant="purple">Auth Security</Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    {...registerPassword('newPassword')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    disabled={isUpdatingPassword}
                    className={`w-full bg-slate-50 dark:bg-slate-950/80 border rounded-xl pl-10 pr-10 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      passwordErrors.newPassword
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-[11px] text-red-500 font-medium">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    {...registerPassword('confirmNewPassword')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    disabled={isUpdatingPassword}
                    className={`w-full bg-slate-50 dark:bg-slate-950/80 border rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 ${
                      passwordErrors.confirmNewPassword
                        ? 'border-red-500 focus:ring-red-500/20'
                        : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                  />
                </div>
                {passwordErrors.confirmNewPassword && (
                  <p className="text-[11px] text-red-500 font-medium">
                    {passwordErrors.confirmNewPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="secondary"
                size="md"
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" /> Update Password
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
