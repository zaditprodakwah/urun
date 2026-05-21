# **PRODUCT REQUIREMENT DOCUMENT (PRD), ERD, & USER STORIES**

## **SISTEM OPERASI MIKRO-KOMUNITAS BERDAULAT: URUN ENGINE (FASE PIVOT)**

## **I. PRODUCT REQUIREMENT DOCUMENT (PRD)**

### **1\. Visi & Filosofi Sistem (Bukan Toko Online Biasa)**

URUN adalah **Sistem Operasi Mikro-Komunitas Berdaulat (Sovereign Micro-Community OS)**, bukan platform *e-commerce* retail komersial. Platform ini menolak model bisnis ekstraktif dan eksploitasi data warga. Segala interaksi transaksi berorientasi pada ketahanan lokal, gotong royong, dan kedaulatan ekonomi wilayah tingkat RT/RW/Komunitas.

Untuk keluar dari citra "toko online amatir," kita melakukan reposisi fungsional:

* **Etalase Gotong Royong (Cooperative Directory):** Bukan tempat warga menghabiskan uang secara konsumtif untuk barang mewah, melainkan direktori pemenuhan kebutuhan pokok harian warga (pangan, jasa lokal, peralatan bersama) yang dikelola secara kekeluargaan.  
* **Alat Penemu Harga Adil (Price Discovery Tool):** Fungsi *Marketplace Parser* yang tadinya dominan diubah menjadi fitur penunjang audit. Warga atau Pengurus RT menggunakan parser ini hanya untuk mengimpor referensi harga luar sebagai tolok ukur sebelum membuka *Pengadaan Bersama* demi mencegah manipulasi harga dari tengkulak luar.  
* **Dana Talangan & Pengadaan Bersama (Collective Procurement):** Jantung pertahanan ekonomi URUN. Warga berkumpul untuk patungan membeli aset produktif (misal: genset RT, tenda duka) atau sembako dalam skala besar langsung dari distributor utama untuk memotong rantai keuntungan makelar.  
* **Buku Kas Abadi (Immutable Ledger) & Multi-Sig:** Setiap uang patungan atau komisi yang masuk dari kemitraan luar secara otomatis mengalir ke Ledger Kas Komunitas secara transparan, yang hanya bisa dicairkan melalui persetujuan Multi-Signature (tanda tangan digital terverifikasi) dari minimal 2 pengurus RT yang sah.

### **2\. Pilar Arsitektur & Kepatuhan**

Sistem ini wajib mematuhi **3 Pilar Utama URUN** & **7 Aturan Suci**:

1. **Data Stewardship (Isolasi Mutlak):** Seluruh data transaksi, ulasan, dan data profil wajib terisolasi kaku menggunakan Row-Level Security (RLS) di tingkat database berdasarkan community\_id. Tidak boleh ada kebocoran data iuran atau konsumsi lintas wilayah RT/RW.  
2. **Collective Efficiency (Efisiensi Kolektif):** Pengurangan biaya transaksi di tingkat lokal menggunakan alur pemesanan langsung antar-warga tanpa komisi platform pihak ketiga (Direct peer-to-peer via WhatsApp).  
3. **Human-Centric Resilience (Ketahanan Manusiawi):** Antarmuka yang cerah, ramah bagi orang tua (*accessible*), menggunakan bahasa lokal non-jargon, dan toleran terhadap koneksi internet lambat melalui optimasi pengiriman data (SWR & offline sync).

### **3\. Detail Spesifikasi Modul Utama**

#### **Modul A: Etalase Gotong Royong (Katalog Fleksibel & Terdesentralisasi)**

