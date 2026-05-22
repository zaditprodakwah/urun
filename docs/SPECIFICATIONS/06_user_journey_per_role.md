# 06_user_journey_per_role

**Status:** *Implementation Reference* | **Audience:** *AI Coder, UI/UX Designer, QA*

Dokumen ini memetakan Alur Perjalanan Pengguna (User Journey) secara end-to-end berdasarkan 5 Layer Access yang ada di ekosistem URUN.

---

## LAYER 1: FOUNDER / DEVOPS (SYSTEM TIER)
* **Entry Point:** Supabase Web Console / GitHub Actions Workflow Server-Side.
* **Backend Flow:** Menggunakan `supabase-js` client yang diinisialisasi dengan `SUPABASE_SERVICE_ROLE_KEY`. Kueri otomatis melewati (*bypass*) seluruh kebijakan RLS.
* **Frontend Flow:** Tidak memiliki antarmuka visual khusus di aplikasi web klien demi keamanan.
* **UX Journey:** Menjalankan perintah berbasis teks CLI (*Command Line Interface*) untuk memantau performa, migrasi database, dan kesehatan klaster server.
* **Batasan Akses:** Tidak dapat masuk ke halaman aplikasi web normal menggunakan hak akses khusus ini.

## LAYER 2: INVESTOR / EKSEKUTIF (STRATEGY TIER)
* **Entry Point:** Rute khusus `/admin/exec-center`.
* **Backend Flow:** Middleware memverifikasi token sesi Next.js. Kueri diarahkan ke fungsi view `public.view_investor_analytics`. Aturan RLS memblokir kueri ke tabel `profiles` mentah.
* **Frontend Flow:** Merender komponen `src/app/admin/exec-center/page.tsx`. Menggunakan pustaka grafik interaktif berbasis SVG/Canvas untuk menyajikan tren data makro.
* **UX Journey:**
  1. Login via OTP biasa -> Sistem mengenali `global_role = 'investor'`.
  2. Dialihkan otomatis ke halaman ringkasan performa nasional.
  3. Melihat visualisasi grafik volume perputaran kas dan pertumbuhan simpul RT/RW tanpa detail privasi warga.
* **Batasan Akses:** Tombol modifikasi data, hapus data, atau akses data individu warga dihilangkan total dari pohon komponen (*component tree*).

## LAYER 3: AUDITOR / PEMERINTAH (OVERSIGHT TIER)
* **Entry Point:** Rute khusus `/compliance`.
* **Backend Flow:** Mengakses kueri view `public.view_compliance_audit`. Membaca rantai kriptografi hash pada baris ledger historis untuk verifikasi validitas pembukuan.
* **Frontend Flow:** Merender komponen pada halaman `src/app/compliance/page.tsx` menggunakan tata letak tabel data berdensitas tinggi (*high-density data table*).
* **UX Journey:**
  1. Memasukkan filter kode wilayah (Kecamatan/Desa).
  2. Sistem menyajikan persentase tingkat kepatuhan rekonsiliasi kas dan grafik transparansi sirkular ekonomi wilayah.
  3. Melakukan eksekusi fungsi enkripsi pembuktian bahwa buku kas bebas dari manipulasi pengurus.
* **Batasan Akses:** Akses dibatasi pada data agregat wilayah tugasnya. Seluruh data identitas warga disamarkan (*masked*) menjadi `Warga_Anonim`.

## LAYER 4: PENGURUS & BENDAHARA (LOCAL OPERATIONAL TIER)
* **Entry Point:** Rute dasbor komunitas `/communities/[id]/dashboard`.
* **Backend Flow:** Autentikasi divalidasi silang secara real-time ke tabel `community_members` berbasis pencocokan `profile_id` dan `community_id`. RLS aktif menyaring baris data agar hanya menampilkan rekaman kas milik RT/RW mereka sendiri.
* **Frontend Flow:** Merender komponen pengelola pada `src/app/communities/[id]/page.tsx` serta modal persetujuan Multi-Sig di `src/app/multisig/page.tsx`.
* **UX Journey:**
  1. Membuka dasbor, meninjau grafik saldo kas lokal dan antrean persetujuan pengeluaran dana wilayah.
  2. Jika nominal pengeluaran $\ge \text{Rp5.000.000}$ (default dinamis), sistem memunculkan indikator status penangguhan (*pending approval*).
  3. Menyetujui transaksi melalui penekanan tombol dasbor atau membalas chat WhatsApp Bot menggunakan perintah `#approve <id>`.
* **Batasan Akses:** Terkunci mutlak pada wilayahnya. Upaya mengakses `/communities/[id_rt_lain]` akan menghasilkan galat `HTTP 403 Forbidden`.

## LAYER 5: WARGA & TENAN LOKAL (USER TIER)
* **Entry Point:** Rute beranda utama `/` (Progressive Web App) dan interaksi langsung chat WhatsApp Bot.
* **Backend Flow:** Kueri disaring ketat menggunakan RLS berbasis data diri pengguna sendiri (`actor_id = auth.uid()`).
* **Frontend Flow:** Merender komponen antarmuka seluler mobile-first pada `src/app/page.tsx` dengan ukuran tombol ergonomis minimum `48px`.
* **UX Journey:**
  1. Warga mengetik perintah `#kas` pada WhatsApp Bot untuk melihat saldo kas lingkungan secara transparan.
  2. Membuka aplikasi web untuk meninjau detail tender pengadaan barang wilayah yang sedang berjalan.
  3. Memberikan kontribusi patungan iuran rutin atau iuran tender, kemudian menerima poin kenaikan skor pada mesin reputasi (*Reputation Engine*).
* **Batasan Akses:** Hanya dapat membaca data miliknya sendiri. Tidak memiliki otoritas untuk memodifikasi buku kas kolektif lingkungan atau menyetujui pengeluaran Multi-Sig.
