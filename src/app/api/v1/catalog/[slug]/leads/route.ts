import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    
    // Ekstraksi muatan prospek (leads payload)
    const { intentType, buyerName, contactInfo, leadMagnetClaimed, capturedData } = body;

    // Validasi esensial: Setidaknya kita mengantongi nama/alias warga
    if (!intentType || !buyerName) {
      return NextResponse.json({ error: 'Identitas prospek tidak lengkap.' }, { status: 400 });
    }

    // Injeksi By-Pass (Admin Role) ke tabel catalog_leads
    const { data, error } = await supabaseAdmin
      .from('catalog_leads')
      .insert({
        catalog_slug: slug,
        intent_type: intentType,
        buyer_name: buyerName,
        contact_info: contactInfo || null,
        lead_magnet_claimed: leadMagnetClaimed || null,
        captured_data: capturedData || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Database Lead Capture Error:', error);
      return NextResponse.json({ error: 'Gagal menyadap rekaman prospek.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, lead: data }, { status: 201 });
  } catch (err: any) {
    console.error('Server Lead Capture Exception:', err);
    return NextResponse.json({ error: 'Kesalahan transmisi jaringan internal.' }, { status: 500 });
  }
}
