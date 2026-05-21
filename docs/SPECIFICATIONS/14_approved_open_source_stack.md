# **Approved Open Source Stack**

**Status:** *Approved Reference* | **Versi:** 1.0.0 | **Tanggal:** 2026-05-21  
**Author:** AI Coder (Antigravity) & System Design Council  
**Target Lingkungan:** Vercel (Edge/Serverless Runtime) & Supabase (PostgreSQL)

---

## **I. Manifes Filosofi Teknologi URUN**

Pemilihan pustaka (*libraries*), perkakas (*tools*), dan kerangka kerja (*frameworks*) di bawah ini tunduk secara kaku pada **3 Pilar Utama URUN**:

1. **Local Data Stewardship (Pilar 1):** Seluruh alat pelacak dan penyimpanan wajib bersifat *self-hosted* atau terenkripsi secara lokal. Tidak ada data pribadi warga yang bocor ke platform iklan eksternal. Data diisolasi penuh di tingkat database menggunakan Row-Level Security (RLS) berbasis `community_id`.
2. **Collective Efficiency (Pilar 2):** Teknologi harus ringan dan efisien guna menekan biaya sewa server hingga mendekati Rp 0 (efisiensi token dan runtime). Optimalisasi biaya komparatif, otomatisasi ledger, serta pembagian keuntungan otomatis 70% kas internal simpul komunitas dan 30% untuk operasional URUN.
3. **Human-Centric Resilience (Pilar 3):** Antarmuka wajib bersahabat untuk ponsel jadul dan koneksi internet marjinal di pelosok daerah. Interaksi berbasis WhatsApp-First UX menggunakan adapter bot gateway yang handal, inklusif, dan tangguh secara offline.

---

## **II. Daftar Tumpukan Teknologi Resmi (Approved Stack)**

AI Coder wajib merujuk secara kaku pada daftar pustaka berikut dan dilarang menginstal modul di luar dokumen ini tanpa persetujuan arsitek sistem.

