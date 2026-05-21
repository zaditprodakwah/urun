import { cookies } from 'next/headers';
import { supabaseAdmin } from './supabase';

export interface UserSession {
  userId: string;
  profileId: string;
  phone: string;
  role: 'warga' | 'pengurus' | 'admin';
  communityId: string;
  name: string;
}

// Read and decode the session from Next.js cookies
export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('urun_session')?.value;
    if (!sessionCookie) return null;

    // The session cookie stores a JSON string
    const sessionData = JSON.parse(sessionCookie) as UserSession;
    if (!sessionData || !sessionData.userId || !sessionData.communityId) {
      return null;
    }
    return sessionData;
  } catch (err) {
    console.error('Error parsing session cookie:', err);
    return null;
  }
}

// Fetch member profile from Supabase with community_id verification
export async function getProfile(userId: string): Promise<any | null> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select(`
      *,
      communities (
        slug,
        name,
        geo_context
      )
    `)
    .eq('auth_user_id', userId)
    .single();

  if (error || !data) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return data;
}

// Server Component Guard: require authenticated user
export async function requireAuth(): Promise<UserSession> {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

// Server Component Guard: require specific role(s)
export async function requireRole(allowedRoles: ('warga' | 'pengurus' | 'admin')[]): Promise<UserSession> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) {
    throw new Error('FORBIDDEN');
  }
  return session;
}