* **Aksi Pembelian Fleksibel (Hybrid Checkout):**  
  * **Tipe 1: Pesan Lewat WhatsApp Warga (WhatsApp Form):** Pemilik barang mengaktifkan form interaktif kustom (nama, alamat RT, varian, jumlah). Ketika tetangga menekan tombol "Pesan", sistem memicu dialog popup untuk diisi, memvalidasinya, dan mengonversinya menjadi pesan WhatsApp terstruktur yang otomatis terkirim langsung ke nomor penjual. Tidak ada penahanan dana oleh sistem untuk tipe ini (0% platform fee, 100% kedaulatan penjual).  
  * **Tipe 2: Tautan Kemitraan Kas Warga (External Link):** Jika barang harus dibeli dari marketplace luar, tombol akan mengarah ke Tokopedia/Shopee menggunakan tautan afiliasi etis. Yang membedakan: **70% komisi transaksi luar ini dialokasikan langsung ke Kas RT/RW (Community Treasury Ledger)** secara transparan, bukan untuk pengembang platform.  
* **Modul Ulasan & Reputasi Warga (Reviews & Ratings):**  
  * Bukan sekadar ulasan komersial biasa, melainkan jaminan akuntabilitas lokal.  
  * Ulasan hanya dapat dikirim oleh warga yang telah terverifikasi keanggotaannya dalam community\_id produk tersebut.  
  * Skor rating rata-rata dikalkulasi secara reaktif dan memengaruhi indeks keaktifan warga (*reputation\_score*) di papan peringkat (*leaderboard*).

#### **Modul B: Pengadaan Bersama (Collective Procurement / Patungan Sembako)**

* Pengurus RT dapat membuka program "Patungan Minyak Goreng" atau "Patungan Beras Sehat".  
* Warga menyetorkan dana patungan yang langsung tercatat secara real-time di Dashboard Ledger.  
* *Price Discovery Helper (Scraper/Parser):* Pengurus RT dapat menempelkan link produk kompetitor dari marketplace luar untuk membuktikan kepada warga bahwa harga patungan kolektif URUN jauh lebih murah dibanding membeli secara eceran mandiri di luar.

## **II. ENTITY-RELATIONSHIP DIAGRAM (ERD)**

Arsitektur database Supabase PostgreSQL harus kokoh, menolak anomali data, dan memiliki performa tinggi pada jaringan buruk melalui indeksasi yang presisi.

\+--------------------------------------------------------------------------+  
|                                COMMUNITIES                               |  
\+--------------------------------------------------------------------------+  
| id (UUID, PK) | name (TEXT) | ledger\_balance (DECIMAL) | created\_at (TZ) |  
\+--------------------------------------------------------------------------+  
                                     |  
                                     | 1:N  
                                     |  
\+--------------------------------------------------------------------------+  
|                                 PROFILES                                 |  
\+--------------------------------------------------------------------------+  
| id (UUID, PK, FK \-\> Auth)                                                |  
| community\_id (UUID, FK \-\> Communities)                                   |  
| name (TEXT) | phone (TEXT, Unique) | reputation\_score (INT)              |  
| role (TEXT: 'warga', 'pengurus', 'admin') | created\_at (TZ)              |  
\+--------------------------------------------------------------------------+  
         |                                |  
         | 1:N                            | 1:N  
         |                                |  
         v                                v  
\+----------------------------+   \+-----------------------------------------+  
|       CATALOG\_ITEMS        |   |             CATALOG\_REVIEWS             |  
\+----------------------------+   \+-----------------------------------------+  
| id (UUID, PK)              |   | id (UUID, PK)                           |  
| community\_id (FK)          |   | product\_id (UUID, FK \-\> Catalog\_Items)  |  
| created\_by (UUID, FK)      |   | user\_id (UUID, FK \-\> Profiles)          |  
| title (TEXT) | slug (TEXT) |   | community\_id (UUID, FK \-\> Communities)  |  
| description (TEXT)         |   | rating (INT, CHECK 1-5)                 |  
| category (TEXT)            |   | comment (TEXT)                          |  
| price (DECIMAL)            |   | created\_at (TZ)                         |  
| status (TEXT)              |   \+-----------------------------------------+  
| checkout\_type (TEXT)       |  
| external\_url (TEXT, Null)  |  
| whatsapp\_fields (JSONB)    |  
| created\_at (TZ)            |  
\+----------------------------+