| Kategori | Pustaka/Alat | Tautan Referensi |
| ----- | ----- | ----- |
| **UI/UX** | Radix Primitives | [radix-ui.com](https://www.radix-ui.com/) |
|  | shadcn/ui | [ui.shadcn.com](https://ui.shadcn.com/) |
|  | Vaul | [github.com/emilkowalski/vaul](https://github.com/emilkowalski/vaul) |
|  | Embla Carousel | [embla-carousel.com](https://www.embla-carousel.com/) |
|  | Framer Motion | [framer.com/motion](https://www.framer.com/motion/) |
| **Data & Logic** | @supabase/supabase-js | [supabase.com/docs/reference/javascript](https://supabase.com/docs/reference/javascript) |
|  | jose | [github.com/panva/jose](https://github.com/panva/jose) |
|  | Supabase Vault | [supabase.com/docs/guides/database/vault](https://supabase.com/docs/guides/database/vault) |
|  | pg\_cron | [github.com/citusdata/pg\_cron](https://github.com/citusdata/pg_cron) |
|  | pgaudit | [github.com/pgaudit/pgaudit](https://github.com/pgaudit/pgaudit) |
|  | ts-pattern | [github.com/gvergnaud/ts-pattern](https://github.com/gvergnaud/ts-pattern) |
|  | Zod | [zod.dev](https://zod.dev/) |
| **SEO, AEO, GEO** | @vercel/og | [vercel.com/docs/functions/og-image-generation](https://vercel.com/docs/functions/og-image-generation) |
|  | Partytown | [partytown.builder.io](https://partytown.builder.io/) |
|  | schema-dts | [github.com/google/schema-dts](https://github.com/google/schema-dts) |
|  | PostGIS | [postgis.net](https://postgis.net/) |
| **Analitik/Legal** | Umami | [umami.is](https://umami.is/) |
|  | Formbricks | [formbricks.com](https://formbricks.com/) |
|  | pg\_anonymizer | [postgresql-anonymizer.com](https://postgresql-anonymizer.com/) |
|  | i18next | [i18next.com](https://www.i18next.com/) |
| **AI Agent/Monev** | Vercel AI SDK | [sdk.vercel.ai](https://sdk.vercel.ai/) |
|  | Langfuse | [langfuse.com](https://langfuse.com/) |
|  | Tremor | [tremor.so](https://www.tremor.so/) |
|  | pgTAP | [pgtap.org](https://pgtap.org/) |
|  | Pino | [getpino.io](https://getpino.io/) |
|  | Signoz | [signoz.io](https://signoz.io/) |

### **1. Antarmuka (Frontend) & UI/UX Aksesibel**

Dirancang untuk menghadirkan kenyamanan interaksi mobile-first yang sehalus aplikasi WhatsApp bagi warga akar rumput.

* **Radix Primitives & shadcn/ui:**  
  * *Fungsi:* Pondasi komponen antarmuka tanpa gaya (*headless*) yang mematuhi standar aksesibilitas internasional (WAI-ARIA).  
  * *Urun Context:* Menjamin kompatibilitas *screen reader* (pembaca layar) bagi warga lansia atau tunanetra di Simpul Komunitas.  
* **Vaul (oleh Emil Kowalski):**  
  * *Fungsi:* Komponen laci bawah (*drawer*) yang dioptimalkan untuk perangkat seluler.  
  * *Urun Context:* Menampilkan opsi partisipasi tender warga dengan nuansa menu laci bawah khas aplikasi WhatsApp untuk mendukung kemudahan aksi.  
* **Embla Carousel:**  
  * *Fungsi:* Karusel geser (*slider*) super ringan tanpa ketergantungan modul berat lainnya.  
  * *Urun Context:* Menampilkan daftar program gotong-royong aktif di layar utama ponsel warga secara mulus tanpa lag.  
* **Framer Motion (Optimized Core):**  
  * *Fungsi:* Animasi transisi tata letak deklaratif yang hemat memori browser.  
  * *Urun Context:* Mengurangi kecemasan tunggu warga saat memproses input transaksi kas pada antarmuka web.  
* **Tailwind Merge & clsx:**  
  * *Fungsi:* Utilitas penggabung kelas Tailwind CSS secara dinamis untuk menghindari konflik visual di runtime.

### **2. Sistem Inti & Logika Data (Backend & DB)**

PostgreSQL dan Next.js Serverless/Edge Runtime dioptimalkan untuk performa ekstrim dan keamanan otonom.

* **@supabase/supabase-js (Client Resmi):**
  * *Fungsi:* Client TypeScript resmi untuk berinteraksi dengan PostgreSQL via PostgREST API dan RLS.
  * *Urun Context:* Semua query tabel (`ledger`, `community_members`, `workflow_processes`) menggunakan client ini secara langsung. **Drizzle ORM telah dihapus** dari dependensi karena redundan — supabase-js sudah mencukupi kebutuhan tipe-safe query dengan dukungan penuh PostgREST filter dan join.
* **jose (JWT Session Signing):**
  * *Fungsi:* Library JWT/JWE/JWS yang sepenuhnya kompatibel dengan Edge Runtime Next.js (tidak bergantung pada Node.js `crypto` module).
  * *Urun Context:* Digunakan untuk menandatangani dan memverifikasi cookie sesi `urun_session` menggunakan algoritma HS256 dengan kunci `SESSION_SECRET`. Wajib digunakan di `src/lib/auth.ts` dan diverifikasi di `src/proxy.ts` (middleware).
* **Supabase Vault (pg\_vault):**
  * *Fungsi:* Ekstensi PostgreSQL untuk enkripsi baris data tingkat tinggi menggunakan algoritma AES-GCM.
  * *Urun Context:* Mengamankan penyimpanan `FONNTE_TOKEN` atau kunci API Google secara terenkripsi langsung di basis data.
* **pg\_cron:**
  * *Fungsi:* Penjadwal tugas kronologis (*cron jobs*) di level PostgreSQL.
  * *Urun Context:* Otomasi penalti reputasi harian dan pembersihan tender kedaluwarsa secara internal di level database tanpa memicu panggilan API eksternal.
* **pgaudit & supautils:**
  * *Fungsi:* Pustaka audit sistem dan pengamanan struktur hak akses *superuser*.
  * *Urun Context:* Melacak kepatuhan manipulasi database untuk dicatat secara kronologis di audit_log.
* **ts-pattern:**
  * *Fungsi:* Pustaka *pattern matching* TypeScript untuk menjamin transisi status yang ketat.
  * *Urun Context:* Mengunci status siklus hidup pada mesin status tabel `tenders` dan `workflow_processes`.
* **Zod:**
  * *Fungsi:* Skema validasi runtime TypeScript yang ketat untuk seluruh muatan payload API / Webhook.

### **3. Core Web Vitals, SEO, & AEO (Akses Informasi)**

Memastikan halaman publik URUN terindeks sempurna di mesin pencari lokal dan dikenali dengan baik oleh mesin kecerdasan buatan (AEO).

* **@vercel/og (Satori Engine):**  
  * *Fungsi:* Pembuat gambar pratinjau (*Dynamic Open Graph Images*) instan berbasis HTML/CSS di Edge Runtime.  
  * *Urun Context:* Menampilkan grafik status pencapaian dana dan kuota tender warga secara visual saat tautan program dibagikan ke WhatsApp.  
* **@builder.io/partytown:**  
  * *Fungsi:* Menjalankan skrip pelacak atau analitik di latar belakang menggunakan *Web Worker*.  
  * *Urun Context:* Menjamin tombol interaksi "Urun Sekarang" merespons instan tanpa terhambat pemrosesan telemetri di browser.  
* **schema-dts:**  
  * *Fungsi:* Tipe data TypeScript untuk Schema.org guna menyusun metadata JSON-LD secara valid.  
  * *Urun Context:* Memudahkan bot pencari AI (seperti Gemini) memberikan jawaban akurat atas pencarian produk lokal warga.  
* **PostGIS (PostgreSQL Extension):**  
  * *Fungsi:* Mesin kalkulasi geospatial di dalam database PostgreSQL.  
  * *Urun Context:* Melakukan kalkulasi pencarian radius komoditas pangan warga terdekat menggunakan fungsi `ST_DWithin`.

### **4. Analitik Berdaulat & Kepatuhan Legal (PDP Compliance)**

Membangun pertumbuhan komunitas yang sehat sekaligus patuh terhadap UU Pelindungan Data Pribadi (UU PDP No. 27/2022).

* **Umami Analytics / Plausible (Self-hosted):**  
  * *Fungsi:* Analitik web super ringan tanpa *cookies* pelacak individu.  
  * *Urun Context:* Mengukur interaksi halaman web agregat tanpa merekam data pribadi sensitif (IP Address disamarkan).  
* **Formbricks:**  
  * *Fungsi:* Pustaka survei mikro dalam aplikasi (*in-app survey*).  
  * *Urun Context:* Mengumpulkan umpan balik warga terhadap pengiriman barang pengadaan oleh penyedia jasa.  
* **postgresql-anonymizer (pg\_anonymizer):**  
  * *Fungsi:* Penyemaran (*masking*) data pribadi tingkat basis data secara dinamis.  
  * *Urun Context:* Menghapus identitas pengguna (PII) secara permanen sesuai regulasi "Hak untuk Dilupakan" jika warga keluar dari komunitas, tanpa merusak data keuangan historis `ledger`.  
* **i18next:**  
  * *Fungsi:* Pustaka pelokalan bahasa untuk menyajikan antarmuka bot dalam bahasa daerah (Sunda, Jawa, dsb.).

### **5. AI Agent & Observabilitas Bot WhatsApp**

Memantau integritas Bot WhatsApp agar tidak mengalami halusinasi dan merespons warga secara deterministik.

* **Vercel AI SDK (@ai-sdk/react):**  
  * *Fungsi:* SDK standar untuk mengalirkan respons kecerdasan buatan (*streaming responses*).  
  * *Urun Context:* Mengatur aliran data respons model bahasa ke gerbang Fonnte tanpa terkena kendala serverless timeout.  
* **Langfuse (Open Source LLM Platform):**  
  * *Fungsi:* Pemantau dan pelacak biaya token AI, latensi, serta evaluasi performa model.  
  * *Urun Context:* Melacak kepatuhan bot asisten dalam merespons perintah transaksi kas warga agar tetap berada dalam koridor 3 Pilar.

### **6. Visualisasi Dasbor & Telemetri Monev**

Memantau kesehatan infrastruktur serta menampilkan grafik neraca Buku Kas Kolektif secara transparan.

* **Tremor & Recharts:**  
  * *Fungsi:* Komponen visualisasi grafik keuangan berbasis Tailwind CSS yang ramah seluler.  
  * *Urun Context:* Menampilkan grafik sirkulasi surplus kas simpul komunitas yang mudah dipahami warga awam.  
* **pgTAP:**  
  * *Fungsi:* Unit testing database berbasis SQL untuk membongkar dan menguji ketangguhan kebijakan RLS.  
  * *Urun Context:* Menguji ketahanan database secara otomatis di CI/CD sebelum deploy.  
* **Pino:**  
  * *Fungsi:* Logging JSON super cepat untuk memantau waktu respons API Fonnte.  
* **OpenTelemetry (OTel) & Signoz / HyperDX:**  
  * *Fungsi:* Dasbor pemantau infrastruktur (APM) open-source mandiri untuk mendeteksi dini eror webhook sebelum disadari warga.

---

## **III. Formula & Algoritma Deterministik Sistem**

Sesuai **Aturan Sakral #4 (Reputasi Deterministik)**, kalkulasi poin reputasi warga tidak boleh menggunakan faktor kebetulan (*randomness*). AI Coder wajib menerapkan formula linier absolut berikut di level trigger PostgreSQL:

$$R_n = \max(0, R_{n-1} + C_{interaction})$$

Di mana konstanta $C_{interaction}$ dipetakan secara absolut berdasarkan tipe interaksi fisik berikut (terprogram secara deterministik di trigger database `update_reputation_deterministic`):

* **$C_{tender\_contribution\_paid} = +5$** : Transaksi tender sukses dibayar.
* **$C_{tender\_participation} = +3$** : Berpartisipasi aktif dalam tender kolektif (Urun Dana).
* **$C_{successful\_referral} = +2$** : Membawa anggota baru bertransaksi.
* **$C_{violation\_detected} = -10$** : Pelanggaran transaksi / iuran terdeteksi.
* **$C_{fraud\_attempt} = -15$** : Percobaan pemalsuan data transaksi.

---

## **IV. Mandat Mandatori untuk AI Coder**

1. **Gunakan Supabase Client Langsung:** Seluruh interaksi PostgreSQL wajib menggunakan `@supabase/supabase-js` client untuk menjamin keamanan tipe data dan pencegahan SQL Injection. `drizzle-orm` dan `drizzle-kit` telah **dihapus** dari dependensi — jangan instal kembali.
2. **Gunakan `jose` untuk Session Signing:** Semua operasi signing/verifikasi JWT sesi wajib menggunakan library `jose`. Jangan menggunakan library yang memerlukan Node.js runtime `crypto` module karena tidak kompatibel dengan Edge Runtime.
3. **No Extravagant Packages:** Jangan menginstal pustaka di luar dokumen ini tanpa izin. Jika Anda membutuhkan alat utilitas baru, mintalah izin terlebih dahulu.
4. **Kepatuhan RLS & pgTAP:** Sebelum menyelesaikan pekerjaan pengodean database, tulis *unit test* di pgTAP untuk menguji isolasi data `community_id` di bawah kebijakan RLS.
5. **Logging Semua Webhook:** Pastikan setiap payload dari Fonnte divalidasi dengan Zod dan kegagalan respons dicatat dengan Pino.
