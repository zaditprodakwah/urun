# 10_system_architecture

# **`10_system_architecture.md`**

**Status:** *Advanced System Design Blueprint* | **Audience:** *AI Coder & System Architect*

## **I. High-Level Architecture**

URUN mengadopsi arsitektur **Event-Driven Serverless** yang dipadukan dengan **Resilient Edge Intelligence**. Sistem tidak mengandalkan server tradisional yang berjalan terus-menerus, melainkan merespons *event* secara otonom untuk mencapai efisiensi biaya dan ketahanan operasional.

### **Komponen Utama:**

* **Frontend (The Interface):** Next.js (App Router) yang di-deploy di Vercel. Fokus pada performa *client-side* dan *static generation*.  
* **Backend & Auth (The Source of Truth):** Supabase (PostgreSQL). Implementasi **Row-Level Security (RLS)** adalah mekanisme utama untuk isolasi data antar-komunitas.  
* **Communication Layer (The Lobby):** API WhatsApp yang dihubungkan ke *Webhook Handler* sebagai gerbang interaksi natural warga.  
* **Compute & Automation (The Engine):** \* Vercel Edge Functions untuk logika bisnis *real-time*.  
  * GitHub Actions / Cron Jobs untuk tugas administratif otonom.

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

*Instruksi untuk AI Coder:* "Pastikan setiap fungsi basis data mencantumkan validasi `community_id`. Gunakan RLS Supabase sebagai pertahanan utama. Hindari penyimpanan sesi yang berat; gunakan token JWT dari Supabase Auth yang terintegrasi native".

