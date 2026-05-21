"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  ShoppingBag, 
  Link2, 
  MessageSquare, 
  Check, 
  X, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import OptimizedImage from '../OptimizedImage';

interface CatalogItem {
  id: string;
  title: string;
  description: string;
  checkout_type: 'link_toko' | 'whatsapp_form';
  external_url: string | null;
  whatsapp_form_fields: Array<{
    name: string;
    label: string;
    type: string;
    required: boolean;
  }>;
  metadata: {
    price: number;
    category: string;
    sku: string;
    image: string;
  };
  created_at: string;
}

interface CatalogManagerProps {
  initialItems: CatalogItem[];
}

export default function CatalogManager({ initialItems }: CatalogManagerProps) {
  const [items, setItems] = useState<CatalogItem[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Sembako');
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState('');
  const [sku, setSku] = useState('');
  const [checkoutType, setCheckoutType] = useState<'link_toko' | 'whatsapp_form'>('whatsapp_form');
  const [externalUrl, setExternalUrl] = useState('');
  const includeName = true; // Mandatory
  const [includeAddress, setIncludeAddress] = useState(true);
  const [includeQty, setIncludeQty] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [customFields, setCustomFields] = useState<Array<{ name: string; label: string; type: 'text' | 'number'; required: boolean }>>([]);
  const [customFieldName, setCustomFieldName] = useState('');
  const [customFieldLabel, setCustomFieldLabel] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const addCustomField = () => {
    if (!customFieldName.trim() || !customFieldLabel.trim()) return;
    const nameFormatted = customFieldName.trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_');
    
    setCustomFields([
      ...customFields,
      {
        name: nameFormatted,
        label: customFieldLabel.trim(),
        type: 'text',
        required: true
      }
    ]);
    setCustomFieldName('');
    setCustomFieldLabel('');
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Construct form fields array for WA Form
    const fields = [];
    if (checkoutType === 'whatsapp_form') {
      if (includeName) {
        fields.push({ name: 'name', label: 'Nama Lengkap', type: 'text', required: true });
      }
      if (includeAddress) {
        fields.push({ name: 'address', label: 'Alamat Pengiriman (RT/RW)', type: 'textarea', required: true });
      }
      if (includeQty) {
        fields.push({ name: 'qty', label: 'Jumlah Pesanan (Unit)', type: 'number', required: true });
      }
      if (includeNotes) {
        fields.push({ name: 'notes', label: 'Catatan Tambahan', type: 'textarea', required: false });
      }
      
      // Add custom fields
      customFields.forEach(f => {
        fields.push(f);
      });
    }

    const payload = {
      title,
      description,
      item_type: 'product',
      status: 'public',
      price: Number(price),
      category,
      image: image.trim() || undefined,
      sku: sku.trim() || undefined,
      checkout_type: checkoutType,
      external_url: checkoutType === 'link_toko' ? externalUrl.trim() : null,
      whatsapp_form_fields: fields
    };

    try {
      const response = await fetch('/api/v1/catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Terjadi kesalahan saat menyimpan data.');
      }

      setSuccessMsg('Barang dagangan Anda berhasil didaftarkan!');
      setItems([resData.item, ...items]);
      
      // Reset Form
      setTitle('');
      setDescription('');
      setCategory('Sembako');
      setPrice(0);
      setImage('');
      setSku('');
      setCheckoutType('whatsapp_form');
      setExternalUrl('');
      setCustomFields([]);
      
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg('');
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal mendaftarkan barang.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Trigger */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            Etalase Dagangan Saya
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Daftarkan produk Anda untuk dibeli oleh tetangga di RT/RW setempat.</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          Tambah Dagangan Warga
        </button>
      </div>

      {/* Product List */}
      {items.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/10">
          <div className="w-12 h-12 mx-auto rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Belum Ada Dagangan Terdaftar</h3>
          <p className="text-zinc-500 text-xs max-w-sm mx-auto">
            Anda belum mendaftarkan barang apapun. Ketuk tombol di atas untuk mulai menjual hasil bumi, makanan, perkakas, atau jasa.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => {
            const price = item.metadata?.price || 0;
            const category = item.metadata?.category || 'Sembako';
            const sku = item.metadata?.sku || `SKU-${item.title.toUpperCase()}`;
            const image = item.metadata?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60';
            
            return (
              <div 
                key={item.id}
                className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/30 hover:border-emerald-500/20 transition-all flex gap-4"
              >
                <div className="w-16 h-16 rounded-lg bg-zinc-950 overflow-hidden shrink-0 border border-zinc-800 relative">
                  <OptimizedImage src={image} alt={item.title} fill className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        {category}
                      </span>
                      <span className="font-mono text-[9px] text-zinc-600 truncate">{sku}</span>
                    </div>
                    
                    <h4 className="font-bold text-white text-sm truncate">{item.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1 font-semibold">Rp {price.toLocaleString('id-ID')}</p>
                  </div>
                  
                  <div className="pt-2 border-t border-zinc-900/50 mt-2 flex items-center justify-between text-[10px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      {item.checkout_type === 'whatsapp_form' ? (
                        <>
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Pemesanan Formulir WhatsApp ({item.whatsapp_form_fields?.length || 0} kolom)</span>
                        </>
                      ) : (
                        <>
                          <Link2 className="w-3.5 h-3.5 text-blue-400" />
                          <span className="truncate max-w-[150px]">Link: {item.external_url}</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Creation Modal (Warm industrial bright theme container inside dark layout to introduce our style) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#FCFBF9] text-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 animate-in fade-in duration-200 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#F5F3EF] border-b border-zinc-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-700" />
                  Daftarkan Dagangan Warga Baru
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">Isi detail komoditas dengan jujur untuk menunjang gotong royong lokal.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Error and Success alerts */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{errorMsg}</div>
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 font-medium">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{successMsg}</div>
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Nama Barang / Jasa <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Beras Pandan Wangi (10kg)"
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Kategori Komoditas</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-emerald-600 transition-colors"
                  >
                    <option value="Sembako">Sembako (Bahan Pokok)</option>
                    <option value="Peralatan Pertukangan">Perkakas / Alat Pertukangan</option>
                    <option value="Kerajinan Tangan">Kerajinan Tangan Warga</option>
                    <option value="Makanan Basah">Makanan Basah / Masakan Rumah</option>
                    <option value="Jasa Warga">Jasa Warga (Tukang, Servis, dll)</option>
                  </select>
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Harga Kesepakatan (Rupiah) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-bold">Rp</span>
                    <input
                      type="number"
                      required
                      min={0}
                      value={price || ''}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="135000"
                      className="w-full bg-white border border-zinc-300 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-emerald-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">SKU / Kode Unit (Opsional)</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="Contoh: BRS-10KG"
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Tautan Gambar Barang (Opsional)</label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... (atau kosongkan untuk default)"
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Deskripsi Singkat Komoditas</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan kualitas barang dagangan Anda..."
                    className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-emerald-600 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Checkout Type Selector */}
              <div className="p-4 rounded-xl bg-[#F5F3EF] border border-zinc-200 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-zinc-800 uppercase tracking-wider">Model Transaksi Belanja Warga</h4>
                  <p className="text-[11px] text-zinc-500">Tentukan bagaimana calon pembeli (tetangga) akan melakukan pemesanan.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className={`p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    checkoutType === 'whatsapp_form' 
                      ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20' 
                      : 'bg-white/50 border-zinc-300 hover:border-zinc-400'
                  }`}>
                    <input 
                      type="radio" 
                      name="checkoutType" 
                      value="whatsapp_form"
                      checked={checkoutType === 'whatsapp_form'}
                      onChange={() => setCheckoutType('whatsapp_form')}
                      className="sr-only" 
                    />
                    <div>
                      <div className="flex items-center gap-1.5 text-zinc-800 font-bold text-xs mb-1">
                        <MessageSquare className="w-4 h-4 text-emerald-700" />
                        Pesan via WhatsApp
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal">Pembeli mengisi formulir dinamis di situs, lalu data dikirim langsung ke WhatsApp Anda.</p>
                    </div>
                    {checkoutType === 'whatsapp_form' && <span className="text-[10px] font-bold text-emerald-700 self-end mt-2 flex items-center gap-0.5">✓ Terpilih</span>}
                  </label>

                  <label className={`p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    checkoutType === 'link_toko' 
                      ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20' 
                      : 'bg-white/50 border-zinc-300 hover:border-zinc-400'
                  }`}>
                    <input 
                      type="radio" 
                      name="checkoutType" 
                      value="link_toko"
                      checked={checkoutType === 'link_toko'}
                      onChange={() => setCheckoutType('link_toko')}
                      className="sr-only" 
                    />
                    <div>
                      <div className="flex items-center gap-1.5 text-zinc-800 font-bold text-xs mb-1">
                        <Link2 className="w-4 h-4 text-emerald-700" />
                        Toko Resmi (Eksternal)
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal">Redirect pembeli ke e-commerce eksternal (Tokopedia/Shopee) menggunakan link kemitraan kas RT.</p>
                    </div>
                    {checkoutType === 'link_toko' && <span className="text-[10px] font-bold text-emerald-700 self-end mt-2 flex items-center gap-0.5">✓ Terpilih</span>}
                  </label>
                </div>

                {/* Conditional Fields based on checkout type */}
                {checkoutType === 'link_toko' ? (
                  <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-zinc-200 animate-fadeIn">
                    <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Tautan Toko Eksternal (Tokopedia/Shopee/Toko Resmi) <span className="text-red-500">*</span></label>
                    <input
                      type="url"
                      required={checkoutType === 'link_toko'}
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      placeholder="https://www.tokopedia.com/toko-warga/produk-anda"
                      className="w-full bg-white border border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-emerald-600 transition-colors"
                    />
                    <p className="text-[10px] text-zinc-400">Tautan akan diproses secara transparan menggunakan mekanisme program kemitraan kas warga untuk RT setempat.</p>
                  </div>
                ) : (
                  /* WA Form Builder Dinamis (Phase 3) */
                  <div className="bg-white p-4 rounded-xl border border-zinc-200 space-y-4 animate-fadeIn">
                    <div className="space-y-1">
                      <h5 className="text-xs font-extrabold text-zinc-800 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        WhatsApp Form Builder Warga
                      </h5>
                      <p className="text-[10px] text-zinc-500">Tentukan kolom isian data apa saja yang wajib diisi tetangga saat memesan barang dagangan ini.</p>
                    </div>

                    <div className="space-y-2 border-b border-zinc-200 pb-3">
                      <div className="flex items-center justify-between text-xs p-2 rounded bg-zinc-50 border border-zinc-200">
                        <label className="flex items-center gap-2 cursor-not-allowed">
                          <input type="checkbox" checked disabled className="rounded text-emerald-600 focus:ring-emerald-500" />
                          <span className="font-bold text-zinc-800">Nama Lengkap Pembeli</span>
                        </label>
                        <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">Wajib / Bawaan</span>
                      </div>

                      <div className="flex items-center justify-between text-xs p-2 rounded bg-zinc-50 border border-zinc-200">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={includeAddress} 
                            onChange={(e) => setIncludeAddress(e.target.checked)}
                            className="rounded text-emerald-600 focus:ring-emerald-500" 
                          />
                          <span className="font-bold text-zinc-800">Alamat Rumah (RT/RW/No. Rumah)</span>
                        </label>
                        <span className="text-[10px] text-zinc-500">Wajib diisi</span>
                      </div>

                      <div className="flex items-center justify-between text-xs p-2 rounded bg-zinc-50 border border-zinc-200">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={includeQty} 
                            onChange={(e) => setIncludeQty(e.target.checked)}
                            className="rounded text-emerald-600 focus:ring-emerald-500" 
                          />
                          <span className="font-bold text-zinc-800">Jumlah Pesanan (Berapa Unit)</span>
                        </label>
                        <span className="text-[10px] text-zinc-500">Wajib diisi</span>
                      </div>

                      <div className="flex items-center justify-between text-xs p-2 rounded bg-zinc-50 border border-zinc-200">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={includeNotes} 
                            onChange={(e) => setIncludeNotes(e.target.checked)}
                            className="rounded text-emerald-600 focus:ring-emerald-500" 
                          />
                          <span className="font-bold text-zinc-800">Catatan Khusus (Varian, Rasa, dll)</span>
                        </label>
                        <span className="text-[10px] text-zinc-400">Opsional / Boleh kosong</span>
                      </div>
                    </div>

                    {/* Custom fields list inside builder */}
                    <div className="space-y-3">
                      <h6 className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider">Tambah Kolom Kustom (Opsional)</h6>
                      
                      {customFields.length > 0 && (
                        <div className="space-y-1.5">
                          {customFields.map((field, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-zinc-50 border border-zinc-200 text-xs p-2 rounded">
                              <div>
                                <span className="font-bold text-zinc-800">{field.label}</span>
                                <span className="text-[9px] text-zinc-400 ml-2 font-mono">({field.name})</span>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => removeCustomField(idx)}
                                className="text-red-500 hover:text-red-700 text-xs font-bold"
                              >
                                Hapus
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={customFieldLabel}
                            onChange={(e) => {
                              setCustomFieldLabel(e.target.value);
                              setCustomFieldName(e.target.value.toLowerCase().replace(/[^a-z0-9_]+/g, '_'));
                            }}
                            placeholder="Label: Rasa Varian / Ukuran"
                            className="w-full bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-emerald-600 transition-colors"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={addCustomField}
                          className="px-3.5 rounded-lg border border-emerald-600 hover:bg-emerald-50 text-emerald-800 text-xs font-bold transition-all shrink-0"
                        >
                          + Tambah Kolom
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-3 bg-[#F5F3EF] -mx-6 -mb-6 p-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/10 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Daftarkan Barang Warga'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
