"use client";

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Link2, 
  Star, 
  Calendar, 
  Check, 
  X, 
  Send, 
  ShoppingBag,
  Sparkles,
  Phone,
  MessageCircle,
  ThumbsUp,
  HelpCircle,
  Gift
} from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: {
    full_name: string;
  } | null;
}

interface ProductInteractiveSectionProps {
  slug: string;
  externalUrl: string | null;
  whatsappFormFields: Array<{
    name: string;
    label: string;
    type: 'text' | 'number' | 'textarea';
    required: boolean;
  }>;
  sellerPhone: string;
  sellerName: string;
  title: string;
  sku: string;
  price: number;
  initialReviews: Review[];
  isLoggedIn: boolean;
  userFullName?: string;
}

export default function ProductInteractiveSection({
  slug,
  externalUrl,
  whatsappFormFields,
  sellerPhone,
  sellerName,
  title,
  sku,
  price,
  initialReviews,
  isLoggedIn,
  userFullName
}: ProductInteractiveSectionProps) {
  // Modal State Manager for 3 Intents
  const [activeModal, setActiveModal] = useState<'none' | 'checkout' | 'inquiry' | 'external_lead'>('none');

  // Shared Form / Leads State
  const [buyerName, setBuyerName] = useState(userFullName || '');
  const [contactInfo, setContactInfo] = useState(''); // Email/WA for warm leads
  const [inquiryText, setInquiryText] = useState('');
  
  // Checkout Specific State
  const [buyerAddress, setBuyerAddress] = useState('');
  const [buyerQty, setBuyerQty] = useState(1);
  const [notes, setNotes] = useState('');
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  
  // Progress State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [statusSuccess, setStatusSuccess] = useState('');

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Form handle for dynamic custom inputs
  const handleCustomInputChange = (name: string, value: string) => {
    setCustomInputs({ ...customInputs, [name]: value });
  };

  // SILENT LEAD CAPTURE ENGINE
  const captureLeadData = async (intentType: 'inquiry' | 'external_click' | 'checkout', capturedData: any = {}) => {
    try {
      await fetch(`/api/v1/catalog/${slug}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intentType,
          buyerName: buyerName || 'Warga Anonim',
          contactInfo: contactInfo || null,
          leadMagnetClaimed: intentType === 'external_click' ? 'Kupon Spesial / Akses Toko' : null,
          capturedData
        })
      });
    } catch (err) {
      console.warn("Silent lead capture missed:", err);
    }
  };

  // 1. INTENT: TANYAKAN (INQUIRY)
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusError('');

    await captureLeadData('inquiry', { question: inquiryText });

    const currentUrl = typeof window !== 'undefined' ? window.location.href : `Katalog ${title}`;
    const message = `Halo Kak ${sellerName}, saya ${buyerName}.\n\nSaya melihat *${title}* di jaringan URUN Warga dan ingin bertanya:\n\n"${inquiryText}"\n\n🔗 Referensi: ${currentUrl}`;
    
    const cleanPhone = sellerPhone.trim().replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('08') ? '628' + cleanPhone.slice(2) : cleanPhone;
    const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setActiveModal('none');
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }, 600);
  };

  // 2. INTENT: EXTERNAL LEAD MAGNET
  const handleExternalLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusError('');

    await captureLeadData('external_click', { notes: 'Unlocked external affiliate link' });

    let targetUrl = externalUrl!;
    if (targetUrl.includes('tokopedia.com') || targetUrl.includes('shopee.co.id')) {
      const conn = targetUrl.includes('?') ? '&' : '?';
      targetUrl = `${targetUrl}${conn}ref=urunwarga&utm_source=urun`;
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setActiveModal('none');
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }, 600);
  };

  // 3. INTENT: HOT CHECKOUT VIA WHATSAPP
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusError('');
    setStatusSuccess('');

    try {
      const customValues: Record<string, string> = {};
      whatsappFormFields.forEach(f => {
        if (!['name', 'address', 'qty', 'notes'].includes(f.name)) {
          customValues[f.label] = customInputs[f.name] || '';
        }
      });

      // We still hit the old checkout API for transactional logic if needed
      const response = await fetch(`/api/v1/catalog/${slug}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerName, buyerAddress, buyerQty, notes, customValues })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Gagal mengirim pesanan.');
      }

      // Simultaneously capture lead
      await captureLeadData('checkout', { qty: buyerQty, address: buyerAddress, notes });

      setStatusSuccess('Mengamankan data pesanan... Mengalihkan ke WhatsApp...');
      
      const total = price * buyerQty;
      let customFieldsText = '';
      whatsappFormFields.forEach(f => {
        if (!['name', 'address', 'qty', 'notes'].includes(f.name)) {
          customFieldsText += `- *${f.label}*: ${customInputs[f.name] || '-'}\n`;
        }
      });

      const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
      const structuredMessage = `Halo Kak ${sellerName}, saya ingin memesan barang lewat URUN Warga:\n\n*Barang:* ${title} (SKU: ${sku})\n*Harga:* Rp ${price.toLocaleString('id-ID')}\n\n*Pembeli:* ${buyerName}\n*Alamat:* ${buyerAddress || 'Ambil di tempat'}\n*Jumlah:* ${buyerQty} unit\n*Total:* *Rp ${total.toLocaleString('id-ID')}*\n${customFieldsText ? `\n*Lainnya:*\n${customFieldsText}` : ''}- Catatan: ${notes || '-'}\n\n🔗 Tautan: ${currentUrl}`;

      const cleanPhone = sellerPhone.trim().replace(/[^0-9]/g, '');
      const formattedPhone = cleanPhone.startsWith('08') ? '628' + cleanPhone.slice(2) : cleanPhone;
      const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(structuredMessage)}`;

      setTimeout(() => {
        setIsSubmitting(false);
        setActiveModal('none');
        setStatusSuccess('');
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }, 1500);

    } catch (err: any) {
      setSubmittingFalse();
      setStatusError(err.message || 'Terjadi kesalahan pemrosesan.');
    }
  };

  const setSubmittingFalse = () => setIsSubmitting(false);

  // Submit Review
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const response = await fetch(`/api/v1/catalog/${slug}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: ratingInput, comment: commentInput })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal menyimpan ulasan.');

      setReviewSuccess('Terima kasih! Ulasan warga Anda berhasil disimpan.');
      
      const newReview: Review = {
        id: data.review?.id || Math.random().toString(),
        rating: ratingInput,
        comment: commentInput,
        created_at: new Date().toISOString(),
        profiles: { full_name: userFullName || 'Warga URUN' }
      };
      setReviews([newReview, ...reviews]);
      setCommentInput('');
      setTimeout(() => setReviewSuccess(''), 2000);
    } catch (err: any) {
      setReviewError(err.message || 'Gagal mengirimkan ulasan.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Dynamic Actions Box - 3 Pillars of Conversion */}
      <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm space-y-5">
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-zinc-800 flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-emerald-700" />
            Saluran Transaksi & Diskusi Warga
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">
            Pilih metode yang paling nyaman bagi Anda. Transaksi afiliasi maupun pesan antar langsung melalui warga sama-sama menguatkan perputaran kas lokal komunitas Anda.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {externalUrl && (
            <button 
              onClick={() => setActiveModal('external_lead')}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 text-white font-extrabold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 cursor-pointer"
            >
              <span>Beli di Toko Resmi Eksternal</span>
              <Link2 className="w-4.5 h-4.5" />
            </button>
          )}

          {sellerPhone && (
            <>
              <button 
                onClick={() => setActiveModal('checkout')}
                className={`w-full py-3.5 px-6 rounded-xl font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  externalUrl 
                    ? 'bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/10'
                }`}
              >
                <span>Pesan Instan via WhatsApp</span>
                <MessageCircle className={`w-4.5 h-4.5 ${externalUrl ? 'text-emerald-700' : 'fill-white text-emerald-600'}`} />
              </button>

              <button 
                onClick={() => setActiveModal('inquiry')}
                className="w-full py-2.5 px-6 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-100 hover:text-zinc-800 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>Tanyakan Sesuatu...</span>
                <HelpCircle className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {externalUrl && (
          <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40 text-emerald-950 text-xs space-y-2 leading-relaxed shadow-sm">
            <div className="font-extrabold flex items-center gap-1.5 text-emerald-800 text-sm">
              <span role="img" aria-label="handshake">🤝</span>
              <span>Program Kemitraan Kas Warga</span>
            </div>
            <p className="font-medium text-emerald-900/90 leading-relaxed">
              Belanja Anda berkontribusi nyata! <strong className="text-emerald-700 font-bold">70% komisi</strong> dari tautan luar ini otomatis masuk ke <strong className="text-emerald-700 font-bold">Kas RT/RW Anda</strong>.
            </p>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="space-y-6">
        <div className="border-b border-zinc-200 pb-4">
          <h3 className="text-lg font-black text-zinc-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-700" />
            Ulasan Warga ({reviews.length})
          </h3>
        </div>

        {isLoggedIn ? (
          <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-4 shadow-sm">
            <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Tulis Ulasan Anda</h4>
            {reviewSuccess && <div className="text-emerald-700 text-xs font-bold">{reviewSuccess}</div>}
            
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRatingInput(star)}>
                  <Star className={`w-6 h-6 ${star <= ratingInput ? 'fill-amber-500 text-amber-500' : 'text-zinc-300'}`} />
                </button>
              ))}
            </div>

            <textarea
              required rows={2} value={commentInput} onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Pendapat jujur Anda..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs"
            />
            <button type="submit" disabled={isSubmittingReview} className="px-4 py-2 text-xs font-bold bg-zinc-900 text-white rounded-xl">
              Kirim Ulasan
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs flex justify-between">
            <span>Masuk untuk menulis ulasan.</span>
            <a href="/login" className="text-emerald-700 font-bold">Masuk →</a>
          </div>
        )}

        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-5 rounded-2xl border border-zinc-100 bg-white shadow-sm space-y-2">
              <div className="flex justify-between">
                <div className="text-xs font-bold">{rev.profiles?.full_name || 'Warga'}</div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-3.5 h-3.5 ${star <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-zinc-200'}`} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-zinc-700">{rev.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODALS OVERLAY --- */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-in fade-in duration-200 max-h-[90vh] flex flex-col overflow-hidden relative border border-zinc-100">
            
            <button 
              onClick={() => setActiveModal('none')}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 1. INQUIRY MODAL */}
            {activeModal === 'inquiry' && (
              <form onSubmit={handleInquirySubmit} className="flex flex-col h-full">
                <div className="px-6 pt-8 pb-4 bg-emerald-50/50">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 border border-emerald-100">
                    <HelpCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-black text-zinc-900">Tanyakan ke Tetangga</h3>
                  <p className="text-sm text-zinc-500 mt-1">Kami akan menyambungkan pertanyaan Anda langsung ke WhatsApp penjual dengan format rapi.</p>
                </div>
                <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 uppercase">Nama Panggilan Anda</label>
                    <input type="text" required value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Misal: Kak Rina RT 02" className="w-full border border-zinc-300 rounded-xl px-4 py-3 text-sm focus:border-emerald-600 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 uppercase">Apa yang ingin ditanyakan?</label>
                    <textarea required rows={3} value={inquiryText} onChange={e => setInquiryText(e.target.value)} placeholder="Apakah stok warna merah masih ada? Bisa kirim sore ini?" className="w-full border border-zinc-300 rounded-xl px-4 py-3 text-sm focus:border-emerald-600 outline-none resize-none" />
                  </div>
                </div>
                <div className="p-6 bg-zinc-50 border-t border-zinc-100">
                  <button type="submit" disabled={isSubmitting} className="w-full py-3.5 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 disabled:opacity-50 flex justify-center items-center gap-2">
                    {isSubmitting ? 'Menyiapkan Jalur...' : 'Lanjutkan ke WhatsApp'}
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* 2. EXTERNAL LEAD MAGNET MODAL */}
            {activeModal === 'external_lead' && (
              <form onSubmit={handleExternalLeadSubmit} className="flex flex-col h-full">
                <div className="px-6 pt-8 pb-4 bg-amber-50/50">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 border border-amber-100">
                    <Gift className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-black text-zinc-900">Membuka Tautan Eksternal</h3>
                  <p className="text-sm text-zinc-600 mt-1 leading-relaxed">
                    Anda akan dialihkan ke toko resmi. <strong className="text-amber-700">Tinggalkan nama Anda</strong> untuk mengaktifkan &quot;Perlindungan &amp; Bantuan Retur Komunitas&quot; apabila terjadi kendala pengiriman.
                  </p>
                </div>
                <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 uppercase">Nama / ID Warga</label>
                    <input type="text" required value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Nama Anda" className="w-full border border-zinc-300 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 uppercase">Nomor WA / Email (Opsional)</label>
                    <input type="text" value={contactInfo} onChange={e => setContactInfo(e.target.value)} placeholder="Hanya untuk bantuan klaim" className="w-full border border-zinc-300 rounded-xl px-4 py-3 text-sm focus:border-amber-500 outline-none" />
                  </div>
                </div>
                <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex gap-3">
                  <button type="button" onClick={() => setActiveModal('none')} className="flex-1 py-3.5 rounded-xl border border-zinc-300 text-zinc-700 font-bold hover:bg-zinc-100">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="flex-[2] py-3.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 disabled:opacity-50 flex justify-center items-center gap-2">
                    {isSubmitting ? 'Membuka...' : 'Klaim & Buka Toko'}
                    <Link2 className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* 3. CHECKOUT MODAL */}
            {activeModal === 'checkout' && (
              <form onSubmit={handleCheckoutSubmit} className="flex flex-col h-full max-h-[85vh]">
                <div className="px-6 py-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between shrink-0">
                  <div>
                    <h3 className="text-base font-extrabold text-zinc-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-700" /> Format Pesanan Instan
                    </h3>
                  </div>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-4">
                  {statusError && <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg font-bold">{statusError}</div>}
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 uppercase">Nama Pembeli *</label>
                    <input type="text" required value={buyerName} onChange={e => setBuyerName(e.target.value)} className="w-full border border-zinc-300 rounded-xl px-4 py-2.5 text-sm" />
                  </div>

                  {whatsappFormFields.some(f => f.name === 'address') && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700 uppercase">Alamat Kirim *</label>
                      <textarea required rows={2} value={buyerAddress} onChange={e => setBuyerAddress(e.target.value)} className="w-full border border-zinc-300 rounded-xl px-4 py-2.5 text-sm resize-none" />
                    </div>
                  )}

                  {whatsappFormFields.some(f => f.name === 'qty') && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700 uppercase">Jumlah Unit *</label>
                      <input type="number" required min={1} value={buyerQty} onChange={e => setBuyerQty(Number(e.target.value))} className="w-full border border-zinc-300 rounded-xl px-4 py-2.5 text-sm" />
                    </div>
                  )}

                  {whatsappFormFields.filter(f => !['name', 'address', 'qty', 'notes'].includes(f.name)).map((f, i) => (
                    <div key={i} className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700 uppercase">{f.label} {f.required && '*'}</label>
                      <input type={f.type === 'number' ? 'number' : 'text'} required={f.required} value={customInputs[f.name] || ''} onChange={e => handleCustomInputChange(f.name, e.target.value)} className="w-full border border-zinc-300 rounded-xl px-4 py-2.5 text-sm" />
                    </div>
                  ))}
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 uppercase">Catatan Opsional</label>
                    <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full border border-zinc-300 rounded-xl px-4 py-2.5 text-sm" />
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 border-t border-zinc-200 shrink-0">
                  <button type="submit" disabled={isSubmitting} className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:opacity-50 flex justify-center items-center gap-2">
                    {isSubmitting ? 'Mengalihkan ke WA...' : 'Buka WhatsApp Penjual'}
                    <Phone className="w-4 h-4 fill-white" />
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