### **Kamus Data & Constraints Terperinci**

#### **1\. Tabel communities**

Menyimpan entitas wilayah rukun tetangga/komunitas yang berdaulat.

* id (UUID, Primary Key, Default: gen\_random\_uuid())  
* name (TEXT, Not Null) \- Nama wilayah, misal: "RT 04 RW 11 Cikutra"  
* ledger\_balance (DECIMAL(12,2), Default: 0.00) \- Saldo kas RT aktif saat ini  
* created\_at (TIMESTAMPTZ, Default: now())

#### **2\. Tabel profiles**

Menyimpan profil personal warga yang terotentikasi secara ringan lewat nomor WhatsApp.

* id (UUID, Primary Key, Relasi ke auth.users)  
* community\_id (UUID, Foreign Key ke communities.id ON DELETE SET NULL)  
* name (TEXT, Not Null) \- Nama lengkap warga sesuai KTP/KK lokal  
* phone (TEXT, Unique, Not Null) \- Nomor telepon WhatsApp aktif  
* reputation\_score (INT, Default: 100\) \- Indeks keaktifan dan tingkat kepercayaan warga  
* role (TEXT, Default: 'warga') \- Peran otoritas: 'warga', 'pengurus', 'admin'  
* created\_at (TIMESTAMPTZ, Default: now())

#### **3\. Tabel catalog\_items**

Menyimpan direktori barang/jasa kebutuhan warga setempat.

* id (UUID, Primary Key, Default: gen\_random\_uuid())  
* community\_id (UUID, Foreign Key ke communities.id ON DELETE CASCADE)  
* created\_by (UUID, Foreign Key ke profiles.id ON DELETE CASCADE)  
* title (TEXT, Not Null) \- Nama produk/jasa kebutuhan lokal  
* slug (TEXT, Unique, Not Null) \- Tautan ramah SEO/AEO  
* description (TEXT) \- Deskripsi kegunaan barang  
* category (TEXT, Default: 'Umum') \- Kategori: Sembako, Peralatan RT, Jasa Keahlian, Kendaraan  
* price (DECIMAL(12,2), Not Null) \- Harga kesepakatan dalam rupiah  
* status (TEXT, Default: 'active') \- Status item: 'active', 'archived', 'public'  
* checkout\_type (TEXT, Default: 'link\_toko') \- Jenis transaksi: 'link\_toko' atau 'whatsapp\_form'  
* external\_url (TEXT, Nullable) \- Link Tokopedia/Shopee eksternal jika tipe checkout adalah tautan luar  
* whatsapp\_form\_fields (JSONB, Default: '\[\]'::jsonb) \- Definisi kolom dinamis buatan warga untuk formulir WhatsApp  
* created\_at (TIMESTAMPTZ, Default: now())

#### **4\. Tabel catalog\_reviews**

Menyimpan rekam jejak akuntabilitas ulasan produk dalam komunitas.

* id (UUID, Primary Key, Default: gen\_random\_uuid())  
* product\_id (UUID, Foreign Key ke catalog\_items.id ON DELETE CASCADE, Not Null)  
* user\_id (UUID, Foreign Key ke profiles.id ON DELETE CASCADE, Not Null)  
* community\_id (UUID, Foreign Key ke communities.id ON DELETE CASCADE, Not Null)  
* rating (INT, CHECK (rating \>= 1 AND rating \<= 5), Not Null) \- Skor kepuasan  
* comment (TEXT) \- Masukan terbuka dari tetangga pembeli  
* created\_at (TIMESTAMPTZ, Default: now())

## **III. USER STORIES & ACCEPTANCE CRITERIA (AC)**

