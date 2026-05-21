import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// During Next.js build/compile time, environment variables might be absent.
// We use placeholder values to prevent the build from crashing at module evaluation time.
const activeUrl = supabaseUrl || 'https://awkwtxtgxjojavwmasfh.supabase.co'; // Fallback to project domain
const activeKey = supabaseServiceKey || 'build-placeholder-key';

// Service role client bypasses RLS for admin operations,
// but we MUST strictly enforce community_id isolation in all queries manually.
export const supabaseAdmin = createClient(activeUrl, activeKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
