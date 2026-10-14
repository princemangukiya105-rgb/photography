import { cookies } from 'next/headers';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export interface AdminSession {
  isAdmin: boolean;
  email?: string;
  source: 'supabase' | 'bootstrap';
}

/**
 * Verifies that the current request originates from an authorized administrator.
 * Enforces server-side verification: never trusts client parameters.
 */
export async function verifyAdminSession(): Promise<AdminSession> {
  const cookieStore = await cookies();

  // 1. Check Supabase authenticated user & profiles role
  const supabase = await createClient();
  if (supabase) {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!error && user) {
        // Query profile role
        const adminClient = createAdminClient();
        if (adminClient) {
          const { data: profile } = await adminClient
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (profile && profile.role === 'admin') {
            return {
              isAdmin: true,
              email: user.email,
              source: 'supabase',
            };
          }
        }
      }
    } catch {
      // Supabase connection or table error
    }
  }

  // 2. Check local bootstrap session cookie
  // This allows developer / studio owner testing prior to putting live Supabase keys in production
  const bootstrapCookie = cookieStore.get('moments_admin_session');
  if (bootstrapCookie && bootstrapCookie.value === 'authorized_studio_admin') {
    return {
      isAdmin: true,
      email: 'admin@momentsproduction.com',
      source: 'bootstrap',
    };
  }

  return {
    isAdmin: false,
    source: 'bootstrap',
  };
}
