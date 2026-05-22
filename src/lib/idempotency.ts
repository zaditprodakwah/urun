import { SupabaseClient } from '@supabase/supabase-js';

export type IdempotencyResult = {
  status: 'proceed';
} | {
  status: 'conflict' | 'hit';
  response_body: any;
  response_status: number;
};

/**
 * Validates an Idempotency-Key against the database cache.
 * Must be used within POST/PUT endpoints that mutate state (e.g. Ledger, Admin Settings).
 */
export async function checkIdempotency(
  supabaseAdmin: SupabaseClient,
  idempotencyKey: string,
  communityId: string,
  requestPath: string
): Promise<IdempotencyResult> {
  // A. Fetch dynamic expiry configurations from global_settings table
  const { data: expirySetting } = await supabaseAdmin
    .from('global_settings')
    .select('value')
    .eq('key', 'idempotency_settings')
    .single();

  const expiryHours = (expirySetting?.value as Record<string, number> | null)?.expiry_hours || 24;

  // B. Try to find existing key
  const { data, error } = await supabaseAdmin
    .from('idempotency_keys')
    .select('*')
    .eq('idempotency_key', idempotencyKey)
    .single();

  if (error && error.code !== 'PGRST116') {
    // If error is not 'No rows found', throw it (could be connection issue)
    throw error;
  }

  if (data) {
    // Check if key is expired
    const createdAt = new Date(data.created_at).getTime();
    const now = new Date().getTime();
    const ageHours = (now - createdAt) / (1000 * 60 * 60);

    if (ageHours > expiryHours) {
      // Key expired, delete it and proceed
      await supabaseAdmin
        .from('idempotency_keys')
        .delete()
        .eq('idempotency_key', idempotencyKey);
    } else {
      // Key exists and is valid. If it has a response, it's a 'hit', otherwise it's pending so 'conflict'
      if (data.response_status) {
        return {
          status: 'hit',
          response_body: data.response_body,
          response_status: data.response_status,
        };
      }
      return {
        status: 'conflict',
        response_body: { error: 'Request is already processing' },
        response_status: 409,
      };
    }
  }

  // C. Key doesn't exist, create it as pending
  const { error: insertError } = await supabaseAdmin.from('idempotency_keys').insert({
    idempotency_key: idempotencyKey,
    community_id: communityId,
    request_path: requestPath,
  });

  if (insertError) {
    // If unique constraint violation (e.g. 23505), it means another request just inserted it.
    if (insertError.code === '23505') {
      return {
        status: 'conflict',
        response_body: { error: 'Request is already processing (race condition caught)' },
        response_status: 409,
      };
    }
    throw insertError;
  }

  return { status: 'proceed' };
}

/**
 * Saves the response for a given Idempotency-Key so future retries get the same result.
 */
export async function saveIdempotencyResult(
  supabaseAdmin: SupabaseClient,
  idempotencyKey: string,
  responseStatus: number,
  responseBody: any
): Promise<void> {
  await supabaseAdmin
    .from('idempotency_keys')
    .update({
      response_status: responseStatus,
      response_body: responseBody,
    })
    .eq('idempotency_key', idempotencyKey);
}
