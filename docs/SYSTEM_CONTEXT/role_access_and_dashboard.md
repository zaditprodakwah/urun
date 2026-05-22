# Role Access & Dashboard Alignment

## Ringkasan
Dokumen ini menjelaskan **kesesuaian antara peran (role) akses**, **struktur data riil (PostgreSQL + RLS)**, dan **panel dasbor UI** pada sistem URUN.  Tujuannya agar semua kontributor dapat memverifikasi bahwa hak‑akses yang ditampilkan pada antarmuka selaras dengan kebijakan keamanan basis data.

---

### 1. Mapping Peran ↔ Data Riil (RLS)
| Peran | Kebijakan RLS (SQL) | Tabel yang dapat di‑akses |
|-------|----------------------|---------------------------|
| **Founder / Super Admin** | `FOR ALL USING (TRUE)` pada semua tabel | Semua tabel (`profiles`, `communities`, `ledger`, `idempotency_keys`, dll.) |
| **Admin / Pengurus RT‑RW** | `profiles_admin_read` (baris 30‑33 pada `auth_and_otp.sql`) | `profiles`, `community_members`, `ledger` (melalui transaction procedure) |
| **Warga (Member)** | `profiles_self_read` (baris 26‑27) | Baris `profiles` miliknya sendiri, `ledger` melalui webhook yang tervalidasi |
| **Mitra / Partner** | Tidak memiliki baris di `profiles`; akses **hanya** melalui webhook yang menulis ke `ledger` (idempotency) |
| **Developer / Integrator** | Service‑role token dengan hak `SELECT` pada view `api_docs` |

---

### 2. UI Panels ↔ Role
| UI Panel (TSX) | File | Role yang menampilkan panel |
|---------------|------|----------------------------|
| **Founder‑Center** | `src/app/admin/*` | `founder` |
| **Community Dashboard** | `src/app/communities/[id]/page.tsx` | `admin`, `pengurus` |
| **User Home** | `src/app/page.tsx` | `member` |
| **Partner Portal** | `partner/*` (repo terpisah) | `partner` |
| **Docs & Playground** | `src/app/docs/*` | `developer` |

> **Catatan:** Panel dipilih melalui fungsi `getUserRole()` di `src/lib/auth.ts` yang memeriksa tabel `community_members` atau token JWT.

---

### 3. Modul‑Modul Utama yang Menggunakan Role Check
- **`src/lib/auth.ts`** – mengekstrak `role` dari JWT dan menyimpan di `session.role`.
- **`src/app/api/ledger/route.ts`** – menolak request bila `X‑Urun‑Signature` tidak valid atau `X‑Urun‑Timestamp` > 300 detik.
- **`src/app/ledger/*`** – query Supabase otomatis terfilter oleh RLS.
- **`src/app/tenders/*`** – status workflow memakai `ts-pattern` dan hanya dapat dipicu oleh `admin`/`pengurus`.

---

### 4. Verifikasi & Pengujian
1. **pgTAP tests** (`tests/rls_tests.sql`) memastikan bahwa:
   - Warga tidak dapat membaca profil warga lain.
   - Admin dapat meng‑update ledger pada komunitasnya.
2. **Unit test UI** (`__tests__/roleBasedRender.test.tsx`) memverifikasi bahwa komponen menu berubah sesuai `role`.

---

### 5. Prosedur Update
1. **Menambah peran baru:**
   - Tambahkan kebijakan RLS pada tabel yang relevan.
   - Perbarui `getUserRole()` dengan klausa baru.
   - Buat/ubah UI panel dan daftarkan di tabel mapping di atas.
2. **Sinkronisasi dokumen:**
   - Jalankan `npm run test:pg` untuk pgTAP.
   - Jalankan `npm run test:ui`.
   - Commit perubahan dokumen bersama dengan kode.

---

*Dokumen ini berada di* `docs/SYSTEM_CONTEXT/role_access_and_dashboard.md` *untuk referensi tim pengembang, auditor keamanan, dan stakeholder.*
