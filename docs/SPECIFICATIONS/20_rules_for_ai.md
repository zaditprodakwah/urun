# 20_rules_for_ai

# **`20_rules_for_ai.md`**

**Status:** *Operational Governance & Code of Conduct* | **Audience:** *AI Coder, Developer, Stakeholder*

## **I. The URUN Constitution (Mandat Inti)**

Setiap baris kode, arsitektur, atau keputusan strategis yang diambil dalam pengembangan URUN wajib mematuhi 20 aturan berikut tanpa pengecualian.

### **A. Filosofi & Etika (Core Sovereignty)**

1. **Community-First:** Setiap fitur wajib memberikan manfaat nyata bagi komunitas (RT/RW/afinitas). Jika fitur tidak membantu warga mengelola aset atau ekonomi mereka, **jangan dibangun**.  
2. **Anti-Ekstraktif:** Dilarang mengumpulkan data warga untuk dijual ke pihak ketiga. Privasi adalah aset komunitas yang tidak bisa diperjualbelikan.  
3. **Legal-Agnostic Design:** URUN harus dapat dijalankan sebagai Yayasan (non-profit), PT (profit), maupun perorangan. Jangan pernah melakukan *hardcode* logika kepemilikan entitas ke dalam kode inti.  
4. **No Walled Garden:** URUN adalah infrastruktur publik digital. Semua data harus dapat diekspor oleh komunitas kapan saja. Tidak ada *vendor lock-in*.

### **B. Arsitektur & Keamanan Data (Data Stewardship)**

5. **Strict Multi-Tenant Isolation:** Setiap tabel **WAJIB** memiliki kolom `community_id`. Setiap query SQL wajib menyertakan filter `community_id` yang divalidasi oleh kebijakan RLS (Row-Level Security) Supabase. **Dilarang keras hardcode `community_id` dengan nilai statis** di dalam kode—community_id harus selalu dibaca dari sesi pengguna yang terautentikasi.
6. **Ledger-First Principle:** Semua perubahan status keuangan wajib tercatat di tabel `ledger` dengan tipe data `DECIMAL` (bukan float). Kode tidak boleh melakukan update saldo secara manual di tabel profil.
7. **Stateless Logic:** *Edge Functions* tidak boleh menyimpan status di memori. Semua status harus ditarik dari basis data (source of truth).
8. **Graceful Degradation:** Sistem wajib berfungsi dalam "Mode Manual" jika layanan pihak ketiga (Payment Gateway/AI API) mengalami gangguan. Transaksi komunitas tidak boleh berhenti.
9. **Audit-First:** Tidak ada aksi sistematis yang tidak tercatat. Setiap interaksi kunci harus memiliki *audit trail* di `interaction_log` atau `ledger`.
10. **Session JWT via `jose`:** Autentikasi sesi wajib menggunakan cookie `urun_session` yang ditandatangani dengan library `jose` (HS256, `SESSION_SECRET`). Dilarang menggunakan Supabase Phone Auth atau autentikasi pihak ketiga lain untuk sesi OTP WhatsApp.
11. **No Hardcoded Secrets:** Semua kunci/token (CRON_SECRET, SESSION_SECRET, FONNTE_TOKEN, SUPABASE_SERVICE_ROLE_KEY) wajib dibaca dari `process.env`. Tidak boleh ada fallback string, placeholder, atau nilai default di dalam source code.

### **C. SEO, AEO, & GEO (Growth Engineering)**

10. **Public-by-Default (Catalog):** Katalog barang/jasa harus terbuka bagi *crawler* mesin pencari. Gunakan kebijakan RLS untuk memisahkan data publik dan privat.  
11. **JSON-LD Schema Markup:** Setiap `catalog_item` wajib memiliki implementasi JSON-LD (Schema.org) yang dinamis, ditarik langsung dari kolom `metadata` (JSONB).  
12. **Geo-Context Integrity:** Gunakan kolom `geo_context` di tabel `communities` untuk mendukung *Local Search* (GEO). Setiap konten publik wajib menyematkan konteks lokasi untuk kepentingan SEO lokal.  
13. **Anti-Invasive Tracking:** Dilarang menyuntikkan script pelacak pihak ketiga yang memanen data individu (GA/Meta Pixel). Gunakan analitik *first-party* (internal SQL logs) untuk melacak pertumbuhan.