### **Epic 1: Pendaftaran Barang Dagangan Warga dengan WhatsApp Form Builder**

Sebagai **Warga Produsen Lokal (Penjual)**, saya ingin mendaftarkan barang dagangan saya di direktori komunitas dengan formulir kustom yang terhubung ke WhatsApp, agar saya bisa menerima pesanan langsung secara mandiri tanpa potongan platform.

* **User Story:**  
  * **GIVEN** Saya adalah warga terverifikasi yang berada di halaman dashboard pribadi /dashboard tab "Dagangan Warga".  
  * **WHEN** Saya mengeklik tombol "Tambah Dagangan Baru" dan memilih jenis transaksi "Pesan Lewat WhatsApp (Formulir)".  
  * **THEN** Sistem harus memunculkan pembuat formulir visual (Form Builder) sederhana di mana saya bisa mengaktifkan input wajib (Nama, Alamat RT, Jumlah) dan menambahkan kolom khusus (misal: "Varian Rasa", "Nomor Rumah").  
  * **AND** Saat saya menyimpan barang tersebut, sistem harus memvalidasi data menggunakan Zod di API /api/v1/catalog, menyimpannya ke kolom whatsapp\_form\_fields sebagai struktur JSONB, dan memperbarui daftar dagangan saya secara instan tanpa memuat ulang seluruh halaman menggunakan mutasi SWR.  
* **Kriteria Penerimaan (Acceptance Criteria):**  
  1. Form builder wajib melarang nama kolom menggunakan spasi atau karakter khusus (harus alfanumerik & *lowercase*).  
  2. Kolom whatsapp\_form\_fields di database tidak boleh kosong jika tipe checkout adalah whatsapp\_form (setidaknya berisi parameter nama dan jumlah).  
  3. Aplikasi harus menampilkan status kesalahan validasi yang ramah di sisi klien jika penjual lupa mengisi harga atau deskripsi dasar.

### **Epic 2: Transaksi Pembelian Gotong Royong via Popup WhatsApp**

Sebagai **Warga Tetangga (Pembeli)**, saya ingin membeli barang kebutuhan pokok dari warga lokal melalui formulir popup yang bersih, agar data saya terformat dengan rapi dan langsung meluncur ke chat WhatsApp penjual tanpa perantara.

* **User Story:**  
  * **GIVEN** Saya sedang membuka rute katalog publik /catalog dengan tema hangat, ramah, dan teks kontras tinggi yang mudah dibaca.  
  * **WHEN** Saya mengeklik tombol "Pesan Lewat WhatsApp Warga 💬" pada detail produk bertipe whatsapp\_form.  
  * **THEN** Sistem harus memunculkan jendela dialog popup interaktif (shadcn/ui dialog) yang secara otomatis merender kolom-kolom masukan berdasarkan isi JSONB whatsapp\_fields produk tersebut.  
  * **AND** Setelah saya mengisi seluruh formulir dan menekan "Kirim Pesanan", sistem harus menghasilkan teks pesan terstruktur yang sopan dalam bahasa Indonesia, kemudian membuka tautan universal WhatsApp (wa.me) dengan muatan teks tersebut.  
* **Kriteria Penerimaan (Acceptance Criteria):**  
  1. Modal dialog harus memvalidasi input wajib (Required fields) sebelum memperbolehkan pengiriman pesan.  
  2. Pesan teks WhatsApp yang dihasilkan wajib berisi rincian: nama produk, jumlah pesanan, dan rincian dinamis dari formulir dengan format tanda bintang (\*) untuk tulisan tebal agar mudah dibaca di ponsel penjual paruh baya.  
  3. Tautan WhatsApp wajib menggunakan format nomor internasional yang valid (mengganti awalan 0 dengan 62 pada nomor penjual).

### **Epic 3: Penilaian & Ulasan Produk Berdaulat demi Akuntabilitas Lokal**

