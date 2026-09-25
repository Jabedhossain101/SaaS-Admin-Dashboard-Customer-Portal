import { getAdminUsersList } from '@/app/actions/admin';
import { UsersTable } from './users-table';

export default async function AdminUsersPage() {
  const users = await getAdminUsersList();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          User &amp; Tenant Management
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Inspect registered user records, filter by permission scopes, and modify role privileges.
        </p>
      </div>

      <UsersTable initialUsers={users} />
    </div>
  );
}
