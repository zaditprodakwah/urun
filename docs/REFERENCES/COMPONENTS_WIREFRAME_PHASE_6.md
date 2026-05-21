# ARCHITECTURAL WIREFRAME & CONTENT COPY SPECIFICATION: PHASE 6

**Fase:** Phase 6 — Platform Completion  
**Target:** Struktur Kerangka (Wireframe) & Naskah Konten Publik Terpadu  
**Karakter Desain:** Dark-Emerald Glassmorphism UI, Mobile-First, ARIA Accessible, Silo-Optimized  
**Konteks Sistem:** URUN sebagai Sistem Operasi Mikro-Komunitas Berdaulat (*Sovereign Micro-Community Operating System*) tingkat RT/RW/Paguyuban, mencakup Kedaulatan Finansial, Data/Privasi, dan Demokrasi Lokal.

---

## ── I. LAYOUT GLOBAL UTAMA (SHARED LAYOUT STRUCTURE) ──

### 1. BILAH NAVIGASI: NAVBAR UTAMA (`src/components/Navbar.tsx`)
#### Kerangka Komponen (Responsive Wireframe Layout)
```
[DESKTOP VIEW]
+---------------------------------------------------------------------------------------------------------+
| [SVG LOGO] URUN      Beranda     Katalog     Leaderboard     Tentang     Kontak     [CTA / USER DROPDOWN] |
+---------------------------------------------------------------------------------------------------------+

[MOBILE VIEW]
+---------------------------------------------------------------------------------------------------------+
| [SVG LOGO] URUN                                                                             [HAMBURGER] |
+---------------------------------------------------------------------------------------------------------+
```
#### Elemen Konten & Logika Sesi Dinamis (Session-Aware)
* **Kiri (Brand Ikon):** Komponen `<Link href="/">` membungkus logo vektor dinamis (Warna: Emerald `#34d399` dengan efek bayangan berpendar) diikuti teks tipografi tebal `URUN`.
* **Tengah (Navigasi Silo):** Akses penjelajahan antar-kanal publik. Tautan aktif mendapatkan gaya visual khusus (`text-emerald-400 border-b-2 border-emerald-500` pada desktop) untuk kepatuhan navigasi mandiri.
* **Kanan (Autentikasi Sesi):**
    * *Kondisi Sesi Kosong (Anonim):* Tombol aksi tunggal bertuliskan **"Masuk Komunitas"** mengarah ke rute `/login`.
    * *Kondisi Sesi Terverifikasi (Logged In):* Menampilkan kartu mikro identitas pengguna berisi avatar lingkaran (inisial nama), nama pendek warga, dan ikon `ChevronDown`. Ketika dipicu, memunculkan menu dropdown melayang (*glassmorphic grid*) dengan rincian:
        * Baris Info Kecil: `"Dedikasi: X ★ | Peran: [Warga/Pengurus/Admin]"`
        * Tautan 1: `/dashboard` (Dashboard Saya & Manajemen Hak Data)
        * Tautan 2 (Khusus Hak Akses Pengurus/Admin): `/admin` (Pusat Kendali Pengurus)
        * Tombol Aksi Kritis: `Keluar Sesi` (Memicu pemutusan token `supabaseBrowser.auth.signOut()`).

---

