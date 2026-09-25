'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  UserPlus,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Building,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signUpSchema, type SignUpFormValues } from '@/lib/validations/auth';
import { signUpAction } from '@/app/actions/auth';

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      role: 'customer',
      password: '',
      confirmPassword: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (values: SignUpFormValues) => {
    setServerError(null);
    setServerSuccess(null);
    setIsPending(true);

    try {
      const response = await signUpAction(values);

      if (!response.success) {
        setServerError(response.error || 'Registration failed. Please check your details.');
        setIsPending(false);
        return;
      }

      setServerSuccess(response.message || 'Account successfully created!');
      setTimeout(() => {
        router.push(response.redirectUrl || '/dashboard');
        router.refresh();
      }, 900);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setServerError(message);
      setIsPending(false);
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-2 text-center pb-4">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-1">
          <UserPlus className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-bold text-white tracking-tight">
          Create an Account
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs sm:text-sm">
          Get started with your dedicated SaaS workspace
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
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                {...register('fullName')}
                type="text"
                placeholder="Alex Mercer"
                disabled={isPending}
                className={`w-full bg-slate-950/80 border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 transition-colors focus:outline-none focus:ring-1 ${
                  errors.fullName
                    ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500'
                    : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="text-[11px] text-red-400 font-medium">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                {...register('email')}
                type="email"
                placeholder="alex@company.com"
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

          {/* Role Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Account Type &amp; Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setValue('role', 'customer')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedRole === 'customer'
                    ? 'border-blue-500/80 bg-blue-950/30 text-white shadow-sm'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs text-white">
                  <Building className="w-3.5 h-3.5 text-blue-400" /> Customer
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Tenant portal access</div>
              </button>

              <button
                type="button"
                onClick={() => setValue('role', 'admin')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedRole === 'admin'
                    ? 'border-purple-500/80 bg-purple-950/30 text-white shadow-sm'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Administrator
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Full system control</div>
              </button>
            </div>
            {errors.role && (
              <p className="text-[11px] text-red-400 font-medium">{errors.role.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Password</label>
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
            <label className="text-xs font-medium text-slate-300">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                {...register('confirmPassword')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Repeat password"
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
                Creating Account...
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-slate-800/80 py-4">
        <p className="text-xs text-slate-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
