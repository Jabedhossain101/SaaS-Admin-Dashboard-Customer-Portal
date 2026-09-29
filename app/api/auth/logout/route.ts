import { successResponse } from '@/lib/utils/apiResponse';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/utils';

/**
 * POST /api/auth/logout - Clear session cookie and sign out
 */
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('saas_mock_session');

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore cleanup error
    }
  }

  return successResponse({ message: 'Successfully signed out' });
}
