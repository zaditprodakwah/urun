import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const origin = req.nextUrl.origin || process.env.NEXT_PUBLIC_SITE_URL || 'https://urunwarga.vercel.app';
  const response = NextResponse.redirect(new URL('/login', origin), { status: 302 });
  response.cookies.delete('urun_session');
  return response;
}
