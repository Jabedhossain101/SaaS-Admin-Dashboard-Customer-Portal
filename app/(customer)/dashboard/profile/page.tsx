import { getCustomerData } from '@/app/actions/customer';
import { ProfileForm } from '@/components/forms/ProfileForm';

export const metadata = {
  title: 'Profile Settings | SaaS Portal',
  description: 'Manage your profile information, timezone, and security credentials.',
};

export default async function CustomerProfilePage() {
  const { profile } = await getCustomerData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Account Settings &amp; Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
          Manage your personal identification, contact details, timezone, and security credentials.
        </p>
      </div>

      <ProfileForm initialProfile={profile} />
    </div>
  );
}