Sebagai **Warga Komunitas Terdaftar**, saya ingin memberikan penilaian bintatng dan ulasan jujur pada katalog lokal, agar warga lain tahu kualitas pelayanan penjual demi meningkatkan reputasi kolektif lingkungan kami.

* **User Story:**  
  * **GIVEN** Saya telah melakukan otentikasi valid dengan sesi cookie urun\_session yang aktif.  
  * **WHEN** Saya membuka detail barang di /catalog/\[slug\] dan mengirimkan ulasan (skor 1-5 dan teks komentar).  
  * **THEN** API /api/v1/catalog/\[slug\]/review wajib memvalidasi sesi saya, memverifikasi bahwa saya adalah warga dengan community\_id yang sama dengan produk tersebut, dan menuliskan data ulasan ke tabel catalog\_reviews.  
  * **AND** Sistem secara otomatis menghitung ulang nilai rata-rata rating produk tersebut dan menampilkannya secara instan pada visualisasi katalog publik menggunakan SWR revalidation.  
* **Kriteria Penerimaan (Acceptance Criteria):**  
  1. Sistem harus memblokir pengiriman ulasan dari pengguna anonim (belum login) atau warga dari wilayah RT/RW lain (kebijakan keamanan RLS database wajib di-enforce).  
  2. Kolom rating dibatasi secara ketat hanya bernilai integer antara 1 sampai 5 (validasi Zod \+ check constraint PostgreSQL).  
  3. Setiap kali ulasan berhasil disimpan, nilai rating rata-rata visual produk diperbarui tanpa menyebabkan lag antarmuka bagi pengguna.

### **Epic 4: Transparansi Alokasi Kas & Price Discovery Parser (Helper)**

Sebagai **Pengurus Komunitas (Ketua/Bendahara RT)**, saya ingin menggunakan alat Parser tautan luar hanya untuk membandingkan kewajaran harga pasar grosir luar, serta melihat transparansi aliran komisi kemitraan luar yang langsung mengalir ke Buku Kas RT.

* **User Story:**  
  * **GIVEN** Saya berada di halaman admin pengurus /admin atau area pembuatan Patungan Bersama.  
  * **WHEN** Saya menempelkan tautan produk Tokopedia/Shopee ke kolom "Riset Harga Pasar Luar".  
  * **THEN** Sistem memanggil API parser etis /api/parser secara asinkron, mengekstrak harga pasar luar, dan menampilkannya sebagai grafik pembanding berdampingan dengan harga penawaran lokal di URUN.  
  * **AND** Jika produk luar tersebut didaftarkan sebagai item kemitraan, setiap transaksi yang berhasil menghasilkan komisi afiliasi wajib membagi alokasi: 70% otomatis tercatat di tabel ledger dengan kode akun kas RT (revenue:affiliate:\[nama\_toko\]), dan 30% dialokasikan ke operasional perawatan server URUN.  
* **Kriteria Penerimaan (Acceptance Criteria):**  
  1. Setiap data komisi yang mengalir wajib terintegrasi dengan process\_ledger\_entry yang bersifat *append-only* (tidak dapat diubah atau dihapus secara manual demi integritas data keuangan warga).  
  2. Pernyataan "Kemitraan Kas Warga" wajib ditampilkan secara transparan di bawah tombol checkout tipe link luar agar warga tahu bahwa aktivitas belanja mereka berkontribusi nyata bagi kesejahteraan kas wilayah mereka sendiri.

## **IV. DESAIN ANTARMUKA & SALINAN KATA (COPYWRITING) AUDIENS LOKAL**

Gaya bahasa diubah total untuk merangkul bapak-bapak dan ibu-ibu pengurus lingkungan di Indonesia.

