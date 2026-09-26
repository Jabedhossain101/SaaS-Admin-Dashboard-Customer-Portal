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
import { useToast } from '@/components/ui/toast';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const { toast } = useToast();

  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
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
    setIsPending(true);

    try {
      const response = await signInAction(values);

      if (!response.success) {
        setServerError(response.error || 'Invalid credentials or login failed.');
        toast.error('Authentication failed', response.error);
        setIsPending(false);
        return;
      }

      toast.success('Signed in successfully!', 'Redirecting to your workspace...');
      setTimeout(() => {
        router.push(nextParam || response.redirectUrl || '/dashboard');
        router.refresh();
      }, 500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setServerError(message);
      toast.error('Sign in error', message);
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
    <Card className="border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-2 text-center pb-4">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-1">
          <Lock className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Sign In to Your Account
        </CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
          Enter your credentials to access the Customer Portal or Admin Dashboard
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {serverError && (
          <div className="rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-950/40 p-3.5 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">{serverError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                {...register('email')}
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                disabled={isPending}
                className={`w-full bg-slate-50 dark:bg-slate-950/80 border rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-500 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isPending}
                className={`w-full bg-slate-50 dark:bg-slate-950/80 border rounded-xl pl-10 pr-10 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                  errors.password
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
            {errors.password && (
              <p className="text-[11px] text-red-500 font-medium">
                {errors.password.message}
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
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing In...
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            )}
          </Button>
        </form>

        {/* Demo Fast Fill */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Quick Demo Fill
            </span>
            <Badge variant="outline" className="text-[10px] py-0">Dev Ready</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('customer')}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-white">Customer</div>
              <div className="text-[10px] text-slate-400 truncate">customer@saasportal.io</div>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className="p-2 rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-950/40 text-left transition-colors cursor-pointer"
            >
              <div className="text-xs font-bold text-purple-700 dark:text-purple-300">Admin</div>
              <div className="text-[10px] text-purple-500/80 truncate">admin@saasportal.io</div>
            </button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-center border-t border-slate-200 dark:border-slate-800 py-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account yet?{' '}
          <Link
            href="/signup"
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            Create an account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
