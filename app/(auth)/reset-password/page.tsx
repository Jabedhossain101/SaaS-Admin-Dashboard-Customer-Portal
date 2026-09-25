'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/lib/validations/auth';
import { resetPasswordAction } from '@/app/actions/auth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setServerError(null);
    setServerSuccess(null);
    setIsPending(true);

    try {
      const response = await resetPasswordAction(values);

      if (!response.success) {
        setServerError(response.error || 'Failed to update password.');
        setIsPending(false);
        return;
      }

      setServerSuccess(response.message || 'Password successfully updated! Redirecting...');
      setTimeout(() => {
        router.push(response.redirectUrl || '/login');
      }, 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setServerError(message);
      setIsPending(false);
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-2 text-center pb-4">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-1">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-bold text-white tracking-tight">
          Set New Password
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs sm:text-sm">
          Please enter and confirm your new secure account password.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Error Alert */}
        {serverError && (
          <div className="rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">{serverError}</div>
          </div>
        )}

        {/* Success Alert */}
        {serverSuccess && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">{serverSuccess}</div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                disabled={isPending}
                className={`w-full bg-slate-950/80 border rounded-lg pl-9 pr-10 py-2 text-sm text-white placeholder-slate-500 transition-colors focus:outline-none focus:ring-1 ${
                  errors.password
                    ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
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
            {errors.password && (
              <p className="text-[11px] text-red-400 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                {...register('confirmPassword')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Repeat new password"
                disabled={isPending}
                className={`w-full bg-slate-950/80 border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 transition-colors focus:outline-none focus:ring-1 ${
                  errors.confirmPassword
                    ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
                    : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-red-400 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            size="md"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating Password...
              </>
            ) : (
              <>
                <span>Save New Password</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-slate-800/80 py-4">
        <Link
          href="/login"
          className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          Remember your password? <span className="text-blue-400">Sign in</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
