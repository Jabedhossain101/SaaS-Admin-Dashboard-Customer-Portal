'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';
import { signInAction } from '@/app/actions/auth';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');

  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setServerSuccess(null);
    setIsPending(true);

    try {
      const response = await signInAction(values);

      if (!response.success) {
        setServerError(response.error || 'Invalid credentials or login failed.');
        setIsPending(false);
        return;
      }

      setServerSuccess(response.message || 'Authentication successful! Redirecting...');
      setTimeout(() => {
        router.push(nextParam || response.redirectUrl || '/dashboard');
        router.refresh();
      }, 700);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setServerError(message);
      setIsPending(false);
    }
  };

  const handleDemoFill = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      setValue('email', 'admin@saasportal.io');
      setValue('password', 'admin123');
    } else {
      setValue('email', 'customer@saasportal.io');
      setValue('password', 'customer123');
    }
    setServerError(null);
  };

  return (
    <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-2 text-center pb-4">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-1">
          <Lock className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-bold text-white tracking-tight">
          Sign In to Your Account
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs sm:text-sm">
          Enter your credentials to access the Customer Portal or Admin Dashboard
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
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>Email Address</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                {...register('email')}
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                disabled={isPending}
                className={`w-full bg-slate-950/80 border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 transition-colors focus:outline-none focus:ring-1 ${
                  errors.email
                    ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
                    : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-400 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-medium text-slate-300">Password</label>
              <Link
                href="/forgot-password"
                className="text-blue-400 hover:text-blue-300 transition-colors font-normal"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
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

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full mt-2"
            size="md"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            )}
          </Button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Quick Demo Fill
            </span>
            <Badge variant="outline" className="text-[10px] py-0">Development Safe</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('customer')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 text-slate-300 text-xs font-medium transition-colors text-left cursor-pointer"
            >
              <div className="text-white font-semibold">Demo Customer</div>
              <div className="text-[10px] text-slate-500">customer@saasportal.io</div>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className="px-2.5 py-1.5 rounded-lg border border-purple-900/40 bg-purple-950/20 hover:bg-purple-950/40 text-purple-300 text-xs font-medium transition-colors text-left cursor-pointer"
            >
              <div className="text-white font-semibold">Demo Admin</div>
              <div className="text-[10px] text-purple-400">admin@saasportal.io</div>
            </button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-center border-t border-slate-800/80 py-4">
        <p className="text-xs text-slate-400">
          Don&apos;t have an account yet?{' '}
          <Link
            href="/signup"
            className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <Card className="border-slate-800 bg-slate-900/80 p-8 text-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-400" />
          <p className="text-xs mt-2">Loading authentication portal...</p>
        </Card>
      }
    >
      <LoginFormContent />
    </React.Suspense>
  );
}