### 2. KAKI HALAMAN: FOOTER GLOBAL (`src/components/Footer.tsx`)
#### Kerangka Komponen (Desktop Grid View)
```
+---------------------------------------------------------------------------------------------------------+
| [KOLOM 1: IDENTITAS & KEPATUHAN]  | [KOLOM 2: KANAL UTAMA] | [KOLOM 3: LEGALITAS DATA] | [KOLOM 4: ONBOARDING]   |
| URUN - Sistem Operasi             | • Beranda Utama        | • Kebijakan Privasi (PDP) | Ingin mendirikan        |
| Mikro-Komunitas Berdaulat.        | • Katalog Program      | • Syarat & Ketentuan (ToS)| simpul pengurus mandiri  |
|                                   | • Papan Dedikasi Warga | • Pusat Data Mandiri      | di RT/RW Anda?          |
| [Badge: Patuh UU PDP No.27/2022]  | • Tentang Gerakan Kami | • Daftar Pengurus Baru    | +---------------------+ |
| [Badge: Infrastruktur Otonom 🇮🇩] |                        |                           | | [CTA: Hubungi Kami] | |
|                                   |                        |                           | +---------------------+ |
+---------------------------------------------------------------------------------------------------------+
| © 2026 URUN. Hak Cipta Dilindungi Undang-Undang.                 | Dibangun dengan dedikasi untuk Indonesia 🇮🇩 |
+---------------------------------------------------------------------------------------------------------+
```
#### Integrasi Salinan Teks (Copywriting Naskah)
* **Teks Filosofi Kolom 1:** *"Sistem Operasi Mikro-Komunitas digital berdaulat. Menegakkan transparansi keuangan kolektif, perlindungan privasi siber, dan penguatan demokrasi lokal di tingkat akar rumput tanpa pelacakan komersial."*
* **Lencana Kepatuhan Hukum (CSS Styled Badges):**
    * *Lencana 1:* `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20` $ightarrow$ Teks: `"Patuh UU PDP No. 27/2022"`
    * *Lencana 2:* `bg-zinc-900 text-zinc-400 border border-zinc-800` $ightarrow$ Teks: `"Infrastruktur Otonom 🇮🇩"`

---

## ── II. PENINGKATAN LAYOUT UTAMA: HOMEPAGE (`src/app/page.tsx`) ──

### Kerangka Struktur Beranda Utama (Atas ke Bawah)
```
+---------------------------------------------------------------------------------------------------------+
|                                              SECTION 1: HERO                                            |
|                [Lencana: Sistem Operasi Mikro-Komunitas Berdaulat Tingkat RT/RW]                        |
|             Heading: Komunitas Berdaulat, Transparansi Kas Mutlak, Kolaborasi Mandiri.                  |
|             Sub-heading: Kelola iuran wajib, pendanaan infrastruktur gang, dan kekuatan belanja...     |
|             [CTA PRIMER: Lihat Program Aktif]       [CTA SEKUNDER: Pelajari Gerakan]                    |
+---------------------------------------------------------------------------------------------------------+
|                                        SECTION 2: PANEL INDIKATOR DATA                                  |
|   +---------------------------------+  +---------------------------------+  +---------------------------------+ |
|   | Rp 12.450.000                   |  | 100% Immutability               |  | 148 Warga                       | |
|   | Dana Terhemat Kolektif Warga    |  | Rekonsiliasi Kas Live-Audited   |  | Anggota Berdedikasi Aktif       | |
|   +---------------------------------+  +---------------------------------+  +---------------------------------+ |
+---------------------------------------------------------------------------------------------------------+
|                                              SECTION 3: BOT SIMULATOR                                   |
|   +-----------------------------------------+  +----------------------------------------------------------+     |
|   | PANEL KONTROL SIMULATOR (Glosarium)     |  | ANTARMUKA LIVE CHAT BOT WHATSAPP                         |     |
|   | Klik perintah di bawah untuk uji coba:  |  | Menampilkan visualisasi respon real-time dari endpoint  |     |
|   | [#urun] [#kas] [#reputasi] [#approve]   |  | gateway api/webhook/whatsapp/route.ts                    |     |
|   +-----------------------------------------+  +----------------------------------------------------------+     |
+---------------------------------------------------------------------------------------------------------+
|                                     SECTION 4: TIGA LAPIS KEDAULATAN (GRID)                             |
|   +---------------------------------+  +---------------------------------+  +---------------------------------+ |
|   | Kedaulatan Finansial            |  | Kedaulatan Data & Privasi       |  | Kedaulatan Demokrasi            | |
|   | Buku kas kolektif permanen      |  | Bebas iklan komersial. Data     |  | Rembug warga digital otomatis   | |
|   | (ledger) aman dari manipulasi.  |  | terisolasi kaku via RLS         |  | via WhatsApp. Pemungutan suara  | |
|   | Pengaman Multi-Sig pengurus.    |  | tingkat database PostgreSQL.    |  | berbobot dedikasi nyata.        | |
|   +---------------------------------+  +---------------------------------+  +---------------------------------+ |
+---------------------------------------------------------------------------------------------------------+
|                                      SPANDUK PRIVASI PERSETUJUAN UU PDP                                 |
| [Ikon: ShieldCheck] Jaminan Perlindungan Data. URUN mengamankan informasi Anda sesuai UU PDP...          |
|                                                                                  [Tombol: Paham & Sepakat]  |
+---------------------------------------------------------------------------------------------------------+
```

