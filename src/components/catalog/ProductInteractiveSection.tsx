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
  ThumbsUp
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
  checkoutType: 'link_toko' | 'whatsapp_form';
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
  checkoutType,
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
  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [buyerName, setBuyerName] = useState(userFullName || '');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [buyerQty, setBuyerQty] = useState(1);
  const [notes, setNotes] = useState('');
  
  // Custom fields inputs state
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [isSubmittingCheckout, setIsSubmittingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState('');

  // JIT Affiliate link injection
  const handleExternalClick = () => {
    if (!externalUrl) return;
    let targetUrl = externalUrl;
    if (targetUrl.includes('tokopedia.com') || targetUrl.includes('shopee.co.id')) {
      const conn = targetUrl.includes('?') ? '&' : '?';
      targetUrl = `${targetUrl}${conn}ref=urunwarga&utm_source=urun`;
    }
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Form handle for dynamic custom inputs
  const handleCustomInputChange = (name: string, value: string) => {
    setCustomInputs({
      ...customInputs,
      [name]: value
    });
  };

  // Submit order via WhatsApp Form popup
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCheckout(true);
    setCheckoutError('');
    setCheckoutSuccess('');

    try {
      // Map custom inputs label-value pairs for API payload
      const customValues: Record<string, string> = {};
      whatsappFormFields.forEach(f => {
        if (!['name', 'address', 'qty', 'notes'].includes(f.name)) {
          const fieldVal = customInputs[f.name] || '';
          customValues[f.label] = fieldVal;
        }
      });

      const response = await fetch(`/api/v1/catalog/${slug}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          buyerName,
          buyerAddress,
          buyerQty,
          notes,
          customValues
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengirim pesanan.');
      }

      setCheckoutSuccess('Pesanan Anda berhasil dikirim ke Pengurus via Fonnte Gateway! Menghubungkan Anda langsung ke WhatsApp tetangga...');
      
      // Construct buyer-to-seller click-to-chat WhatsApp message
      const total = price * buyerQty;
      let customFieldsText = '';
      whatsappFormFields.forEach(f => {
        if (!['name', 'address', 'qty', 'notes'].includes(f.name)) {
          const val = customInputs[f.name] || '-';
          customFieldsText += `- *${f.label}*: ${val}\n`;
        }
      });

      const structuredMessage = `Halo Kak ${sellerName}, saya ingin memesan barang dagangan Anda melalui URUN Warga:

*Rincian Barang:*
- Nama Barang: ${title}
- SKU: ${sku}
- Harga Unit: Rp ${price.toLocaleString('id-ID')}

*Rincian Pembeli:*
- Nama: ${buyerName}
- Alamat Pengiriman: ${buyerAddress || 'Ambil di tempat'}
- Jumlah: ${buyerQty} unit
- Total Bayar: *Rp ${total.toLocaleString('id-ID')}*
${customFieldsText ? `\n*Kolom Kustom Warga:*\n${customFieldsText}` : ''}
- Catatan Tambahan: ${notes || '-'}

Mohon konfirmasi pesanan ini ya tetangga. Terima kasih!`;

      // Redirect to WhatsApp
      const cleanPhone = sellerPhone.trim().replace(/[^0-9]/g, '');
      const formattedPhone = cleanPhone.startsWith('08') ? '628' + cleanPhone.slice(2) : cleanPhone;
      const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(structuredMessage)}`;

      setTimeout(() => {
        setIsCheckoutOpen(false);
        setCheckoutSuccess('');
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setCheckoutError(err.message || 'Terjadi kesalahan saat memproses pesanan.');
    } finally {
      setIsSubmittingCheckout(false);
    }
  };

  // Submit Review
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const response = await fetch(`/api/v1/catalog/${slug}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: ratingInput,
          comment: commentInput
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal menyimpan ulasan.');
      }

      setReviewSuccess('Terima kasih! Ulasan warga Anda berhasil disimpan.');
      
      // Update local state to include new/updated review
      const existingIdx = reviews.findIndex(r => r.profiles?.full_name === (userFullName || 'Warga URUN'));
      if (existingIdx > -1) {
        const updated = [...reviews];
        updated[existingIdx] = {
          ...updated[existingIdx],
          rating: ratingInput,
          comment: commentInput,
          created_at: new Date().toISOString()
        };
        setReviews(updated);
      } else {
        const newReview: Review = {
          id: data.review?.id || Math.random().toString(),
          rating: ratingInput,
          comment: commentInput,
          created_at: new Date().toISOString(),
          profiles: {
            full_name: userFullName || 'Warga URUN'
          }
        };
        setReviews([newReview, ...reviews]);
      }

      setCommentInput('');
      setTimeout(() => setReviewSuccess(''), 2000);

    } catch (err: any) {
      console.error(err);
      setReviewError(err.message || 'Gagal mengirimkan ulasan.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Buying Action Box */}
      <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm space-y-5">
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-zinc-800 flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-emerald-700" />
            Saluran Transaksi Warga
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed font-medium">
            {checkoutType === 'link_toko' 
              ? 'Pembelian dialihkan langsung ke toko resmi eksternal. Kemitraan ini mendukung kas komunitas RT/RW setempat secara otomatis.' 
              : 'Pemesanan langsung menggunakan Formulir WhatsApp. Cukup isi data di situs, lalu hubungi tetangga penjual secara instan.'}
          </p>
        </div>

        {checkoutType === 'link_toko' ? (
          <div className="space-y-4">
            <button 
              onClick={handleExternalClick}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 text-white font-extrabold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 text-center"
            >
              <span>Beli di Toko Resmi</span>
              <Link2 className="w-4.5 h-4.5" />
            </button>
            <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40 text-emerald-950 text-xs space-y-2 leading-relaxed shadow-sm">
              <div className="font-extrabold flex items-center gap-1.5 text-emerald-800 text-sm">
                <span role="img" aria-label="handshake">🤝</span>
                <span>Program Kemitraan Kas Warga</span>
              </div>
              <p className="font-medium text-emerald-900/90 leading-relaxed">
                Belanja Anda berkontribusi nyata! <strong className="text-emerald-700 font-bold">70% komisi</strong> dari tautan luar ini otomatis masuk ke <strong className="text-emerald-700 font-bold">Kas RT/RW Anda</strong> secara transparan untuk pembangunan fisik wilayah setempat, dan <strong className="text-emerald-700 font-bold">30%</strong> dialokasikan untuk operasional perawatan server URUN.
              </p>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 text-white font-extrabold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 text-center"
          >
            <span>Pesan via WhatsApp Tetangga</span>
            <MessageCircle className="w-4.5 h-4.5 fill-white text-emerald-600" />
          </button>
        )}

        <div className="text-center text-[10px] text-zinc-400 font-semibold flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Sovereign Escrow & JIT Link Injection Active</span>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-6">
        <div className="border-b border-zinc-200 pb-4">
          <h3 className="text-lg font-black text-zinc-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-700" />
            Ulasan & Suara Tetangga ({reviews.length})
          </h3>
          <p className="text-xs text-zinc-500 mt-1 font-medium">Asli dari warga terverifikasi dalam komunitas simpul setempat.</p>
        </div>

        {/* Review Form for Logged in Users */}
        {isLoggedIn ? (
          <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-4 shadow-sm">
            <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              Tulis Ulasan Anda
            </h4>

            {reviewError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {reviewError}
              </div>
            )}
            {reviewSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>{reviewSuccess}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-500 uppercase">Beri Bintang</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingInput(star)}
                    className="p-0.5 rounded focus:outline-none transition-colors"
                  >
                    <Star className={`w-6 h-6 ${
                      star <= ratingInput 
                        ? 'fill-amber-500 text-amber-500' 
                        : 'text-zinc-300 hover:text-amber-400'
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase">Komentar / Pengalaman Pembelian</label>
              <textarea
                required
                rows={2}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Tulis pendapat jujur Anda mengenai produk ini untuk membantu tetangga lain..."
                className="w-full bg-[#F5F3EF] border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-emerald-600 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 inline-flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              Kirim Ulasan Warga
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-[#F5F3EF] border border-zinc-200 text-zinc-600 text-xs font-medium flex items-center justify-between">
            <span>Masuk ke komunitas Anda untuk menulis ulasan produk.</span>
            <a href="/login" className="text-emerald-700 font-bold hover:underline">Masuk Sekarang →</a>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="py-8 text-center text-zinc-400 text-xs font-medium border border-dashed border-zinc-200 rounded-xl bg-white">
            Belum ada ulasan warga. Jadilah yang pertama memberikan suara Anda!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl border border-zinc-100 bg-white/70 shadow-sm space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-600/10 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      {rev.profiles?.full_name?.[0]?.toUpperCase() || 'W'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900">{rev.profiles?.full_name || 'Warga URUN'}</div>
                      <div className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(rev.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-3.5 h-3.5 ${
                        star <= rev.rating 
                          ? 'fill-amber-500 text-amber-500' 
                          : 'text-zinc-200'
                      }`} />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-zinc-700 leading-relaxed pl-9">
                  {rev.comment || 'Memberikan ulasan bintang tanpa komentar tertulis.'}
                </p>

                <div className="pl-9 pt-1 flex items-center gap-3 text-[10px] text-zinc-400 font-bold">
                  <button className="hover:text-emerald-700 transition-colors flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    Membantu
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Checkout Modal / Pop-up Dialog */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[#FCFBF9] text-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 animate-in fade-in duration-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#F5F3EF] border-b border-zinc-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-zinc-900 flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-emerald-700" />
                  Kirim Pesanan Barang Warga
                </h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Isi rincian pengiriman untuk berkoordinasi langsung dengan tetangga.</p>
              </div>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-950 hover:bg-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {checkoutError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {checkoutError}
                </div>
              )}
              {checkoutSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-1.5">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{checkoutSuccess}</div>
                </div>
              )}

              {/* Dynamic generated fields from whatsappFormFields */}
              <div className="space-y-4">
                
                {/* 1. Nama Lengkap */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Nama Lengkap Anda <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-emerald-600 transition-all"
                  />
                </div>

                {/* 2. Alamat Rumah (Conditional check based on definition) */}
                {whatsappFormFields.some(f => f.name === 'address') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Alamat Pengiriman (RT/RW/No. Rumah) <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      rows={2}
                      value={buyerAddress}
                      onChange={(e) => setBuyerAddress(e.target.value)}
                      placeholder="Contoh: Jl. Kenanga No. 12, RT 05 / RW 02"
                      className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-emerald-600 transition-all resize-none"
                    />
                  </div>
                )}

                {/* 3. Jumlah Pesanan */}
                {whatsappFormFields.some(f => f.name === 'qty') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Jumlah Pesanan <span className="text-red-500">*</span></label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        required
                        min={1}
                        value={buyerQty}
                        onChange={(e) => setBuyerQty(Number(e.target.value))}
                        className="w-24 bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-emerald-600 transition-all"
                      />
                      <span className="text-xs text-zinc-500 font-bold">unit (Total: Rp {(price * buyerQty).toLocaleString('id-ID')})</span>
                    </div>
                  </div>
                )}

                {/* 4. Notes */}
                {whatsappFormFields.some(f => f.name === 'notes') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Catatan Tambahan (Opsional)</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Varian rasa, ukuran, atau instruksi serah terima..."
                      className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-emerald-600 transition-all"
                    />
                  </div>
                )}

                {/* 5. Custom Dynamic Fields */}
                {whatsappFormFields.filter(f => !['name', 'address', 'qty', 'notes'].includes(f.name)).map((field, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        required={field.required}
                        rows={2}
                        value={customInputs[field.name] || ''}
                        onChange={(e) => handleCustomInputChange(field.name, e.target.value)}
                        placeholder={`Isikan detail ${field.label.toLowerCase()}...`}
                        className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-emerald-600 transition-all resize-none"
                      />
                    ) : (
                      <input
                        type={field.type === 'number' ? 'number' : 'text'}
                        required={field.required}
                        value={customInputs[field.name] || ''}
                        onChange={(e) => handleCustomInputChange(field.name, e.target.value)}
                        placeholder={`Contoh isian ${field.label.toLowerCase()}`}
                        className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-emerald-600 transition-all"
                      />
                    )}
                  </div>
                ))}

              </div>

              {/* Submit trigger actions */}
              <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-3 bg-[#F5F3EF] -mx-6 -mb-6 p-4">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCheckout}
                  className="px-6 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  {isSubmittingCheckout ? 'Mengirim...' : 'Pesan & Hubungi Penjual'}
                  <Phone className="w-3.5 h-3.5 fill-white text-emerald-600" />
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
