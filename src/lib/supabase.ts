import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://awkwtxtgxjojavwmasfh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (typeof window === 'undefined' && !supabaseServiceKey) {
  console.warn('⚠️ Missing SUPABASE_SERVICE_ROLE_KEY environment variable. Please configure it in Vercel.');
}

// Browser Client (uses Anon key, supports session persistence in client)
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Admin Client (uses Service Role key, bypasses RLS, server-only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || '', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