#### Copywriting Konten & Komponen Strategis Halaman Utama
* **Hero Heading Teks:** `"Komunitas Berdaulat, Transparansi Kas Mutlak, Kolaborasi Mandiri."`
* **Hero Sub-heading Teks:** `"URUN mendesentralisasi tata kelola sosial-ekonomi lingkungan bertetangga. Mengamankan uang iuran kas melalui pembukuan permanen, memotong rantai pasok logistik lewat kekuatan beli bersama, serta memvalidasi mufakat tanpa birokrasi rumit—bebas dari kapitalisme pengawasan iklan."`
* **Spanduk Persetujuan Privasi (Privacy Consent Banner):**
    * *Logika:* Komponen melayang (*sticky overlay*) berbasis client-side state. Jika `localStorage.getItem("urun_pdp_consent")` tidak ditemukan, banner wajib merender visualisasi kaca di bawah layar. Klik "Paham & Sepakat" mengunci nilai persetujuan dan menutup banner.
    * *Naskah Teks Spanduk:* `"Situs ini menggunakan arsitektur Kedaulatan Data tanpa pelacak komersial atau kuki iklan pihak ketiga. Seluruh informasi pribadi Anda dilindungi ketat di level basis data sesuai regulasi UU PDP No. 27/2022. Dengan melanjutkan penelusuran, Anda menyatakan sepakat dengan Syarat & Ketentuan serta Kebijakan Privasi kami."`

---

## ── III. DRAFT HALAMAN INSTITUSIONAL & LEGAL (EEAT BUILDER) ──

### 1. HALAMAN MANIFESTO & TENTANG GERAKAN (`src/app/tentang/page.tsx`)
* **Section 1: Hero Manifesto**
    * *Judul Utama:* `"Membangun Kedaulatan di Tingkat Akar Rumput."`
    * *Naskah Konten:* `"URUN didirikan bukan untuk menjadi raksasa teknologi komersial baru, melainkan sebuah utilitas digital netral yang memulangkan kendali keuangan, privasi data, dan hak suara ke dalam genggaman komunitas lokal (RT/RW/Paguyuban). Kami mengganti sistem algoritma adiktif dengan protokol kegotongroyongan."`
* **Section 2: Penjabaran 3 Pilar Utama (Teks Narasi Konstitusi kaku)**
    1.  *Local Data Stewardship:* `"Kedaulatan data berada sepenuhnya di tangan komunitas lokal. Seluruh data nomor WhatsApp, profil identitas, dan mutasi saldo warga diisolasi mutlak menggunakan kebijakan Row-Level Security (RLS) di level database PostgreSQL untuk mencegah pencurian data komersial."`
    2.  *Collective Efficiency:* `"Memangkas kebocoran ekonomi di tingkat lingkungan dengan memotong margin perantara besar, menghubungkan simpul langsung ke penyedia terpercaya, serta mengembalikan 70% surplus bagi hasil pengelolaan langsung ke dalam kas internal komunitas."`
    3.  *Human-Centric Resilience:* `"Sistem operasi yang ringkas, tanpa intervensi iklan, dan ramah terhadap perangkat seluler lama. Mendukung arsitektur lokal penyelarasan mandiri (local-first state) untuk memastikan pencatatan keuangan tetap tangguh berjalan di area internet marginal."`
