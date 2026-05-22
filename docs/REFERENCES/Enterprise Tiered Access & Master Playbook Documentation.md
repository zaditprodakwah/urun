# **URUN Enterprise Tiered Access System & Master Playbook**

### ***Unified Specification, Security Verification Checklist, and Ready-to-Use Legal Copies***

## **1\. STRUKTUR SPESIFIKASI: 5-LAYER TIERED ACCESS SYSTEM**

Sistem keamanan URUN dikunci rapat menggunakan konsep *Privacy-by-Design* yang membagi hak akses ke dalam 5 lapisan vertikal. Semakin tinggi tingkatannya, semakin abstrak dan anonim data yang dapat dilihat untuk menjamin kepatuhan penuh terhadap **UU PDP No. 27/2022**.

### **1.1 Layer 1: System & Infrastructure Tier (Founder / DevOps)**

* **Aktor Utama:** Founder, Co-Founder Teknis, DevOps Engineer.  
* **Ruang Lingkup:** Global penuh (seluruh simpul sistem).  
* **Metode Otentikasi:** Menggunakan token service\_role privat (rahasia server) untuk mem-bypass *Row-Level Security* (RLS). Tidak boleh diakses langsung dari antarmuka web (Frontend) klien.  
* **Hak Akses Data:** Membaca dan menulis ke semua 13 tabel basis data, memantau log kesalahan, serta memelihara parameter sistem global.  
* **Aturan Keamanan Tambahan:** Setiap eksekusi kueri oleh service\_role yang berinteraksi dengan data sensitif warga wajib mencatat jejak audit secara otomatis ke dalam audit\_log.

### **1.2 Layer 2: Business Intelligence (BI) & Executive Tier (Investor / C-Level)**

* **Aktor Utama:** Komisaris, Investor, Co-Founder Non-Teknis, C-Level Executives.  
* **Ruang Lingkup:** Global agregat (tidak berorientasi pada data individu).  
* **Metode Otentikasi:** Akun terautentikasi dengan peran khusus investor yang dialokasikan pada tabel community\_members.  
* **Hak Akses Data:** *Read-only* pada *Materialized Views* yang telah disiapkan secara khusus.  
* **Aturan Keamanan Tambahan:** **Dilarang keras mengakses data PII (Personally Identifiable Information).** Sistem secara fisik menyaring nama warga, nomor telepon, alamat, dan deskripsi transaksi dari pandangan eksekutif. Hanya statistik pertumbuhan kuantitatif makro yang dapat dibaca.

### **1.3 Layer 3: Oversight & Compliance Tier (Auditor / Pemerintah)**

* **Aktor Utama:** Auditor Independen, Pengawas Eksternal, Auditor Pemerintah Daerah.  
* **Ruang Lingkup:** Regional atau yurisdiksi administratif tertentu.  
* **Metode Otentikasi:** Akun terautentikasi dengan peran auditor.  
* **Hak Akses Data:** Mengakses ringkasan kepatuhan serta melakukan pengecekan kriptografis (*Hash Chain Validation*) pada tabel ledger untuk memverifikasi bahwa data historis tidak pernah dimanipulasi (*immutability check*).  
* **Aturan Keamanan Tambahan:** Transaksi ditampilkan dalam bentuk hash tersandikan tanpa menampilkan identitas personal warga pelaku transaksi.

### **1.4 Layer 4: Community Operational Tier (Local Gatekeeper)**

* **Aktor Utama:** Pengurus Komunitas (Ketua RT, Ketua RW, Bendahara).  
* **Ruang Lingkup:** Lokal terbatas (hanya pada community\_id komunitas mereka sendiri).  
* **Metode Otentikasi:** Akun terverifikasi dengan peran pengurus atau admin pada tabel community\_members.  
* **Hak Akses Data:** Manajemen daftar warga lokal, input kas manual, pengelolaan tender, dan eksekusi antrean persetujuan konsensus Multi-Sig.  
* **Aturan Keamanan Tambahan:** RLS mengunci akses secara mutlak. Pengurus RT 01 dilarang keras membaca data ledger atau daftar warga milik RT 02\.