### **D. Coding Standards & Scalability**

14. **Polymorphic Data:** Gunakan kolom `metadata` (JSONB) pada `catalog_items` atau `workflow_processes` untuk menyimpan atribut unik. Dilarang menambah kolom tabel secara fisik untuk fitur-fitur yang tidak universal.
15. **Adapter Pattern:** Integrasi dengan pihak ketiga (Payment, WA API) wajib menggunakan *Service Adapter*. Dilarang keras melakukan *hardcode* SDK spesifik di dalam komponen UI atau logika inti.
16. **Minimalist Payload:** API wajib mengembalikan respons JSON yang minimal. Gunakan *caching* (SWR/React Query) di frontend untuk mereduksi *traffic* pada jaringan seluler yang lambat.
17. **Idempotency:** Setiap transaksi `POST` ke `ledger` wajib menggunakan `idempotency_key` untuk mencegah duplikasi data saat terjadi kegagalan jaringan.  
18. **Centralized Helpers:** Fungsi utility yang digunakan lebih dari satu tempat (misal: `sendWhatsappMessage`, `formatIDR`, `formatPhoneNumber`) **WAJIB** dipusatkan di `src/lib/` (contoh: `src/lib/whatsapp.ts`). Dilarang menduplikasi logika yang sama di dalam file route individual.  
19. **No Drizzle ORM:** `drizzle-orm` dan `drizzle-kit` **telah dihapus** dari proyek. Gunakan `@supabase/supabase-js` client secara langsung untuk semua interaksi database. Jangan instal kembali Drizzle.  
20. **No BigInt Literal Suffixes (Anti-Fractional Loss):** Dilarang keras menulis literal BigInt menggunakan suffix `n` (contoh: `70n`, `30n`, `100n`) di dalam seluruh codebase TypeScript/JavaScript. Selalu gunakan constructor standard `BigInt(val)` (contoh: `BigInt(70)`, `BigInt(30)`, `BigInt(100)`). Hal ini untuk memastikan kode runtime tetap kompatibel 100% dengan build target ES yang lebih rendah (lower target standards) pada konfigurasi Next.js/Webpack dan tidak menyebabkan kegagalan static build compiler.

### **E. User Interaction & Resilience**

21. **WhatsApp-First UX:** Setiap fitur yang kompleks wajib memiliki *mirror* fungsional di WhatsApp. Jangan memaksa warga membuka web jika aksi bisa diselesaikan dengan teks sederhana.  
22. **Accessibility (A11y):** Setiap komponen UI wajib lolos pengujian *screen-reader* dan memiliki rasio kontras yang sesuai standar WCAG AAA.  
23. **Documentation Sync:** Setiap kali arsitektur berubah, AI wajib memperbarui `10_system_architecture.md` atau `11_data_schema.md`. Dokumentasi adalah bagian dari kode; kode tanpa dokumentasi adalah hutang teknis.
24. **OptimizedImage Wrapper Mandate (LCP & Web Vitals):** Dilarang keras menggunakan tag HTML biasa `<img>` secara langsung untuk merender gambar, baik di halaman dasbor admin, panel M&E, maupun halaman katalog publik. Penggunaan tag `<img>` telanjang akan merusak nilai Largest Contentful Paint (LCP) Google Core Web Vitals dan memicu warning pemblokiran ESLint. Wajib menggunakan komponen pembungkus premium `OptimizedImage` (`src/components/OptimizedImage.tsx`) yang mengemas `Image` Next.js dengan dukungan fallback domain dinamis dan sanitasi string URL yang tangguh.

## **II. Sanksi & Kepatuhan**

* **Zero Tolerance:** Pelanggaran terhadap aturan "Isolasi Tenant" (kebocoran data antar komunitas) adalah **pelanggaran fatal** yang mewajibkan *refactoring* segera.  
* **Mandatory Review:** Setiap PR (Pull Request) yang mengubah `ledger` atau `RLS Policies` wajib melalui *double-check* oleh pengembang senior atau *AI Audit Tool*.

*Instruksi untuk AI Coder:* "Sebelum menulis kode untuk fitur baru, periksa daftar ini. Jika fitur yang Anda rencanakan melanggar aturan di atas (misal: melakukan hardcode API key, atau melupakan filter `community_id`), Anda **wajib** mengubah pendekatan Anda sebelum memulai eksekusi."

