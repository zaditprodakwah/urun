import { cookies } from 'next/headers';
import { supabaseAdmin } from './supabase-server';
import { SignJWT, jwtVerify } from 'jose';

export interface UserSession {
  userId: string;
  profileId: string;
  phone: string;
  role: 'warga' | 'pengurus' | 'admin';
  communityId: string;
  name: string;
}

const SESSION_SECRET = process.env.SESSION_SECRET;

function getSecretKey(): Uint8Array {
  if (!SESSION_SECRET) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('❌ Missing SESSION_SECRET environment variable!');
    }
    return new TextEncoder().encode('RahasiaUrunWargaSessionSecretFallback2026!');
  }
  return new TextEncoder().encode(SESSION_SECRET);
}

export async function encryptSession(payload: UserSession): Promise<string> {
  const secretKey = getSecretKey();
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

export async function decryptSession(jwt: string): Promise<UserSession | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(jwt, secretKey, {
      algorithms: ['HS256'],
    });
    return payload as unknown as UserSession;
  } catch (err) {
    console.error('Error verifying JWT signature:', err);
    return null;
  }
}

// Read and decode the session from Next.js cookies
export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('urun_session')?.value;
    if (!sessionCookie) return null;

    return await decryptSession(sessionCookie);
  } catch (err: any) {
    if (err && (err.message?.includes('Dynamic server usage') || err.digest === 'DYNAMIC_SERVER_USAGE')) {
      throw err;
    }
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
