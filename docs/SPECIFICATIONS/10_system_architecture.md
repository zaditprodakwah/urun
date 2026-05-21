# 10_system_architecture

# **`10_system_architecture.md`**

**Status:** *Advanced System Design Blueprint* | **Audience:** *AI Coder & System Architect*

## **I. High-Level Architecture**

URUN mengadopsi arsitektur **Event-Driven Serverless** yang dipadukan dengan **Resilient Edge Intelligence**. Sistem tidak mengandalkan server tradisional yang berjalan terus-menerus, melainkan merespons *event* secara otonom untuk mencapai efisiensi biaya dan ketahanan operasional.

### **Komponen Utama:**

* **Frontend (The Interface):** Next.js 16 (App Router, Turbopack) yang di-deploy di Vercel. Fokus pada performa *client-side* dan *static generation*.
* **Authentication (The Gate):** Sistem OTP kustom berbasis WhatsApp via Fonnte. Tidak menggunakan Supabase Auth native—sesi pengguna dikelola melalui cookie `urun_session` yang ditandatangani secara kriptografis menggunakan library `jose` (HS256, `SESSION_SECRET`). Middleware `src/proxy.ts` memverifikasi sesi di Edge sebelum setiap request protected route.
* **Backend & Auth (The Source of Truth):** Supabase (PostgreSQL). Implementasi **Row-Level Security (RLS)** adalah mekanisme utama untuk isolasi data antar-komunitas.
* **Communication Layer (The Lobby):** API WhatsApp yang dihubungkan ke *Webhook Handler* sebagai gerbang interaksi natural warga dan pengiriman OTP.
* **Compute & Automation (The Engine):**
  * Vercel Edge Functions untuk logika bisnis *real-time*.
  * Vercel Cron Jobs untuk tugas administratif otonom (reconcile harian, digest mingguan, pengingat tender harian).

## **II. Advanced Resilience & Intelligence Layer**

Sistem mengintegrasikan lapisan tambahan untuk memastikan ketahanan (*resilience*) dan kecerdasan yang menjaga privasi.

* **Offline-First Resilience (CRDTs):** Menggunakan **CRDTs (Conflict-free Replicated Data Types)** untuk sinkronisasi data *local-first*. Input warga/pengurus tetap berjalan saat koneksi internet terputus dan melakukan sinkronisasi otomatis saat terhubung kembali tanpa konflik data.  
* **Federated Intelligence:** Analisis kebutuhan (tren harga/kebutuhan) dilakukan melalui *Federated Learning*. AI melatih model secara lokal di *edge*, hanya mengirimkan bobot model ke server pusat untuk menjaga privasi transaksi mentah warga.  
* **Financial Multi-Sig Governance:** Keamanan transaksi bernilai besar (di atas ambang batas) wajib melalui persetujuan multi-tanda tangan (*multi-sig approval*) dari pengurus RT via bot WhatsApp sebelum eksekusi `ledger`.  
* **Decentralized Identity (DID):** Implementasi identitas berbasis DID untuk memastikan warga memiliki kedaulatan penuh atas ID mereka, memungkinkan portabilitas reputasi lintas komunitas tanpa bergantung pada *cloud provider*.

## **III. Data Flow & Communication**

1. **Input Layer:** Warga berinteraksi via Web UI, WhatsApp, atau *Sync Engine* (saat offline).  
2. **Logic Layer:** *Edge Functions* memvalidasi *request*, memeriksa RLS, dan memproses logika bisnis, termasuk validasi *Multi-Sig* untuk transaksi.  
3. **Storage Layer:** Data disimpan di Supabase, dipisahkan berdasarkan `community_id`.  
4. **External Integration:** AI melakukan *parsing* otomatis terhadap data eksternal (marketplace/tender lokal) melalui *scraper* otonom.

### **Component Diagram (Logical View)**

Cuplikan kode

graph TD

    User\[Warga/Pengurus\] \--\>|Request| WA\[WhatsApp API\]

    User \--\>|Request| UI\[Next.js Frontend\]

    User \--\>|Offline Input| Sync\[Sync Engine / CRDTs\]

      

    WA \--\>|Webhook| Edge\[Edge Functions\]

    UI \--\>|API Request| Edge

    Sync \--\>|Sync| Edge

      

    Edge \--\>|Read/Write| DB\[(Supabase \- PostgreSQL)\]

    Edge \--\>|Trigger| Automation\[GitHub Actions / Cron\]

    Edge \--\>|Multi-Sig| Approval\[Approval Bot\]

      

    Automation \--\>|Maintenance| DB

## **IV. Public Rendering & SEO/AEO Pipeline**

Pemisahan *pipeline* untuk optimalisasi performa dan pencarian:

* **Public Catalog Pipeline (SEO/AEO):**  
  * Halaman katalog publik menggunakan **ISR/SSR**.  
  * *Edge Functions* menyuntikkan JSON-LD (Schema Markup) secara dinamis ke dalam HTML untuk mendukung GEO/AEO.  
* **Authenticated Transaction Pipeline:**  
  * Interaksi `ledger` atau profil pengguna menggunakan *client-side rendering* terotentikasi (JWT).  
  * Crawler dibatasi (via `robots.txt` dan `noindex`) untuk menjaga privasi finansial.

