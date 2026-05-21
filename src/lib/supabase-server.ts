import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://awkwtxtgxjojavwmasfh.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  // We throw an error in the server module because this is a critical secret.
  // It guarantees we fail fast on the server if misconfigured.
  console.error('❌ CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.');
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY. Cannot initialize Supabase Admin Client.');
}

// Admin Client (uses Service Role key, bypasses RLS, server-only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
