# 13_external_services

# **`13_external_services.md`**

**Status:** *Integration & Dependency Blueprint* | **Audience:** *AI Coder, System Architect, Stakeholders*

## **I. Filosofi Integrasi: "Pluggable Sovereignty"**

URUN dirancang dengan prinsip **Minimal Dependency**. Setiap layanan eksternal yang diintegrasikan bersifat *pluggable* (dapat dicabut-pasang) untuk menghindari *vendor lock-in*. Jika suatu layanan eksternal menaikkan biaya secara eksploitatif atau melanggar etika kedaulatan data komunitas, sistem harus mampu beralih ke penyedia lain atau kembali ke mode manual tanpa menghentikan operasi inti.

## **II. Service Categorization**

### **A. Core Infrastructure (Critical)**

Layanan ini membentuk pondasi eksekusi URUN.

* **Vercel (Hosting & Edge Computing):** Hosting Next.js dan *Edge Functions*.  
* **Supabase (Database & Auth):** Basis data PostgreSQL dan *authentication layer*.  
* **WhatsApp API (Communication):** Gerbang utama interaksi warga. Penggunaan *provider* (seperti Twilio, WABA, atau *self-hosted* Baileys) harus diisolasi melalui *adapter pattern* agar bisa diganti kapan saja.

### **B. Operational Services (Adaptable Perimeter)**

Layanan ini mendukung fungsionalitas tambahan untuk skalabilitas.

* **Payment Gateways (Midtrans/Xendit):** Untuk otomatisasi pembayaran iuran/tender. *Catatan:* Ledger internal tetap menjadi catatan utama (*source of truth*), payment gateway hanya sebagai fasilitator transaksi.  
* **Geo-Location Services (OpenStreetMap/Google Maps):** Untuk mendukung `geo_context`. *Prioritas:* Menggunakan OpenStreetMap untuk menjaga kedaulatan data wilayah, Google Maps hanya jika akurasi *commercial-grade* diperlukan.  
* **LLM/AI APIs (OpenAI/Gemini):** Untuk *parsing* teks WhatsApp, klasifikasi kategori item, atau ringkasan laporan kas. *Catatan:* Data pribadi warga (PII) dilarang dikirimkan ke model AI eksternal.

## **III. Policy for External Dependencies**

AI Coder dan Pengembang wajib mematuhi aturan berikut saat mengintegrasikan layanan baru:

1. **Adapter Pattern Enforcement:** Dilarang memanggil API pihak ketiga secara langsung di dalam kode logika bisnis (misal: memanggil SDK Midtrans langsung di komponen React). Wajib melalui *Service Adapter* atau *Serverless Function* yang terpisah.  
2. **Circuit Breaker Logic:** Jika layanan pihak ketiga (misal: Payment Gateway) mengalami gangguan, sistem wajib beralih ke *Graceful Degradation* (Mode Manual) secara otomatis. Transaksi tidak boleh *hang* hanya karena API luar *down*.  
3. **Data Masking Policy:** Sebelum data dikirim ke API eksternal (terutama AI atau Analytics), wajib dilakukan proses *anonymization* atau *masking* terhadap informasi identitas pribadi (PII). Hanya data yang diperlukan (misal: *item\_type* atau *amount*) yang boleh dikirim.

## **IV. Management & Cost Control**

* **Cost Monitoring:** Setiap pemanggilan API yang berbayar (seperti AI token atau SMS Gateway) wajib dipantau melalui *dashboard* operasional.  
* **Regional Sovereignty:** Prioritaskan layanan yang memiliki *data center* lokal atau mematuhi regulasi perlindungan data pribadi (UU PDP Indonesia) untuk menjaga kedaulatan data warga.

## **V. Integrasi Workflow (For AI Coder)**

Cuplikan kode  
graph LR  
    System\[URUN System\] \--\>|Abstraction Layer| Adapter\[API Adapter / Service\]  
    Adapter \--\>|Request| Vendor\[External Vendor\]  
      
    style Adapter fill:\#f9f,stroke:\#333,stroke-width:2px

*Instruksi untuk AI Coder:* "Saat Anda perlu mengintegrasikan layanan baru (misal: pengiriman email, notifikasi, atau payment), buatlah interface abstrak terlebih dahulu. Jangan pernah melakukan *hardcode* SDK spesifik vendor ke dalam logika bisnis utama. Jika vendor berubah, hanya `Adapter` yang perlu diubah, bukan keseluruhan `Ledger` atau `Catalog` engine".

Dengan dokumentasi ini, URUN mempertahankan fleksibilitas untuk berevolusi. Jika di masa depan Anda memutuskan untuk membangun *server* sendiri (Self-hosting) atau berpindah ke teknologi lain, infrastruktur URUN sudah siap untuk di-migrasi tanpa mengorbankan integritas data komunitas.

