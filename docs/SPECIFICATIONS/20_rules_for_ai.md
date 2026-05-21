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

5. **Strict Multi-Tenant Isolation:** Setiap tabel **WAJIB** memiliki kolom `community_id`. Setiap query SQL wajib menyertakan filter `community_id` yang divalidasi oleh kebijakan RLS (Row-Level Security) Supabase.  
6. **Ledger-First Principle:** Semua perubahan status keuangan wajib tercatat di tabel `ledger` dengan tipe data `DECIMAL` (bukan float). Kode tidak boleh melakukan update saldo secara manual di tabel profil.  
7. **Stateless Logic:** *Edge Functions* tidak boleh menyimpan status di memori. Semua status harus ditarik dari basis data (source of truth).  
8. **Graceful Degradation:** Sistem wajib berfungsi dalam "Mode Manual" jika layanan pihak ketiga (Payment Gateway/AI API) mengalami gangguan. Transaksi komunitas tidak boleh berhenti.  
9. **Audit-First:** Tidak ada aksi sistematis yang tidak tercatat. Setiap interaksi kunci harus memiliki *audit trail* di `interaction_log` atau `ledger`.

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

### **E. User Interaction & Resilience**

18. **WhatsApp-First UX:** Setiap fitur yang kompleks wajib memiliki *mirror* fungsional di WhatsApp. Jangan memaksa warga membuka web jika aksi bisa diselesaikan dengan teks sederhana.  
19. **Accessibility (A11y):** Setiap komponen UI wajib lolos pengujian *screen-reader* dan memiliki rasio kontras yang sesuai standar WCAG AAA.  
20. **Documentation Sync:** Setiap kali arsitektur berubah, AI wajib memperbarui `10_system_architecture.md` atau `11_data_schema.md`. Dokumentasi adalah bagian dari kode; kode tanpa dokumentasi adalah hutang teknis.

## **II. Sanksi & Kepatuhan**

* **Zero Tolerance:** Pelanggaran terhadap aturan "Isolasi Tenant" (kebocoran data antar komunitas) adalah **pelanggaran fatal** yang mewajibkan *refactoring* segera.  
* **Mandatory Review:** Setiap PR (Pull Request) yang mengubah `ledger` atau `RLS Policies` wajib melalui *double-check* oleh pengembang senior atau *AI Audit Tool*.

*Instruksi untuk AI Coder:* "Sebelum menulis kode untuk fitur baru, periksa daftar ini. Jika fitur yang Anda rencanakan melanggar aturan di atas (misal: melakukan hardcode API key, atau melupakan filter `community_id`), Anda **wajib** mengubah pendekatan Anda sebelum memulai eksekusi."

