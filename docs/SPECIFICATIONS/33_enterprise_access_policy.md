# 33_enterprise_access_policy

**Status:** *Compliance Standard* | **Audience:** *DevOps, Backend Engineers, Security Auditors*

## Enterprise Tiered Access Policy

Dokumen ini mendefinisikan kebijakan kontrol akses (Access Control Policy) korporasi URUN untuk memastikan segregasi tugas yang jelas, mencegah kebocoran data privasi warga, dan mematuhi regulasi perlindungan data.

Sistem membedakan profil akses secara tegas menggunakan kolom `global_role` di tabel `profiles` dan `role` di tabel `community_members`.

### Layer 1: System Tier (Founder / DevOps)
- **Kredensial:** Supabase Service Role Key.
- **Akses:** Bebas tanpa restriksi RLS.
- **Kebijakan:** Service role tidak boleh digunakan untuk mengambil data identitas privat (kecuali agregasi *anonymized*) untuk kepentingan di luar pemeliharaan sistem teknis.

### Layer 2: Strategy Tier (Investor / Eksekutif)
- **Kredensial:** `profiles.global_role = 'investor'`.
- **Akses:** Rute `/admin/exec-center`.
- **Kebijakan:**
  - Hanya dapat melihat data analitik agregat (volume perputaran kas, pertumbuhan komunitas).
  - Dilarang keras mengakses raw data `profiles`, `community_members`, dan detail log transaksi kas `ledger`.
  - UI komponen *modify/delete* dihilangkan secara mutlak.

### Layer 3: Oversight Tier (Auditor / Pemerintah)
- **Kredensial:** `profiles.global_role = 'auditor'`.
- **Akses:** Rute `/compliance`.
- **Kebijakan:**
  - Akses dibatasi pada wilayah administratif tugas (berdasarkan filter regional).
  - Data identitas warga disamarkan sebagai `Warga_Anonim` demi kepatuhan UU PDP.
  - Dapat menjalankan pembuktian rekonsiliasi hash (kriptografi ledger historis).

### Layer 4: Local Operational Tier (Pengurus & Bendahara)
- **Kredensial:** `community_members.role = 'admin' OR 'pengurus'`.
- **Akses:** Dasbor komunitas masing-masing `/communities/[id]/dashboard`.
- **Kebijakan:**
  - Akses mutlak terisolasi (*siloed*) pada ID komunitas (RT/RW) mereka sendiri.
  - Multi-Sig Threshold: default Rp5.000.000 (dapat dikonfigurasi melalui `communities.settings`), wajib diamankan dengan setidaknya 2 tanda tangan digital pengurus yang berwenang.

### Layer 5: User Tier (Warga Lokal)
- **Kredensial:** `profiles.global_role = 'user' AND community_members.role = 'warga'`.
- **Akses:** Beranda utama dan WhatsApp Bot.
- **Kebijakan:**
  - Prinsip *Least Privilege*. Warga hanya berhak membaca data sendiri dan ringkasan agregat kas publik.
  - Warga tidak memiliki izin mutasi/ledger kas di luar mekanisme API pembayaran resmi.
  - Warga akan otomatis di-*redirect* (HTTP 403 / Redirect Root) jika mencoba mengakses API/Route Layer 1-4 (seperti `/admin` atau `/compliance`).

---
Semua lapisan kontrol di atas diimplementasikan ganda (Dual Validation) menggunakan *Supabase Row Level Security (RLS)* di Backend dan *Next.js Middleware* di Frontend.
