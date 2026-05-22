-- Migration: OTP Challenges for Custom Dual-Auth Gateway via Fonnte
-- Implements Phase 3 Roadmap: Dual-Auth Gateway & Shadow Email Security

CREATE TABLE public.otp_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL,
    otp_hash TEXT NOT NULL, -- SHA-256 hashed OTP, never plain text
    idempotency_key UUID NOT NULL UNIQUE, -- Prevents race conditions and replay attacks
    expires_at TIMESTAMPTZ NOT NULL, -- Max 3 minutes
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by phone during verification
CREATE INDEX idx_otp_challenges_phone ON public.otp_challenges(phone);

-- Strict RLS: Only Service Role can access this table
ALTER TABLE public.otp_challenges ENABLE ROW LEVEL SECURITY;

-- Deny all access to public/anon/authenticated roles
CREATE POLICY "Deny all public access to OTP" ON public.otp_challenges FOR ALL USING (false);