### **1.5 Layer 5: User & Consumer Tier (Warga / Merchant)**

* **Aktor Utama:** Warga (Member) dan Merchant/Tenan Lokal.  
* **Ruang Lingkup:** Personal terbatas (hanya data milik diri sendiri dan data publik komunitas).  
* **Metode Otentikasi:** Akun terverifikasi dengan peran warga atau merchant yang terikat pada profil mereka.  
* **Hak Akses Data:** Membaca profil pribadi, riwayat iuran mandiri, rekam reputasi sosial, serta berpartisipasi dalam program patungan pengadaan barang (Tender).  
* **Aturan Keamanan Tambahan:** Data transaksi warga lain tidak dapat dilihat secara langsung kecuali dalam bentuk agregat statistik transparansi kas publik.

## **2\. CHECKLIST VERIFIKASI SILANG (UNTUK AI CODER)**

Sebelum mengeksekusi perubahan kode pada Backend (Supabase SQL) maupun Frontend (Next.js components), **AI Coder wajib memverifikasi silang** kepatuhan berikut terhadap berkas migrasi aktif:

### **2.1 Verifikasi Struktur Database (13 Tabel Utama)**

* \[ \] **Tabel profiles:** Pastikan field consent\_timestamp dan consent\_version tersedia dan diisi saat pendaftaran warga baru sebagai bukti kepatuhan UU PDP.  
* \[ \] **Tabel communities:** Pastikan kolom JSONB settings memiliki konfigurasi batas atas Multi-Sig default (multisig\_threshold).  
* \[ \] **Tabel community\_members:** Pastikan terdapat CHECK (role IN ('warga', 'pengurus', 'admin', 'investor', 'auditor')) untuk mencegah injeksi peran palsu.  
* \[ \] **Tabel ledger:** Pastikan tidak ada hak UPDATE atau DELETE yang diberikan pada tabel ini. Cek ketersediaan trigger ledger\_immutability\_guard.  
* \[ \] **Tabel multisig\_requests:** Pastikan kolom amount memiliki kekangan CHECK (amount \> 0).

### **2.2 Verifikasi Aturan Pembagian Keuangan (Formula 70/30)**

Dalam kalkulasi pembagian hasil komisi eksternal, sistem harus menggunakan matematika integer murni tanpa desimal untuk mencegah kehilangan presisi desimal komputer (*fractional loss*):

![][image1]![][image2]Formula ini menjamin bahwa tidak akan ada sisa ![][image3] Rupiah pun yang tertinggal dari transaksi pembagian.

* \[ \] **Verifikasi Kode:** Cari RPC process\_affiliate\_commission di berkas migrasi Supabase Anda dan pastikan operasi matematika pembagian menggunakan pembulatan integer ke bawah (floor).

### **2.3 Verifikasi Kebijakan RLS (Row-Level Security)**

Pastikan kebijakan RLS pada database Supabase menggunakan struktur helper berikut untuk menghemat konsumsi memori kueri (*query cost optimization*):

\-- Kebijakan RLS Warga membaca ledger miliknya sendiri  
CREATE POLICY warga\_self\_history\_only ON public.ledger  
FOR SELECT  
TO authenticated  
USING (  
    actor\_id \= (  
        SELECT id   
        FROM public.community\_members   
        WHERE profile\_id \= auth.uid() AND role \= 'warga'  
    )  
);

* \[ \] **Verifikasi Kode:** Cari trigger trg\_reputation\_on\_ledger dan pastikan penambahan skor reputasi bertambah sesuai event transaksi keuangan yang sah.

## **3\. DRAF DOKUMEN MASTER TERSEGMEN (*READY-TO-USE*)**

Berikut adalah salinan dokumen panduan hukum dan operasional yang telah disegmentasikan berdasarkan target audiensnya. Berikan dokumen ini ke AI Coder untuk dirender langsung ke halaman web terkait.

