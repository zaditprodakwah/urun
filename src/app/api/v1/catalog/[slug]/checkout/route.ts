import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { sendWhatsappMessageAsync, formatPhoneNumber } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

interface RouteParams {
  slug: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<RouteParams> }
) {
  try {
    const { slug } = await params;

    // 1. Fetch catalog item by slug along with seller phone info
    const { data: item, error: itemErr } = await supabaseAdmin
      .from('catalog_items')
      .select(`
        id,
        title,
        metadata,
        created_by,
        community_members(
          profiles(full_name, phone)
        )
      `)
      .eq('slug', slug)
      .single();

    if (itemErr || !item) {
      console.error('❌ Error finding catalog item for checkout notification:', itemErr);
      return NextResponse.json({ error: 'Barang tidak ditemukan.' }, { status: 404 });
    }

    const sellerProfile = (item.community_members as any)?.profiles;
    const sellerPhone = sellerProfile?.phone;
    const sellerName = sellerProfile?.full_name || 'Pengurus Komunitas';

    if (!sellerPhone) {
      return NextResponse.json({ 
        status: 'success', 
        message: 'Order logged locally but seller has no active WhatsApp number registered.' 
      }, { status: 200 });
    }

    // 2. Parse buyer payload
    const body = await req.json();
    const { buyerName, buyerAddress, buyerQty, notes, customValues } = body;

    if (!buyerName || !buyerQty) {
      return NextResponse.json({ error: 'Nama dan jumlah pesanan wajib diisi.' }, { status: 400 });
    }

    const price = item.metadata?.price || 0;
    const total = price * Number(buyerQty);

    // 3. Format structured WhatsApp message to be sent to the seller
    let customFieldsText = '';
    if (customValues && typeof customValues === 'object') {
      customFieldsText = Object.entries(customValues)
        .map(([label, val]) => `- ${label}: ${val}`)
        .join('\n');
    }

    const formattedSellerMessage = `🔔 *PESANAN BARANG WARGA BARU (URUN)*

Halo Kak ${sellerName}, ada pesanan masuk untuk produk Anda!

*Rincian Barang:*
- Nama Barang: ${item.title}
- SKU: ${item.metadata?.sku || 'LOKAL-WARGA'}
- Harga Unit: Rp ${price.toLocaleString('id-ID')}

*Rincian Pembeli:*
- Nama Pembeli: ${buyerName}
- Alamat Pengiriman: ${buyerAddress || 'Ambil di tempat'}
- Jumlah Pesanan: ${buyerQty} unit
- Total Bayar: *Rp ${total.toLocaleString('id-ID')}*
${customFieldsText ? `\n*Kolom Kustom Warga:*\n${customFieldsText}\n` : ''}
- Catatan Tambahan: ${notes || '-'}

Silakan segera hubungi pembeli untuk koordinasi pengiriman dan pembayaran gotong-royong. Terima kasih tetangga!`;

    // 4. Send background WhatsApp notification to the seller
    const formattedSellerPhone = formatPhoneNumber(sellerPhone);
    sendWhatsappMessageAsync(formattedSellerPhone, formattedSellerMessage);

    return NextResponse.json({
      status: 'success',
      message: 'Notifikasi pesanan berhasil dikirim ke penjual.',
      seller_phone: formattedSellerPhone
    }, { status: 200 });

  } catch (err: any) {
    console.error('💥 Checkout Notification API Critical Error:', err);
    return NextResponse.json({ error: 'Gagal memproses notifikasi checkout.' }, { status: 500 });
  }
}