* **Section 3: Grid 7 Aturan Keamanan Komunitas**
    * Menampilkan kartu-kartu visual ringkas dari Aturan 01 sampai 07 (Kedaulatan Data, Akuntansi Kas Permanen, Minimisasi Data, Skor Dedikasi Linier, Kuorum Multi-Pengurus, Sinyal Bahaya Rekonsiliasi, dan Hak Portabilitas Data).

---

### 2. HALAMAN KEBIJAKAN PRIVASI (`src/app/kebijakan-privasi/page.tsx`)
* **Struktur Visual:** Komponen *Accordion Collapse Grid* (Klik baris judul untuk membuka isi konten teks).
* **Naskah Konten Perlindungan Hukum Warga (Patuh UU PDP No. 27/2022):**
    * *Judul Baris 1:* `"A. Prinsip Minimisasi Pengumpulan Data"`
    * *Isi Baris 1:* `"Kami hanya memproses data pribadi warga yang benar-benar esensial untuk fungsi operasional kas komunal dan validasi logistik tender. Data tersebut terbatas pada: Nama lengkap, nomor telepon WhatsApp aktif untuk pengiriman kode akses sesi, serta penanda wilayah geografis RT/RW domisili Anda."`
    * *Judul Baris 2:* `"B. Jaminan Sterilitas dari Pelacakan Komersial (No-Spy)"`
    * *Isi Baris 2:* `"Sistem URUN tidak menanam kuki iklan, Google Analytics, Meta Pixel, atau SDK pelacak pihak ketiga mana pun. Kami tidak merekam durasi ketukan layar, riwayat penelusuran internet, maupun ulasan produk luar Anda. Data Anda aman dari spionase profiling komersial."`
    * *Judul Baris 3:* `"C. Hak Portabilitas dan Hak untuk Dilupakan (Deletion)"`
    * *Isi Baris 3:* `"Warga memegang kendali penuh atas datanya sendiri. Anda berhak mengunduh seluruh salinan riwayat aktivitas iuran Anda dalam bentuk file dokumen JSON standar dari halaman dasbor profil. Apabila Anda mengajukan penghapusan akun (pindah domisili), sistem akan menghapus total PII Anda dari database utama. Demi integritas neraca kas warga lainnya, catatan nominal transaksi kas historis Anda di ledger akan tetap dipertahankan, namun identitas nama Anda dianonimkan secara permanen menjadi 'Warga_Anonim' sehingga tidak dapat diidentifikasi kembali kepada diri Anda."`

---

### 3. HALAMAN SYARAT & KETENTUAN LAYANAN (`src/app/syarat-ketentuan/page.tsx`)
* **Struktur Visual:** Komponen *Accordion List* interaktif.
* **Naskah Konten Syarat dan Ketentuan (ToS):**
    * *Judul Baris 1:* `"A. Keanggotaan Berbasis Verifikasi Lokal"`
    * *Isi Baris 1:* `"Untuk menjaga validitas komunitas, akun Anda didaftarkan secara resmi oleh pengurus simpul setempat yang berwenang. Warga bertanggung jawab penuh atas keamanan nomor WhatsApp pribadinya. Setiap perintah komando teks yang dikirimkan dari nomor kontak Anda dianggap sebagai keputusan sah yang diambil secara sadar."`
    * *Judul Baris 2:* `"B. Ketetapan Pembukuan Kas Permanen (Immutable Ledger)"`
    * *Isi Baris 2:* `"Setiap mutasi kas iuran wajib, iuran infrastruktur jalan, atau pencairan tender bersama yang telah divalidasi akan terkunci secara permanen. Demi menjaga integritas dari manipulasi keuangan, data kas tidak dapat dihapus atau diubah secara sepihak. Pembetulan kesalahan wajib dilakukan melalui transaksi pembalik (entri koreksi nilai plus/minus baru) secara terbuka agar jejak audit tetap dapat dilacak utuh oleh sesama warga."`
    * *Judul Baris 3:* `"C. Pengaman Finansial Multi-Pengurus (Multi-Sig Gate)"`
    * *Isi Baris 3:* `"Setiap pengajuan pencairan atau pengeluaran kas bernilai besar yang melampaui ambang batas aman komunitas (default di atas Rp 5.000.000) secara otomatis akan ditahan oleh sistem ke dalam status antrean Multi-Sig. Transaksi hanya akan dilepaskan secara otomatis ke ledger apabila minimal 2 (dua) orang pengurus yang sah membubuhkan tanda tangan digital persetujuan dalam jendela waktu 24 jam."`