### **3.1 Panduan & Syarat Ketentuan Warga (Layer 5\)**

*Target Audiens: Warga Lingkungan RT/RW.*

*Gaya Bahasa: Hangat, Ringan, Transparan, Bebas Jargon.*

*Lokasi Render Frontend: /kebijakan-privasi atau Pesan Selamat Datang WhatsApp Bot.*

📢 URUN Warga: Gotong Royong Digital di Tangan Anda

Selamat datang di URUN\! Platform ini dirancang khusus untuk mengembalikan kedaulatan   
ekonomi dan ketenangan sosial ke lingkungan tempat tinggal Anda. 

1\. Uang Anda Tetap di Lingkungan Anda  
Setiap iuran bulanan yang Anda bayarkan tidak pernah disimpan oleh perusahaan URUN.   
Uang Anda langsung ditransfer ke rekening resmi RT/RW komunitas Anda. URUN hanyalah   
buku catatan kas digital transparan yang memastikan tidak ada satu rupiah pun   
uang Anda yang hilang atau disalahgunakan tanpa sepengetahuan Anda.

2\. Belanja yang Membangun Lingkungan (Prinsip 70/30)  
Setiap kali Anda berbelanja kebutuhan pokok atau menggunakan jasa di katalog URUN,   
Anda mendapatkan harga terbaik. Lebih dari itu, komisi belanja dari toko luar akan   
ditangkap oleh sistem dan dibagi secara adil:  
\- 70% Komisi disalurkan langsung ke Kas RT Anda untuk perbaikan jalan, pos ronda, atau acara sosial.  
\- 30% Komisi dialokasikan sebagai biaya operasional platform URUN agar sistem kami tetap aman dan berjalan.

3\. Kami Menjaga Data Pribadi Anda (Kepatuhan UU PDP No. 27/2022)  
URUN berjanji untuk menjaga data pribadi Anda:  
\- Nama, nomor WhatsApp, dan riwayat iuran Anda terkunci aman hanya di dalam server komunitas Anda sendiri.  
\- Kami tidak akan pernah menjual data pribadi Anda atau mengirimkan iklan spam yang mengganggu ke nomor WhatsApp Anda.

### **3.2 Operational Policy & Guidelines Pengurus (Layer 4\)**

*Target Audiens: Ketua RT, Ketua RW, dan Bendahara.*

*Gaya Bahasa: Struktural, Kredibel, Melindungi, dan Administratif.*

*Lokasi Render Frontend: Dashboard Pengurus /dashboard/settings atau Panduan Manual.*

🛡️ Piagam Pengurus Lingkungan Berdaulat URUN

URUN dirancang untuk meringankan beban administrasi Anda, mengotomatiskan pembukuan,   
serta melindungi reputasi dan nama baik Anda dari prasangka buruk pengelolaan kas warga.

1\. Prosedur Penerimaan Kas yang Transparan  
\- Pembayaran Digital: Pengurus wajib memprioritaskan iuran warga menggunakan kode QRIS   
  otomatis yang terintegrasi dengan WhatsApp Bot. Transaksi ini tercatat otomatis oleh sistem.  
\- Pembayaran Tunai: Jika ada warga senior yang membayar tunai, Bendahara wajib mencatatnya   
  di dashboard pada hari yang sama dengan memilih profil warga terdekat sebagai "Saksi Input" digital.