| Istilah Teknis Lama | Salinan Kata Baru Ramah Warga (Sovereign Term) |
| :---- | :---- |
| *JIT Affiliate Link Injection* | **Program Kemitraan Kas Warga** (semua komisi belanja mengalir transparan untuk pembangunan wilayah RT/RW Anda) |
| *Escrow Collective* | **Dana Talangan Bersama** (dana aman dikumpulkan bersama untuk pembelian grosir skala besar) |
| *Public Collective Marketplace* | **Etalase Gotong Royong Warga** (ruang dagang mandiri milik warga sekitar) |
| *Verify Security Session* | **Sesi Validasi Silahturahmi Warga** (pastikan nomor WhatsApp Anda aktif untuk keamanan komunikasi antar tetangga) |

### **Palet Warna Baru: *Industrial-Minimalist Bright/Warm***

* **Latar Belakang:** Latar putih krem hangat yang lembut di mata orang tua (\#FCFBF9 atau \#F5F3EF).  
* **Teks Utama:** Kontras arang gelap pekat (\#18181B) agar mudah dibaca tanpa kaca pembesar.  
* **Warna Aksen Kesejahteraan Komunitas:** Hijau hutan premium (\#15803d / Emerald-700) untuk memberikan nuansa kemakmuran lokal yang berdaulat, bersih, dan tepercaya.

—-

Berikut adalah penjelasan mendalam tentang cara kerja, efektivitas, dan implementasi teknis dari masing-masing sistem tersebut:

### **1\. Community Treasury Ledger (Buku Kas Abadi Komunitas)**

Sistem ini bertindak sebagai satu-satunya kebenaran finansial (*Single Source of Truth*) di tingkat wilayah RT/RW Anda.

* **Bagaimana Sistem Ini Dibangun (Teknis):**  
  Ledger ini dibangun di atas basis data PostgreSQL Supabase dengan tabel *append-only* (hanya bisa menambah data, tidak bisa diubah atau dihapus). Hal ini dikunci menggunakan kebijakan **Row-Level Security (RLS)** tingkat tinggi dan fungsi pemicu database (*database triggers*):  
* SQL

\-- Mencegah aksi UPDATE atau DELETE secara mutlak pada tabel ledger

CREATE POLICY "ledger: immutable\_no\_update" ON ledger FOR UPDATE TO authenticated USING (false);

CREATE POLICY "ledger: immutable\_no\_delete" ON ledger FOR DELETE TO authenticated USING (false);

*   
* Setiap mutasi kas harus dieksekusi melalui *Stored Procedure* atomik bernama process\_ledger\_entry.  
* **Cara Kerja & Efektivitas:**  
  Setiap iuran masuk, transaksi pengadaan, atau komisi yang diperoleh komunitas akan memicu pembuatan baris kas baru dengan tipe akun yang terstruktur (misal: revenue:affiliate atau expense:tender). Efektivitas keamanannya dijaga oleh script harian reconcile\_ledger.ts yang memvalidasi integritas saldo berjalan dengan mencocokkan total debet/kredit harian untuk mendeteksi manipulasi dana secara instan.

### **2\. JIT (Just-In-Time) Affiliate Link Injection (Program Kemitraan Kas Warga)**

Fitur ini adalah cara URUN menghasilkan dana kas mandiri bagi warga tanpa memotong uang transaksi antar-tetangga.

* **Bagaimana Sistem Ini Dibangun (Teknis):**  
  Sistem ini memanfaatkan **Ethical Marketplace Parser** (src/lib/parser.ts) dan rute API dinamis di Next.js (src/app/api/parser/route.ts). Parser mengekstrak kode produk dari tautan luar (seperti Tokopedia atau Shopee) secara etis tanpa mengambil data personal pengguna.  
* **Cara Kerja & Efektivitas:**  
  Saat Pengurus RT atau warga menempelkan tautan produk grosir luar di etalase, sistem secara otomatis (Just-In-Time) menyuntikkan parameter ID Afiliasi Komunitas lokal ke dalam URL tujuan saat tombol "Beli" diklik oleh warga.  
  Ketika transaksi di platform luar tersebut berhasil dan komisi cair, dana komisi didistribusikan melalui skema bagi hasil transparan:  
  $$\\text{Kas RT (Treasury Ledger)} \= 70\\% \\times \\text{Total Komisi}$$  
  $$\\text{Operasional URUN} \= 30\\% \\times \\text{Total Komisi}$$  
  Efektivitas ini memastikan bahwa aktivitas belanja konsumtif warga yang terpaksa dilakukan di luar wilayah tetap berkontribusi balik pada pembangunan fisik kas RT/RW mereka sendiri secara otomatis.

### **3\. Escrow Collective (Dana Talangan Bersama)**

Ini adalah instrumen pengumpulan dana patungan warga untuk pembelian skala besar langsung dari distributor.

* **Bagaimana Sistem Ini Dibangun (Teknis):**  
  Sistem ini dibangun menggunakan mesin alur kerja (*state machine*) di dalam database PostgreSQL (supabase/migrations/.../tenders\_and\_workflows.sql). Skema transaksinya mengikat dana patungan dalam status aman (locked) hingga kuorum pengadaan terpenuhi.  
* **Cara Kerja & Efektivitas:**  
  1. **Pengumpulan:** Warga menyetor iuran patungan sembako. Saldo tertampung sementara di rekening penampungan komunitas yang tercatat di sistem ledger.  
  2. **Pencairan Aman (Multi-Sig):** Dana talangan tersebut tidak dapat dicairkan secara sepihak oleh Ketua RT. Pencairan dana ke distributor luar mewajibkan tanda tangan digital (*Multi-Sig*) dari minimal 2 dari 3 pengurus terdaftar yang divalidasi secara kriptografis menggunakan kunci penandatanganan di /api/multisig/approve.  
  3. **Audit:** Jika pengadaan gagal atau tidak mencapai batas kuorum (misal: patungan beras tidak mencapai target minimum 100 kg), dana warga dijamin kembali 100% ke saldo akun individu masing-masing tanpa potongan sespeser pun.

### **4\. Etalase Gotong Royong Warga (Public Collective Marketplace)**

Sistem direktori lokal hibrida yang menjadi antarmuka utama warga untuk berdagang dan berkolaborasi.

* **Bagaimana Sistem Ini Dibangun (Teknis):**  
  Diretori ini dibangun dengan mengintegrasikan komponen visual Next.js yang terang dan ramah orang tua menggunakan font *Geist* untuk kejelasan visual maksimal. Pada tingkat database, ia menggunakan kolom whatsapp\_form\_fields berformat **JSONB** pada tabel catalog\_items untuk memberikan kebebasan kustomisasi formulir tanpa merusak performa database.  
* **Cara Kerja & Efektivitas:**  
  * **Pemesanan Mandiri Tanpa Komisi:** Penjual (warga lokal) dapat merancang kolom formulir pesanan mereka sendiri (misal: membutuhkan data Nama, No. Rumah, dan Jumlah). Saat tetangga memesan, formulir popup interaktif merangkum data tersebut menjadi pesan WhatsApp yang terformat sangat rapi dan mengirimkannya via tautan universal wa.me langsung ke WhatsApp penjual. Transaksi diselesaikan secara tunai atau transfer mandiri (0% potongan platform).  
  * **Kolaborasi dengan Parser (Price Discovery):** Ketika pengurus ingin memverifikasi kelayakan harga jual di dalam lingkungan RT, mereka menggunakan Parser untuk membandingkan harga etalase gotong royong dengan harga grosir online secara real-time. Hal ini efektif menjaga warga dari kartel harga lokal atau manipulasi margin dari makelar luar.

Dengan implementasi keempat subsistem di atas, URUN tidak lagi menjadi "toko online amatir," melainkan sebuah ekosistem koperasi digital yang mandiri, berdaulat, dan transparan bagi kesejahteraan komunitas lokal.