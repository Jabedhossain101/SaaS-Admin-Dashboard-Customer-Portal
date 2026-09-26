import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getAdminUserById } from '@/app/actions/admin';
import { UserEditForm } from './user-edit-form';

export const metadata = {
  title: 'Edit User Profile | Admin Portal',
  description: 'Update user roles, tenant profile data, and review user audit log history.',
};

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const { user, userLogs } = await getAdminUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/users"
          className="inline-flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Users Directory
        </Link>
        <Badge variant={user.role === 'admin' ? 'purple' : 'info'} className="capitalize font-semibold">
          {user.role} Scope
        </Badge>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <UserCheck className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          User Profile &amp; Role Management
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
          Review profile details for <strong className="text-slate-900 dark:text-white">{user.fullName}</strong> ({user.email}).
        </p>
      </div>

      <UserEditForm user={user} userLogs={userLogs} />
    </div>
  );
}