2\. Sistem Persetujuan Bersama (Multi-Sig Consensus)  
Untuk melindungi pengurus dari tuduhan penyelewengan sepihak, setiap pengeluaran kas di atas Rp500.000 (threshold) wajib disetujui secara Multi-Sig:  
\- Pengeluaran di bawah Rp500.000 dapat dicatat langsung oleh Bendahara.  
\- Pengeluaran di atas Rp500.000 akan berstatus "Tertahan" oleh sistem. Dana baru akan   
  cair secara resmi jika Ketua RT dan satu Pengurus lainnya memberikan persetujuan   
  digital dengan menekan tombol "Setuju" di aplikasi atau membalas pesan WhatsApp bot dengan perintah \`\#approve \<id\_transaksi\>\`.

3\. Ritual Rekonsiliasi Kas Bulanan  
Setiap tanggal 1 awal bulan, Bendahara wajib mencocokkan total saldo pada ledger digital URUN   
dengan sisa saldo riil di bank komunitas. Hasil rekonsiliasi wajib diterbitkan langsung   
ke warga lengkap dengan foto kuitansi bukti pengeluaran fisik.

### **3.3 Terms of Reference (TOR) & Legal Policy (Layer 2 & 3\)**

*Target Audiens: Investor, Komisaris, Mitra Korporasi, dan Auditor Pemerintah.*

*Gaya Bahasa: Formal, Komprehensif, Mengutamakan Manajemen Risiko & Regulasi.*

*Lokasi Render Frontend: /syarat-ketentuan (TOS / Term of Service Resmi).*

🏛️ URUN Corporate Terms of Service & Regulatory Compliance Policy

Dokumen ini mengikat secara hukum bagi seluruh mitra ritel, investor institusional,   
dan auditor pengawas eksternal dalam ekosistem PT Prisma Digital Kreatif (URUN).

1\. Batasan Hukum Klasifikasi Jasa Keuangan (Mitigasi Regulasi OJK & BI)  
URUN menegaskan posisinya secara legal sebagai penyedia perangkat lunak manajemen administrasi   
internal (SaaS) dan bukan merupakan Penyelenggara Jasa Sistem Pembayaran (PJSP) maupun   
lembaga penghimpun dana masyarakat.   
\- Arsitektur Non-Custodial: Semua aliran dana fisik mengalir langsung dari bank warga menuju   
  rekening resmi bank komunitas melalui API Payment Gateway berlisensi OJK/BI.   
\- Mirror Ledger: Seluruh data saldo di dalam platform URUN murni bertindak sebagai   
  representasi pencatatan log administratif digital (Mirroring transaction matrix) dan tidak   
  dapat dikategorikan sebagai simpanan perbankan.

2\. Penegakan Privasi & Enkapsulasi Data (UU PDP No. 27/2022)  
Sistem URUN menerapkan arsitektur database multi-tenant yang diisolasi ketat menggunakan   
PostgreSQL Row-Level Security (RLS). Hak akses data diatur sebagai berikut:  
\- Investor & Executive: Hanya diizinkan membaca data agregasi makro statistik pertumbuhan   
  bisnis tanpa akses ke informasi pribadi warga (PII \- Personally Identifiable Information).  
\- Auditor Pemerintah: Diizinkan mengakses visualisasi data kepatuhan regional dan   
  verifikasi integritas ledger berbasis hash tanpa pembongkaran data identitas warga.  
\- Pengurus Lokal: Akses penuh untuk mengolah data kas, daftar warga, dan otorisasi Multi-Sig   
  terbatas hanya pada wilayah yurisdiksi komunitas mereka (Strict community\_id filtering).

3\. Penanganan Transaksi Bermasalah & Sengketa Kas (Audit Mismatch)  
Jika terjadi selisih pencatatan antara saldo bank fisik dengan ledger digital, status   
komunitas akan memasuki fase karantina audit. Rekonsiliasi perbaikan data wajib ditulis   
melalui entri ledger korektif baru yang ditandatangani oleh minimal 2 pengurus sah,   
dan dilarang keras memodifikasi baris ledger historis yang sudah tersimpan di database.  


[image1]: <data:image/png;base64,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>

[image2]: <data:image/png;base64,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>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAaCAYAAACO5M0mAAAAdElEQVR4XmNgGLqAGV0AGTDLy8vXAPF/IM5ClwQDoMQNIF4nKyvrh1chMhhCCnPQxTEASKGcnFwuujgGgCrMQxfHACCFCgoKBejiGACqsBBdHAVISUmJQD3Tgy4HBkCJ1UD8GoifAPFjKP0SiH+hqx0FlAEAbf4mssC/SGQAAAAASUVORK5CYII=>