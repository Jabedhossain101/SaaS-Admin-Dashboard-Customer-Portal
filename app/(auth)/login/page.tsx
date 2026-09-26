import * as React from 'react';
import { LoginForm } from '@/components/forms/LoginForm';

export const metadata = {
  title: 'Sign In | SaaS Portal',
  description: 'Sign in to access your Customer Workspace or Admin Control Center.',
};

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="h-96 w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900/60" />}>
      <LoginForm />
    </React.Suspense>
  );
}
