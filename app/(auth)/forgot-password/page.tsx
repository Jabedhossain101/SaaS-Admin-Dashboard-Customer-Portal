'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  KeyRound,
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/validations/auth';
import { forgotPasswordAction } from '@/app/actions/auth';

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError(null);
    setServerSuccess(null);
    setIsPending(true);

    try {
      const response = await forgotPasswordAction(values);

      if (!response.success) {
        setServerError(response.error || 'Failed to process password reset request.');
        setIsPending(false);
        return;
      }

      setServerSuccess(
        response.message || 'Password reset instructions have been sent to your email.'
      );
      setIsPending(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setServerError(message);
      setIsPending(false);
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-2 text-center pb-4">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-1">
          <KeyRound className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-bold text-white tracking-tight">
          Forgot Password?
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs sm:text-sm">
          Enter your registered email address and we&apos;ll send you a link to reset your credentials.
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
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                {...register('email')}
                type="email"
                placeholder="you@company.com"
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

          <Button
            type="submit"
            className="w-full mt-2"
            size="md"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending Link...
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-slate-800/80 py-4">
        <Link
          href="/login"
          className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-white transition-colors gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