---

### 4. HALAMAN HUBUNGI KAMI & FAQ (`src/app/kontak/page.tsx` — Onboarding Funnel)
* **Komponen 1: Formulir Pengajuan Onboarding Simpul Baru (Kiri)**
    * *Judul Formulir:* `"Daftarkan Simpul Komunitas Baru"`
    * *Fields:* Input Nama Inisiator Warga, Input Nomor WhatsApp Aktif, Input Nama Komunitas (contoh: Paguyuban Warga RT 03/RW 11), Dropdown Pilihan Wilayah Provinsi, Textarea Rencana Pemanfaatan Sistem.
    * *CTA Tombol:* `"Kirim Formulir Pengajuan Akses"` $ightarrow$ Memicu penyimpanan data aman ke `workflow_processes` berstatus `DRAFT`.
* **Komponen 2: Panel FAQ & Akses Langsung DPO (Kanan)**
    * *FAQ 1:* `"Apakah data kas lingkungan kami dapat dilihat oleh komunitas lain?"` $ightarrow$ Jawaban: `"Tidak. Berdasarkan kebijakan Row-Level Security (RLS) database PostgreSQL kami, data kas, profil, dan log aktivitas komunitas Anda terisolasi kaku dan hanya dapat diaudit secara transparan oleh warga yang terdaftar di dalam simpul komunitas Anda sendiri."`
    * *FAQ 2:* `"Bagaimana jika terjadi sengketa fisik terkait kualitas pengadaan barang?"` $ightarrow$ Jawaban: `"URUN bertindak murni sebagai utilitas digital otonom untuk pencatatan keuangan dan komunikasi. Segala bentuk perselisihan fisik terkait kualitas barang diselesaikan secara mufakat oleh pengurus, warga, dan penyedia melalui musyawarah musyawarah mufakat lokal."`
    * *Kanal Kontak DPO:* Menyediakan tombol pintas darurat beraksen neon border yang maut langsung ke tautan `https://wa.me/628123456789` khusus untuk melaporkan pelanggaran privasi data atau konten melanggar hukum langsung ke *Data Protection Officer* URUN (Komitmen SLA takedown cepat maksimal 1x24 jam).

---

## ── IV. LAYOUT PENANGANAN PEMULIHAN SISTEM (RECOVERY LAYOUTS) ──

### 1. HALAMAN CUSTOM 404 (`src/app/not-found.tsx`)
* **Visualisasi:** Tipografi bersih bertema gelap minimalis.
* **Naskah Narasi Penyelamatan:** `"Halaman Tidak Ditemukan. Sepertinya koordinat gang, balai pertemuan warga, atau program urunan dana yang Anda tuju belum terdaftar di dalam peta spasial sistem operasi simpul komunitas."`
* **Tombol Aksi Pemulihan:** `<Link href="/">` dirunduk dalam tombol CSS premium: `[ Kembali ke Pusat Komando Utama ]`.

### 2. REACT ERROR BOUNDARY SYSTEM (`src/app/error.tsx`)
* **Kondisi:** *Client Component* (`"use client"`) yang menerima properti parameter `error: Error` dan `reset: () => void`.
* **Naskah Narasi Penyelamatan:** `"Sistem Sedang Memulihkan Diri. Terjadi pemutusan sementara pada gerbang runtime serverless atau gangguan sinkronisasi basis data otonom lokal."`
* **Tombol Aksi Penyelamatan:** Tombol interaktif bertuliskan `[ Segarkan Antarmuka Sesi Warga ]` yang memicu pemanggilan fungsi `reset()` untuk memulihkan status rendering layout global.