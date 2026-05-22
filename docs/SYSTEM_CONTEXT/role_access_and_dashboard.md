# Role Access & Dashboard Alignment (5-Layer Architecture)

## Ringkasan
Dokumen ini menjelaskan **kesesuaian antara peran (role) akses**, **struktur data riil (PostgreSQL + RLS)**, dan **panel dasbor UI** pada sistem URUN. Tujuannya agar semua kontributor dapat memverifikasi bahwa hak-akses yang ditampilkan pada antarmuka selaras dengan kebijakan keamanan basis data. Terdapat pemisahan tegas antara **Role Global (`profiles.global_role`)** dan **Role Lokal (`community_members.role`)**.

---

### 1. 5-Layer Access Mapping

Sistem dibagi menjadi 5 layer utama:

| Layer | Peran | Basis Akses Data | Tabel Utama / Routing |
|-------|-------|------------------|----------------------|
| **1. System Tier** | Founder / DevOps | `SUPABASE_SERVICE_ROLE_KEY` / Bypass RLS | Akses CLI backend, Migrasi Database |
| **2. Strategy Tier** | Investor / Eksekutif | `profiles.global_role = 'investor'` | `/admin/exec-center` / `public.view_investor_analytics` |
| **3. Oversight Tier** | Auditor / Pemerintah | `profiles.global_role = 'auditor'` | `/compliance` / `public.view_compliance_audit` |
| **4. Local Operational** | Pengurus & Bendahara | `community_members.role IN ('admin', 'pengurus')` | `/communities/[id]/dashboard` & `/multisig` |
| **5. User Tier** | Warga & Tenan Lokal | `profiles.global_role = 'user'` & `community_members.role = 'warga'` | `/` (PWA) & WhatsApp Bot |

---

### 2. UI Panels ↔ Role Pemisahan

| UI Panel (TSX) | File | Akses Role Diizinkan |
|---------------|------|---------------------|
| **Executive Center** | `src/app/admin/exec-center/*` | `investor`, `founder` (Global Role) |
| **Compliance & Audit** | `src/app/compliance/*` | `auditor`, `founder` (Global Role) |
| **Community Dashboard** | `src/app/communities/[id]/page.tsx` | `admin`, `pengurus` (Local Role di komunitas tsb) |
| **User Home** | `src/app/page.tsx` | `user` (Global Role) |
| **Docs & Playground** | `src/app/docs/*` | `developer` (Sistem Eksternal) |

> **Catatan Middleware:** Panel diproteksi melalui `src/middleware.ts` untuk memastikan Warga tidak dapat mengakses rute Investor/Auditor. Selain itu, fungsi auth internal memeriksa kecocokan ID komunitas dan profil.

---

### 3. Modul-Modul Utama yang Menggunakan Role Check
- **`src/middleware.ts`** – Menjaga rute `/admin` dan `/compliance` agar hanya dapat diakses oleh global_role yang memiliki wewenang.
- **`src/lib/auth.ts`** – Mengekstrak `global_role` dan role komunal.
- **`src/app/api/ledger/route.ts`** – Menolak request tidak sah pada ledger publik atau transaksi Multi-Sig.
- **`supabase/migrations/*`** – RLS memastikan `community_members` hanya melihat wilayah mereka. Auditor hanya melihat data yang diagregasi di view terpisah.

---

### 4. Verifikasi & Pengujian
1. **Middleware Tests:** Memastikan warga yang mencoba mengakses `/admin/exec-center` menerima `HTTP 403 Forbidden` / Redirect.
2. **pgTAP tests** (`tests/rls_tests.sql`):
   - Warga tidak dapat membaca profil warga lain.
   - Admin dapat meng-update ledger pada komunitasnya.
   - Role 'warga' tidak bisa masuk ke API /admin.

---

*Dokumen ini berada di* `docs/SYSTEM_CONTEXT/role_access_and_dashboard.md` *untuk referensi tim pengembang, auditor keamanan, dan stakeholder.*
