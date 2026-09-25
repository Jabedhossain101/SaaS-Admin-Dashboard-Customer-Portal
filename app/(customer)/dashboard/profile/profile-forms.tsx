'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Mail,
  Image as ImageIcon,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
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

interface ProfileFormsProps {
  initialProfile: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    avatarUrl: string | null;
  };
}

export function ProfileForms({ initialProfile }: ProfileFormsProps) {
  // Profile Update State
  const [profileSuccess, setProfileSuccess] = React.useState<string | null>(null);
  const [profileError, setProfileError] = React.useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = React.useState(false);

  // Password Update State
  const [passwordSuccess, setPasswordSuccess] = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  // Form: Profile details
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    watch: watchProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: initialProfile.fullName,
      avatarUrl: initialProfile.avatarUrl || '',
    },
  });

  const watchedAvatarUrl = watchProfile('avatarUrl');

  // Form: Password update
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
    setProfileError(null);
    setProfileSuccess(null);
    setIsUpdatingProfile(true);

    try {
      const response = await updateCustomerProfileAction(data);
      if (!response.success) {
        setProfileError(response.error || 'Failed to update profile');
        setIsUpdatingProfile(false);
        return;
      }

      setProfileSuccess(response.message || 'Profile saved successfully!');
      setIsUpdatingProfile(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      setProfileError(message);
      setIsUpdatingProfile(false);
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordFormValues) => {
    setPasswordError(null);
    setPasswordSuccess(null);
    setIsUpdatingPassword(true);

    try {
      const response = await changeCustomerPasswordAction(data);
      if (!response.success) {
        setPasswordError(response.error || 'Failed to change password');
        setIsUpdatingPassword(false);
        return;
      }

      setPasswordSuccess(response.message || 'Password updated successfully!');
      resetPasswordForm();
      setIsUpdatingPassword(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      setPasswordError(message);
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
      <Card className="border-slate-800 bg-slate-900/60 shadow-xl">
        <CardHeader className="border-b border-slate-800/80 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1">
                Update your display name and public avatar across your tenant workspace.
              </CardDescription>
            </div>
            <Badge variant="info">Profile Scope</Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {profileError && (
            <div className="rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>{profileError}</div>
            </div>
          )}

          {profileSuccess && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>{profileSuccess}</div>
            </div>
          )}

          {/* Avatar Live Preview & Upload URL */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="relative shrink-0">
              {watchedAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={watchedAvatarUrl}
                  alt="Avatar preview"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/40 shadow-md shadow-blue-500/10"
                  onError={(e) => {
                    // Fallback on broken image link
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-500/20">
                  {initials}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-white">Avatar Preview</div>
              <p className="text-[11px] text-slate-400">
                Enter an image URL below to update your profile photo thumbnail.
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    {...registerProfile('fullName')}
                    type="text"
                    placeholder="Your Full Name"
                    disabled={isUpdatingProfile}
                    className={`w-full bg-slate-950/80 border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                      profileErrors.fullName
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {profileErrors.fullName && (
                  <p className="text-[11px] text-red-400 font-medium">
                    {profileErrors.fullName.message}
                  </p>
                )}
              </div>

              {/* Avatar URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Avatar Image URL</label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    {...registerProfile('avatarUrl')}
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    disabled={isUpdatingProfile}
                    className={`w-full bg-slate-950/80 border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                      profileErrors.avatarUrl
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {profileErrors.avatarUrl && (
                  <p className="text-[11px] text-red-400 font-medium">
                    {profileErrors.avatarUrl.message}
                  </p>
                )}
              </div>
            </div>

            {/* Read-Only Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Email Address (Managed via Auth)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={initialProfile.email}
                    disabled
                    className="w-full bg-slate-950/40 border border-slate-800/60 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Assigned RBAC Role</label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={initialProfile.role}
                    disabled
                    className="w-full bg-slate-950/40 border border-slate-800/60 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-400 capitalize cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="md" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving Changes...
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
      <Card className="border-slate-800 bg-slate-900/60 shadow-xl" id="password">
        <CardHeader className="border-b border-slate-800/80 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-400" />
                Change Password &amp; Security
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-1">
                Ensure your account uses a secure password of at least 6 characters.
              </CardDescription>
            </div>
            <Badge variant="purple">Authentication</Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {passwordError && (
            <div className="rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300 flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>{passwordError}</div>
            </div>
          )}

          {passwordSuccess && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>{passwordSuccess}</div>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    {...registerPassword('newPassword')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    disabled={isUpdatingPassword}
                    className={`w-full bg-slate-950/80 border rounded-lg pl-9 pr-10 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                      passwordErrors.newPassword
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-[11px] text-red-400 font-medium">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    {...registerPassword('confirmNewPassword')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    disabled={isUpdatingPassword}
                    className={`w-full bg-slate-950/80 border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 ${
                      passwordErrors.confirmNewPassword
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {passwordErrors.confirmNewPassword && (
                  <p className="text-[11px] text-red-400 font-medium">
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
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating Password...
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
