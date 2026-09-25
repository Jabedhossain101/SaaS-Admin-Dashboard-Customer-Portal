import { getCustomerData } from '@/app/actions/customer';
import { ProfileForms } from './profile-forms';

export default async function CustomerProfilePage() {
  const { profile } = await getCustomerData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Account Settings &amp; Security
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Manage your personal identification, public avatar, and credentials.
        </p>
      </div>

      <ProfileForms initialProfile={profile} />
    </div>
  );
}
