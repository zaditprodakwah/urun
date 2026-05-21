import { NextRequest, NextResponse } from 'next/server';
import { parseMarketplaceProduct, isCircuitOpen } from '@/lib/parser';

export async function POST(req: NextRequest) {
  try {
    // 1. Check Circuit Breaker status
    if (isCircuitOpen()) {
      return NextResponse.json(
        { 
          error: 'Circuit Breaker is active. Parser is in cooldown due to consecutive failures.',
          cooldownActive: true
        },
        { status: 503 }
      );
    }

    // 2. Parse request body
    const body = await req.json().catch(() => ({}));
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL parameter is required and must be a string.' },
        { status: 400 }
      );
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format. Please provide a valid external product link.' },
        { status: 400 }
      );
    }

    // 3. Execute parsing (ghost caching & circuit breaker internally handled)
    const productData = await parseMarketplaceProduct(url);
    
    return NextResponse.json(productData, { status: 200 });
  } catch (err: any) {
    console.error('[Parser API Error]:', err);
    
    // Check if the error is due to circuit breaker triggering
    const isCircuitErr = err.message?.includes('Circuit Breaker') || isCircuitOpen();
    
    return NextResponse.json(
      { 
        error: err.message || 'An unexpected error occurred during parsing.',
        cooldownActive: isCircuitErr
      },
      { status: isCircuitErr ? 503 : 500 }
    );
  }
}