## **V. Design Constraints for AI (Architectural Logic)**

AI Coder wajib mematuhi aturan berikut saat merancang sub-sistem:

1. **Isolasi Komunitas:** Setiap tabel **WAJIB** memiliki kolom `community_id`. Setiap *query* (SELECT/INSERT/UPDATE) **WAJIB** menyertakan filter `community_id` yang divalidasi oleh kebijakan RLS.  
2. **Stateless Logic:** *Edge Functions* harus bersifat *stateless*. Semua status harus ditarik dari basis data.  
3. **Graceful Degradation:** Jika API pihak ketiga tidak tersedia, sistem tetap berjalan dengan "Mode Manual".  
4. **Minimalist Payload:** Penggunaan *caching* (SWR/React Query) pada Frontend adalah kewajiban untuk merespons jaringan seluler yang lambat.

## **VI. Scalability & Global Readiness**

* **Horizontal Partitioning:** Basis data dapat di-*shard* berdasarkan `community_id` jika jumlah komunitas mencapai ribuan tanpa mengubah arsitektur inti.  
* **Protocol-First Development:** Setiap modul (Ledger, Stok, Tender) wajib dibangun sebagai *Service* independen yang dapat dipanggil oleh SDK pihak ketiga atau Bot, memastikan interoperabilitas protokol.

## **VII. Kemitraan & Integrasi Afiliasi Eksternal (Epic 4)**

Untuk mempercepat pertumbuhan kas warga tanpa menambah beban iuran, URUN mengintegrasikan sistem Callback Webhook Kemitraan Afiliasi Eksternal (seperti marketplace lokal atau agregator produk digital).

### **1. Alur Transaksi & Bypass Multi-Sig**
* **Dana Masuk Simpul RT/RW:** Berbeda dengan dana keluar dari kas warga yang memerlukan otorisasi Multi-Sig (Escrow) dari pengurus, komisi afiliasi diklasifikasikan sebagai **inbound revenue**. Oleh karena itu, pencatatan Ledger bagi hasil langsung diproses secara otomatis tanpa memerlukan antrean/persetujuan Multi-Sig (`multisig_status = 'not_required'`).
* **Double-Entry Split (70/30):** Setiap komisi yang sukses langsung dipecah di tingkat transaksi atomik database:
  * **70% Kas Warga (`community_share`):** Arah dana masuk (`direction = 'in'`) ke kas komunitas yang bersangkutan.
  * **30% Biaya Platform URUN (`platform_revenue`):** Arah dana keluar (`direction = 'out'`) sebagai biaya operasional platform.

### **2. Lapisan Keamanan Webhook Edge**
* **Otentikasi Kriptografis HMAC-SHA256:** Endpoint webhook memverifikasi keaslian payload menggunakan header `X-Urun-Signature` yang dihitung dari *raw request body* menggunakan kunci rahasia `SESSION_SECRET` dari environment variable.
* **Mitigasi Replay Attack:** Validasi ganda berbasis waktu dengan membandingkan nilai `X-Urun-Timestamp` (header) dan waktu server saat ini. Selisih waktu maksimal yang diizinkan adalah **300 detik**. Jika melebihi batas tersebut, request ditolak dengan HTTP 401 Unauthorized secara langsung.
* **Idempotency Garansi:** UUID `idempotency_key` diverifikasi secara ketat untuk mencegah double-spend/duplikasi data akibat network retries.

### **3. Optimasi Media & Kinerja Visual (LCP)**
* Katalog URUN menggunakan komponen pembungkus premium `OptimizedImage` (`src/components/OptimizedImage.tsx`) yang mengintegrasikan tag `<Image>` dari Next.js untuk mencegah kegagalan LCP (Largest Contentful Paint) Google Core Web Vitals, sembari mempertahankan fleksibilitas parsing dinamis untuk URL domain eksternal secara aman.

*Instruksi untuk AI Coder:*
1. Pastikan setiap fungsi basis data mencantumkan validasi `community_id` yang dibaca dari sesi JWT—DILARANG hardcode ID komunitas.
2. Gunakan RLS Supabase sebagai pertahanan utama antar komunitas.
3. Autentikasi sesi menggunakan cookie `urun_session` ditandatangani `jose`. Jangan gunakan Supabase Auth native untuk alur OTP WhatsApp.
4. Middleware `src/proxy.ts` adalah penjaga sesi di Edge Runtime. Setiap halaman protected (dashboard, admin, multisig) harus melewati verifikasi di sini.
5. `community_id` harus selalu diekstrak dari session token, bukan dari query parameter, body request, or nilai hardcoded.
6. Gunakan komponen pembungkus `OptimizedImage` daripada tag `<img>` biasa untuk seluruh rendering visual gambar di dasbor dan halaman publik.
7. Seluruh kalkulasi bagi hasil atau presisi aritmatika wajib ditangani dengan `BigInt(x)` constructor untuk menghindari kehilangan angka desimal/pecahan (Anti-Fractional Loss) pada level kode runtime, dan dilarang keras menggunakan literal `xn` guna mencegah kegagalan build pada target kompilasi ES yang lebih rendah.

