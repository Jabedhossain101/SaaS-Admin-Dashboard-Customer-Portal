import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/utils';
import { AdminShell } from '@/components/admin/admin-shell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let adminProfile = {
    fullName: 'System Administrator',
    email: 'admin@saasportal.io',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  };

  const cookieStore = await cookies();
  const mockCookie = cookieStore.get('saas_mock_session');

  if (mockCookie?.value) {
    try {
      const parsed = JSON.parse(mockCookie.value);
      adminProfile = {
        fullName: parsed.fullName || adminProfile.fullName,
        email: parsed.email || adminProfile.email,
        role: parsed.role || 'admin',
        avatarUrl: parsed.avatarUrl || adminProfile.avatarUrl,
      };
    } catch {
      // Ignore
    }
  } else if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        adminProfile.email = user.email || adminProfile.email;
        const { data: profile } = await (supabase.from('profiles') as any)
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          adminProfile.fullName = profile.full_name || adminProfile.fullName;
          adminProfile.avatarUrl = profile.avatar_url || adminProfile.avatarUrl;
        }
      }
    } catch {
      // Ignore
    }
  }

  return <AdminShell adminUser={adminProfile}>{children}</AdminShell>;
}
