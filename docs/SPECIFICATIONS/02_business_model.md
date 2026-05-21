# 02_business_model

# **`02_business_model.md`**

**Status:** *Operational & Scalability Blueprint* | **Audience:** *Founder & AI Core Logic*

## **I. Filosofi Bisnis: "Legal-Agnostic Sovereign Core"**

URUN dirancang sebagai entitas yang **independen terhadap struktur hukum**. Baik dijalankan secara perseorangan (solo founder), Yayasan (non-profit), maupun PT (profit), logika arus uang dan nilai tetap sama.

Strategi kami menggunakan konsep **"Sovereign Core, Adaptable Perimeter"**:

* **Sovereign Core (Yayasan/Inti):** Mengelola protokol, data warga, dan infrastruktur publik. Bagian ini menjaga integritas dan kepercayaan.  
* **Adaptable Perimeter (Unit Bisnis/PT/Operasional):** Mengelola arus kas komersial, *sponsorship*, dan *marketplace fee*. Bagian ini memberikan fleksibilitas operasional seperti startup.

## **II. Model Pendapatan (Hybrid Revenue Portfolio)**

Model ini dirancang agar Anda bisa memulai dari nol (solo) hingga memiliki badan hukum yang kompleks.

### **A. Sovereign Revenue (Internal Core)**

*Pendapatan ini melekat pada nilai utility URUN bagi komunitas.*

1. **Collective Procurement Fee (Efficiency Fee):** Margin efisiensi dari transaksi grosir. Saat Anda masih sendiri, margin ini adalah "cuan" dari efisiensi yang Anda fasilitasi. Saat menjadi Yayasan/PT, ini menjadi sumber operasional protokol.  
2. **Community SaaS (Flat-Fee):** Biaya pemeliharaan infrastruktur *fixed cost* per komunitas/RT. Ini adalah model *recurring revenue* yang paling stabil.  
3. **Escrow & Trust Services:** Biaya flat untuk penjaminan transaksi. Semakin tinggi volume transaksi komunitas, semakin besar stabilitas kas operasional Anda.

### **B. Adaptable Perimeter (Startup/Profesional Growth)**

*Fitur ini fleksibel; bisa diaktifkan/dinonaktifkan sesuai kebutuhan hukum dan sosial Anda.*

1. **Contextual Placement Sponsorship:** Ruang promosi bagi UMKM/vendor lokal yang relevan. Sangat efektif saat Anda bertransisi menjadi PT (Badan Usaha).  
2. **Platform Service Fee (Marketplace Fee):** Biaya layanan untuk transaksi C2C/B2C. Besaran persentase (misal 1-5%) ditentukan melalui *Governance Logic* di Dasbor Pengurus.  
3. **Data-as-a-Service (Analytics):** Penyediaan data tren kebutuhan komunitas (agregat anonim) bagi distributor/produsen besar (misal: "Analisis konsumsi beras di wilayah X"). Ini adalah nilai jual premium saat Anda sudah memiliki banyak komunitas/RT.

## **III. Skalabilitas Entitas (Solo \-\> Entity)**

Bagaimana cara URUN beradaptasi dengan perubahan legalitas Anda:

| Aspek | Perseorangan (Solo) | Yayasan \+ PT (Entity) |
| ----- | ----- | ----- |
| **Pengelolaan Data** | Dikelola secara mandiri | Dikelola oleh "Sovereign Core" (Yayasan) |
| **Arus Kas** | Langsung ke rekening pribadi/bisnis | Unit bisnis PT menyetor ke Yayasan/Operasional |
| **Akuntabilitas** | Kepercayaan personal | Kepercayaan hukum/audited |
| **Monetisasi** | Eksperimental (Fokus pada SaaS) | Formal (Sponsorship, DaaS, Fee) |

*Catatan untuk AI:* AI tidak perlu mengubah kode *ledger* saat entitas berubah. AI cukup mengubah konfigurasi `revenue_destination_account` di dalam fungsi RPC database.

## **IV. Mandat untuk AI Coder**

AI wajib memastikan kode tetap mematuhi prinsip **"Legal-Agnostic"**:

1. **Fee Configuration:** Bangun fungsi `get_revenue_settings()` yang mengambil konfigurasi dari database. Jangan pernah melakukan *hardcode* ke mana uang masuk. `System` harus bisa diarahkan apakah uang masuk ke rekening pribadi (perseorangan), rekening unit bisnis (PT), atau rekening yayasan.  
2. **Transparent Audit:** "Setiap sen yang masuk dari *sponsorship* atau *service fee* wajib tercatat di `ledger` dengan `entry_type = 'platform_revenue'`. AI harus memastikan kolom ini tidak bisa di-edit oleh pengurus (immutable)".  
3. **Adaptive UI:** Jika fitur *Sponsorship* diaktifkan (melalui admin panel), dasbor harus otomatis menampilkan *slot* iklan. Jika dimatikan (misal untuk komunitas yang ingin 100% non-profit/yayasan murni), UI harus otomatis bersih (tanpa iklan).  
4. **Data Stewardship:** Meskipun Anda berubah menjadi PT, AI dilarang menjual data individu. AI hanya boleh memproses *data agregat* untuk model pendapatan *Data-as-a-Service*.

### **Strategi Eksekusi untuk Anda:**

1. **Fase Perseorangan:** Fokus pada *SaaS Flat-Fee* dan *Collective Procurement*. Ini memberikan Anda bukti konsep (Proof of Concept) tanpa perlu badan hukum yang rumit.  
2. **Fase Entitas:** Saat Anda sudah memiliki banyak komunitas/RT, daftarkan **Yayasan** untuk memegang protokol (melindungi data warga) dan **PT** untuk mengelola *Revenue* (iklan & fee).

