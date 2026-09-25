import { getCustomerData } from '@/app/actions/customer';
import { ActivityView } from './activity-view';

export default async function CustomerActivityPage() {
  const { activityLogs } = await getCustomerData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Activity History &amp; Audit Trail
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Review security and authentication events recorded for your tenant account.
        </p>
      </div>

      <ActivityView logs={activityLogs} />
    </div>
  );
}
