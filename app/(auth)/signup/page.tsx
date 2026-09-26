import * as React from 'react';
import { SignupForm } from '@/components/forms/SignupForm';

export const metadata = {
  title: 'Create Account | SaaS Portal',
  description: 'Register a new tenant account with RBAC permissions.',
};

export default function SignUpPage() {
  return (
    <React.Suspense fallback={<div className="h-96 w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900/60" />}>
      <SignupForm />
    </React.Suspense>
  );
}
