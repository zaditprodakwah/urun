# Laporan Arsitektur Sistem & Skema Data URUN
### Audit Komprehensif: Database · Role · Akses · API
> Dibuat: 22 Mei 2026 | Berdasarkan migrasi SQL aktif + kode sumber terkini

---

## 1. Filosofi Arsitektur

URUN dibangun di atas **4 Pilar Utama**:

| # | Pilar | Implementasi Teknis |
|---|-------|---------------------|
| 1 | **Kedaulatan Data Warga** | Multi-tenant via `community_id` — data satu RT tidak pernah terlihat RT lain |
| 2 | **Efisiensi Kolektif** | Auto-split 70/30 via database trigger — deterministik, tidak bisa dimanipulasi |
| 3 | **Akuntabilitas Tak Terbantahkan** | Ledger append-only + immutability trigger — tidak ada yang bisa edit/hapus entri keuangan |
| 4 | **Kedaulatan Privasi** | RLS di level database (bukan aplikasi) + OTP-only WhatsApp login + zero tracking |

**Stack:** Next.js 16 (App Router) + Supabase (PostgreSQL 15) + Fonnte WhatsApp API + Vercel

---

## 2. Skema Database — 13 Tabel

### Peta Relasi (ERD Ringkas)

```
auth.users (Supabase Auth)
    │
    └─► profiles (identitas global)
             │
             └─► community_members ◄──┐  (join table + RBAC)
                      │              │
                      │         communities (root tenant)
                      │              │
                      ├─► tenders ───┘
                      │       │
                      │       └─► tender_subscriptions
                      │
                      ├─► ledger (append-only, SACRED)
                      │
                      ├─► catalog_items
                      │       └─► catalog_reviews
                      │
                      ├─► multisig_requests
                      ├─► interaction_log
                      ├─► audit_log
                      ├─► otp_sessions
                      ├─► idempotency_keys
                      └─► workflow_processes
```

---

### Tabel 1 — `profiles` (Identitas Global)
> **Migrasi:** `20260521000001_core_schema.sql`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID PK | = `auth.users.id` (CASCADE DELETE) |
| `full_name` | TEXT NOT NULL | Nama lengkap warga |
| `phone` | TEXT UNIQUE | Nomor WhatsApp (gateway OTP) |
| `auth_user_id` | UUID | FK ke `auth.users` |
| `avatar_url` | TEXT | URL foto profil |
| `consent_timestamp` | TIMESTAMPTZ | UU PDP: kapan warga setujui PP |
| `consent_version` | TEXT | Versi Privacy Policy yang disetujui |
| `created_at` | TIMESTAMPTZ | — |

> ⚠️ **Sacred Rule #7:** Tidak ada `DELETE` policy — penghapusan dilakukan via anonimisasi (`Warga_Anonim`), bukan hapus baris.

---

### Tabel 2 — `communities` (Root Tenant)
> **Migrasi:** `20260521000001_core_schema.sql`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID PK | — |
| `slug` | TEXT UNIQUE | Identifier URL komunitas |
| `name` | TEXT NOT NULL | Nama RT/RW/Paguyuban |
| `geo_context` | JSONB | `{province, regency, district, village, coordinates}` |
| `settings` | JSONB | Konfigurasi komunitas (lihat bawah) |
| `is_active` | BOOLEAN | Soft-disable komunitas |

**`settings` JSONB:**
```json
{
  "multisig_threshold": 5000000,      // ≥ Rp5jt → wajib multi-sig (2 tanda tangan)
  "multisig_high_threshold": 50000000, // ≥ Rp50jt → wajib 3 tanda tangan
  "platform_fee_pct": 30,             // % ke URUN operations
  "community_share_pct": 70,          // % ke kas komunitas
  "revenue_destination_account": null, // Rekening tujuan
  "mode": "normal"                     // "normal" | "manual" (degradasi)
}
```

---

### Tabel 3 — `community_members` (Join Table + RBAC)
> **Migrasi:** `20260521000001_core_schema.sql`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID PK | — |
| `community_id` | UUID FK | → `communities` (CASCADE) |
| `profile_id` | UUID FK | → `profiles` (CASCADE) |
| `role` | TEXT | `CHECK IN ('warga', 'pengurus', 'admin')` |
| `permissions` | JSONB | Fine-grained RBAC (lihat detail di Bagian 4) |
| `reputation_score` | INT | Mulai 10, minimal 0 (floor CHECK) |
| `joined_at` | TIMESTAMPTZ | — |

> 🔑 **UNIQUE(community_id, profile_id)** — satu user hanya punya satu peran per komunitas.

---

### Tabel 4 — `catalog_items` (Katalog Produk/Jasa)
> **Migrasi:** `20260521000001` + `20260521000009`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID PK | — |
| `community_id` | UUID FK | → `communities` |
| `created_by` | UUID FK | → `community_members` |
| `slug` | TEXT UNIQUE | URL-friendly identifier |
| `title`, `description` | TEXT | — |
| `item_type` | TEXT | `CHECK IN ('product', 'service', 'asset')` |
| `status` | TEXT | `CHECK IN ('public', 'private', 'active', 'archived')` |
| `checkout_type` | TEXT | `'link_toko'` (redirect) \| `'whatsapp_form'` (popup form) |
| `external_url` | TEXT | URL Tokopedia/Shopee (jika link_toko) |
| `whatsapp_form_fields` | JSONB | Definisi field dinamis untuk form WhatsApp |
| `metadata` | JSONB | Schema.org data, pricing, stok, `is_peduli` flag |

> 📌 `status = 'public'` → dapat diakses crawler SEO (anon role) tanpa login.

---

### Tabel 5 — `tenders` (Pengadaan Kolektif — Fitur Utama)
> **Migrasi:** `20260521000002_tenders_and_workflows.sql`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID PK | — |
| `community_id` | UUID FK | → `communities` |
| `catalog_item_id` | UUID FK | → `catalog_items` (nullable, SET NULL) |
| `created_by` | UUID FK | → `community_members` |
| `title`, `description` | TEXT | — |
| `target_quantity` | INT | `CHECK > 0` |
| `min_quantity` | INT | `CHECK > 0` |
| `unit_price_target` | DECIMAL(15,2) | Harga target negosiasi |
| `current_state` | TEXT | State machine (lihat bawah) |
| `deadline` | TIMESTAMPTZ | Kolom fisik (untuk cron job query) |
| `supplier_info` | JSONB | Info vendor/pemasok |
| `idempotency_key` | UUID UNIQUE | Anti-duplikasi |

**State Machine Tender:**
```
DRAFT → PUBLISHED → SUBSCRIBING → CLOSED → FULFILLED → SETTLED
                                        → EXPIRED
                                        → DISPUTE
```

---

### Tabel 6 — `tender_subscriptions` (Pendaftaran Warga ke Tender)
> **Migrasi:** `20260521000002`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID PK | — |
| `tender_id` | UUID FK | → `tenders` |
| `community_id` | UUID FK | → `communities` |
| `member_id` | UUID FK | → `community_members` |
| `quantity` | INT | `CHECK > 0` |
| `status` | TEXT | `CHECK IN ('pending', 'confirmed', 'paid', 'cancelled')` |

> 🔑 **UNIQUE(tender_id, member_id)** — satu warga, satu slot per tender.

---

### Tabel 7 — `ledger` (Buku Kas — SACRED, Append-Only)
> **Migrasi:** `20260521000002` + `20260521000010`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID PK | — |
| `community_id` | UUID FK | → `communities` **ON DELETE RESTRICT** |
| `actor_id` | UUID FK | → `community_members` **ON DELETE RESTRICT** |
| `tender_id` | UUID FK | → `tenders` (nullable, RESTRICT) |
| `catalog_item_id` | UUID FK | → `catalog_items` (nullable, RESTRICT) |
| `amount` | DECIMAL(15,2) | `CHECK > 0` — tidak boleh negatif |
| `direction` | TEXT | `CHECK IN ('in', 'out')` |
| `entry_type` | TEXT | 8 jenis (lihat bawah) |
| `ref_id` | UUID | FK ke entri asal (untuk koreksi) |
| `description` | TEXT | Narasi transparan untuk warga |
| `idempotency_key` | UUID UNIQUE | Anti-duplikasi dari retry |
| `multisig_status` | TEXT | `CHECK IN ('not_required', 'pending_approval', 'approved', 'rejected', 'expired')` |
| `metadata` | JSONB | Info tambahan (platform, source_tx_id) |
| `created_at` | TIMESTAMPTZ | **Tidak ada `updated_at`** — ledger tidak pernah diupdate |

**Jenis Entri Ledger (`entry_type`):**

| entry_type | Arah | Keterangan |
|------------|------|------------|
| `tender_contribution` | `in` | Warga bayar ke tender |
| `tender_settlement` | `out` | Pembayaran final ke supplier |
| `platform_revenue` | `out` | 30% ke URUN operations |
| `community_share` | `in` | 70% ke kas komunitas |
| `correction` | kebalikan | Koreksi via entry baru (bukan edit) |
| `iuran` | `in` | Iuran rutin bulanan |
| `penalty` | `out` | Penalti pelanggaran |
| `refund` | `in` | Pengembalian dana |

> 🔒 **SACRED RULE #2:** Trigger `ledger_immutability_guard` memblokir `UPDATE` dan `DELETE` secara mutlak — bahkan dari superuser.

---

### Tabel 8 — `multisig_requests` (Antrean Multi-Tanda Tangan)
> **Migrasi:** `20260521000003_audit_and_logs.sql`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID PK | — |
| `community_id` | UUID FK | → `communities` |
| `ledger_ref_id` | UUID FK | → `ledger` (nullable, RESTRICT) |
| `tender_id` | UUID FK | → `tenders` (nullable) |
| `amount` | DECIMAL(15,2) | `CHECK > 0` |
| `requested_by` | UUID FK | → `community_members` |
| `required_sigs` | INT | 2 (≥ Rp5jt) atau 3 (≥ Rp50jt) |
| `current_sigs` | INT | Tanda tangan terkumpul |
| `status` | TEXT | `CHECK IN ('pending', 'approved', 'rejected', 'expired', 'cancelled')` |
| `approvals` | JSONB | Array `[{member_id, approved_at, signature}]` |
| `expires_at` | TIMESTAMPTZ | Auto-cancel setelah 24 jam |

---

### Tabel 9 — `interaction_log` (Log Aktivitas Warga)
> **Migrasi:** `20260521000003`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `action_type` | TEXT | `'tender_contribution_paid'`, `'tender_participation'`, `'successful_referral'`, `'violation_detected'`, `'fraud_attempt'` |
| `source_system` | TEXT | `CHECK IN ('web_ui', 'bot_wa', 'partner_app', 'system_auto', 'admin_manual')` |
| `ip_hash` | TEXT | **Hash SHA-256 dari IP** — bukan raw IP (UU PDP) |

---

### Tabel 10 — `audit_log` (Jejak Perubahan Sistem)
> **Migrasi:** `20260521000003`

Log semua perubahan sistem: konstanta algoritma, update RLS, aksi admin, auto-split trigger. Immutable by policy.

---

### Tabel 11 — `otp_sessions` (Session OTP WhatsApp)
> **Migrasi:** `20260521000006_auth_and_otp.sql`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `phone` | TEXT | Nomor WhatsApp |
| `otp_hash` | TEXT | **bcrypt hash** OTP — tidak plain text |
| `community_id` | UUID FK | → `communities` |
| `expires_at` | TIMESTAMPTZ | TTL 5 menit |
| `used` | BOOLEAN | Anti-replay (sekali pakai) |

---

### Tabel 12 — `idempotency_keys` (Kunci Anti-Duplikasi Transaksi)
> **Migrasi:** `20260521000008_idempotency.sql`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `idempotency_key` | UUID PK | Kunci unik per request |
| `community_id` | UUID FK | → `communities` |
| `request_path` | TEXT | Path API yang diproses |
| `response_body` | JSONB | Cache respons |
| `response_status` | INT | HTTP status cache |
| `expires_at` | TIMESTAMPTZ | TTL 24 jam, dibersihkan via `cleanup_expired_idempotency_keys()` |

---

### Tabel 13 — `catalog_reviews` (Ulasan Produk)
> **Migrasi:** `20260521000009_catalog_refactoring.sql`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `product_id` | UUID FK | → `catalog_items` (CASCADE) |
| `user_id` | UUID FK | → `profiles` |
| `community_id` | UUID FK | → `communities` |
| `rating` | INT | `CHECK >= 1 AND <= 5` |
| `comment` | TEXT | — |

---

## 3. Trigger & Fungsi Database (Server-Side Logic)

### 5 Trigger Aktif

| Trigger | Tabel | Event | Fungsi |
|---------|-------|-------|--------|
| `ledger_immutability_guard` | `ledger` | `BEFORE UPDATE/DELETE` | Blokir mutasi ledger absolut |
| `ledger_auto_revenue_split` | `ledger` | `AFTER INSERT` | Auto-split 70/30 saat `tender_settlement` |
| `reputation_engine_trigger` | `interaction_log` | `AFTER INSERT` | Update skor reputasi deterministik |
| `trg_reputation_on_ledger` | `ledger` | `AFTER INSERT` | Update skor reputasi dari ledger |
| `tender_deadline_check` | `tenders` | `BEFORE UPDATE` | Auto-expire tender yang melewati deadline |

### 6 RPC Function Kritis

| Fungsi | Tujuan |
|--------|--------|
| `process_ledger_entry()` | Gateway tunggal penulisan ke ledger — validasi amount, cek multi-sig, idempotency |
| `process_affiliate_commission()` | Proses komisi afiliasi eksternal langsung ke ledger dengan split 70/30 |
| `insert_correction_entry()` | Koreksi entri ledger via entry baru (bukan edit) |
| `auth_member_community_ids()` | Helper RLS — community_id yang boleh diakses user |
| `auth_is_member_of(community_id)` | Helper RLS — verifikasi keanggotaan |
| `auth_has_permission(community_id, permission)` | Helper RLS — cek izin granular dari JSONB |

**Logika Reputasi (Deterministik):**

| Event | Delta Skor |
|-------|-----------|
| `tender_contribution_paid` | **+5** |
| `tender_participation` | **+3** |
| `successful_referral` | **+2** |
| `violation_detected` | **−10** |
| `fraud_attempt` | **−15** |
| Skor minimum | **0** (floor CHECK constraint) |

---

## 4. Sistem Role & Akses

### 4.1 Hierarki Role

```
┌─────────────────────────────────────────────────────────────┐
│  FOUNDER / SUPER-ADMIN                                      │
│  ─ Tidak ada baris di profiles publik                       │
│  ─ Akses via: Supabase Dashboard + service_role key         │
│  ─ Bypass RLS: service_role JWT                             │
│  ─ Scope: SEMUA komunitas, SEMUA tabel                      │
├─────────────────────────────────────────────────────────────┤
│  ADMIN (per-komunitas)                                      │
│  role = 'admin' di community_members                        │
│  ─ Login via /login → WhatsApp OTP                          │
│  ─ Dashboard: /admin/* (requireRole(['admin']))             │
│  ─ Scope: komunitas sendiri ONLY (RLS enforced)             │
├─────────────────────────────────────────────────────────────┤
│  PENGURUS (RT/RW)                                           │
│  role = 'pengurus' di community_members                     │
│  ─ Login via /login → WhatsApp OTP                          │
│  ─ Dashboard: /dashboard + fitur pengurus                   │
│  ─ Scope: komunitas sendiri ONLY (RLS enforced)             │
├─────────────────────────────────────────────────────────────┤
│  WARGA (Member)                                             │
│  role = 'warga' di community_members                        │
│  ─ Login via /login → WhatsApp OTP                          │
│  ─ Dashboard: /dashboard (view-only fitur terbatas)         │
│  ─ Scope: data komunitas sendiri ONLY (RLS enforced)        │
├─────────────────────────────────────────────────────────────┤
│  MITRA / PARTNER (Eksternal)                                │
│  ─ Tidak ada baris di profiles                              │
│  ─ Akses via HMAC-SHA256 signed webhook (API key)           │
│  ─ Endpoint: /api/v1/affiliate/callback, /api/webhook/*     │
│  ─ Scope: INSERT ke ledger melalui RPC function only        │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Permission Granular (JSONB di `community_members.permissions`)

| Permission Key | Default | Siapa yang Butuh |
|----------------|---------|------------------|
| `can_create_tender` | `false` | Pengurus & Admin |
| `can_approve_multisig` | `false` | Pengurus & Admin (sesuai kuorum) |
| `is_treasurer` | `false` | Bendahara saja |
| `is_witness` | `false` | Saksi pengesahan |
| `can_manage_catalog` | `false` | Admin + pengelola katalog |
| `can_export_data` | `false` | Admin (untuk laporan) |

> **Contoh:** Pengurus RT yang menjadi Bendahara perlu `is_treasurer: true` + `can_approve_multisig: true`. Admin level RW perlu semua `true`.

### 4.3 Matriks Akses Per Tabel

| Tabel | anon | warga | pengurus | admin | founder |
|-------|------|-------|----------|-------|---------|
| `profiles` | ✗ | Baris sendiri | Semua di komunitas | Semua di komunitas | ✅ All |
| `communities` | ✗ | READ komunitas sendiri | READ | READ + UPDATE | ✅ All |
| `community_members` | ✗ | READ komunitas sendiri | READ | CRUD | ✅ All |
| `catalog_items` (public) | ✅ READ | ✅ READ | READ + INSERT/UPDATE | CRUD | ✅ All |
| `catalog_items` (private) | ✗ | READ komunitas | READ + manage | CRUD | ✅ All |
| `tenders` | ✗ | READ | READ + CREATE/UPDATE (is_treasurer) | CRUD | ✅ All |
| `tender_subscriptions` | ✗ | READ + INSERT | READ | CRUD | ✅ All |
| `ledger` | ✗ | READ komunitas | READ | READ (via RPC) | ✅ All |
| `ledger` (write) | ✗ | Via RPC only | Via RPC only | Via RPC only | ✅ service_role |
| `multisig_requests` | ✗ | READ | READ + UPDATE (can_approve_multisig) | CRUD | ✅ All |
| `interaction_log` | ✗ | ✗ | ✗ | READ (can_manage_catalog) | ✅ All |
| `audit_log` | ✗ | ✗ | ✗ | READ (can_manage_catalog) | ✅ All |
| `otp_sessions` | READ (via API) | Via API | Via API | CRUD | ✅ All |
| `idempotency_keys` | ✗ | ✗ | ✗ | READ | ✅ All |

---

## 5. Sistem Autentikasi

### Alur Login WhatsApp OTP

```
Warga Input Nomor WA
        ↓
POST /api/auth/send-otp
   → Generate OTP 6 digit
   → INSERT ke otp_sessions (bcrypt hash, TTL 5 menit)
   → Kirim via Fonnte WhatsApp API
        ↓
Warga Input OTP
        ↓
POST /api/auth/verify-otp
   → Lookup phone + used=false + expires_at > NOW()
   → bcrypt.compare(input, hash)
   → Jika valid: mark used=true, buat JWT session (HS256, 7 hari)
   → Set HttpOnly cookie 'urun_session'
        ↓
Setiap request terproteksi:
   getSession() → decryptSession(JWT) → UserSession {userId, role, communityId}
```

### Fail-Safe Role Verification

Untuk role `admin` dan `pengurus`, sistem melakukan **real-time database verification** — tidak hanya mempercayai JWT:

```typescript
// src/lib/auth.ts — requireRole()
if (allowedRoles.includes('admin') || allowedRoles.includes('pengurus')) {
  // Re-query database setiap kali (fail-safe)
  const { data: member } = await supabaseAdmin
    .from('community_members')
    .select('role')
    .eq('profile_id', session.userId)
    .eq('community_id', session.communityId)
    .single();
  // Jika role di DB berbeda dari JWT → FORBIDDEN
}
```

---

## 6. API Routes & Access Guard

### 12 Grup API Endpoint

| Endpoint | Method | Auth | Role Minimum | Keterangan |
|----------|--------|------|-------------|------------|
| `/api/auth/send-otp` | POST | Public | — | Kirim OTP ke WhatsApp |
| `/api/auth/verify-otp` | POST | Public | — | Verifikasi OTP, buat session |
| `/api/auth/logout` | POST | Session | warga | Hapus cookie session |
| `/api/v1/catalog` | GET | Public | — | Daftar item publik (SEO) |
| `/api/v1/catalog/[slug]` | GET | Public | — | Detail item |
| `/api/v1/catalog/[slug]/checkout` | POST | Session | warga | Proses checkout |
| `/api/v1/catalog/[slug]/review` | POST | Session | warga | Tulis ulasan |
| `/api/v1/ledger/contribution` | POST | Session | warga | Catat kontribusi iuran |
| `/api/v1/affiliate/callback` | POST | HMAC Signed | mitra | Proses komisi afiliasi |
| `/api/multisig/requests` | GET | Session | pengurus | Daftar antrean multi-sig |
| `/api/multisig/approve` | POST | Session | pengurus (can_approve_multisig) | Setujui permintaan multi-sig |
| `/api/multisig/reconcile` | POST | Session | admin | Rekonsiliasi kas |
| `/api/multisig/simulate` | POST | Session | admin | Simulasi multi-sig (dev) |
| `/api/leaderboard` | GET | Public | — | Data papan peringkat |
| `/api/admin/members` | GET/POST | Session | admin | Manajemen keanggotaan |
| `/api/admin/settings` | GET/PUT | Session | admin | Pengaturan komunitas |
| `/api/profile/export` | GET | Session | warga | Export data pribadi (UU PDP) |
| `/api/profile/delete` | POST | Session | warga | Hapus akun (anonimisasi) |
| `/api/webhook/fonnte` | POST | HMAC Signed | — | Terima pesan WA masuk |
| `/api/webhook/whatsapp` | POST | HMAC Signed | — | Webhook WA alternatif |
| `/api/parser` | POST | Session | pengurus | Parse perintah WA |
| `/api/simulator/referral` | POST | Session | warga | Simulasi referral |
| `/api/cron/digest` | GET | Cron Token | — | Kirim digest harian |
| `/api/cron/tender-remind` | GET | Cron Token | — | Reminder deadline tender |
| `/api/analytics/trends` | GET | Session | admin | Tren transaksi |
| `/api/algorithm/explain` | GET | Session | admin | Penjelasan algoritma reputasi |

---

## 7. Panel Dasbor per Role

| URL / Panel | Role | Fitur Utama |
|-------------|------|-------------|
| `/` (Landing) | Public | Simulator bot WA, kalkulator 70/30, onboarding form |
| `/login` | Public | WhatsApp OTP login |
| `/dashboard` | warga, pengurus, admin | Buku Kas real-time, status tender, skor reputasi |
| `/catalog` | Public + Member | Etalase produk komunitas, checkout |
| `/catalog/[slug]` | Public + Member | Detail produk, form WA, ulasan |
| `/leaderboard` | Public | Papan Pahlawan Lokal, referral generator |
| `/multisig` | pengurus, admin | Antrean multi-sig, setujui/tolak |
| `/admin` | admin | Manajemen warga, setting komunitas, analytics |
| `/kebijakan-privasi` | Public | Kebijakan privasi + Pusat Kendali Data Warga (export, hapus) |
| `/syarat-ketentuan` | Public | ToS lengkap (kas kolektif, multi-sig, tender) |
| `/tentang` | Public | Info platform + kontak DPO |

---

## 8. Mekanisme Keamanan Berlapis

```
Layer 1: Supabase Auth (JWT)
  → Setiap request terautentikasi membawa JWT
  → JWT berisi: userId, role, communityId, phone

Layer 2: Row-Level Security (PostgreSQL)
  → 30+ kebijakan RLS — default DENY semua
  → Helper functions: auth_is_member_of(), auth_has_permission()
  → Bahkan SQL editor Supabase pun diblokir RLS untuk anon/authenticated

Layer 3: Application-Level Guards (Next.js)
  → requireAuth(), requireRole(['admin', 'pengurus'])
  → Real-time DB verification untuk admin/pengurus (anti-JWT-stale)

Layer 4: Database Triggers
  → ledger_immutability_guard: blokir UPDATE/DELETE ledger
  → Idempotency check di process_ledger_entry()

Layer 5: HMAC-SHA256 Webhook Validation
  → /api/v1/affiliate/callback & /api/webhook/*
  → Validasi tanda tangan + toleransi timestamp ±5 menit

Layer 6: CHECK Constraints (SQL Level)
  → amount > 0 (ledger, multisig_requests)
  → rating BETWEEN 1 AND 5 (catalog_reviews)
  → role IN ('warga', 'pengurus', 'admin')
  → tender state machine ENUM
```

---

## 9. Aliran Dana 70/30 (Teknis)

```
Warga beli via katalog URUN
          ↓
Mitra kirim callback ke /api/v1/affiliate/callback
          ↓
Validasi HMAC-SHA256 + Idempotency check
          ↓
RPC process_affiliate_commission()
          ↓
   ┌──────────────────────────────┐
   │  Cek: is_peduli?             │
   │  Ya  → 100% ke community     │
   │  Tidak → split:              │
   │    70% → ledger community_share (direction='in')  │
   │    30% → ledger platform_revenue (direction='out') │
   └──────────────────────────────┘
          ↓
INSERT ke audit_log (transparansi otomatis)
          ↓
TRIGGER trg_reputation_on_ledger
→ UPDATE reputation_score warga (+1 CP)
```

**Pengecualian URUN Peduli:**
Program darurat/sosial (ditandai `metadata.is_peduli = true`) mendapatkan **100% dana langsung ke kas komunitas** — platform fee = Rp 0.

---

## 10. Ringkasan Statistik Sistem

| Metrik | Nilai |
|--------|-------|
| Jumlah tabel PostgreSQL | **13** |
| Kebijakan RLS aktif | **30+** |
| Trigger database | **5** |
| RPC function | **6** |
| Index performa | **20+** |
| Jenis entry ledger | **8** |
| Level role | **4** (founder, admin, pengurus, warga) |
| Permission granular | **6** (JSONB per member) |
| Grup API endpoint | **12** |
| Halaman publik | **8** |
| Halaman terproteksi | **5** |
| Constraint CHECK SQL | **15+** |

---

## 11. Catatan Kepatuhan UU PDP No. 27/2022

| Ketentuan | Implementasi |
|-----------|-------------|
| Hak Akses Data | `/api/profile/export` → download JSON/CSV |
| Hak Hapus Data | `/api/profile/delete` → anonimisasi `Warga_Anonim`, bukan DELETE |
| Minimasi Data | IP hanya disimpan sebagai SHA-256 hash di `interaction_log` |
| Persetujuan Terekam | `profiles.consent_timestamp` + `consent_version` |
| Zero Tracking | Tidak ada Google Analytics / Meta Pixel |
| Isolasi Data | RLS komunitas — data satu komunitas tidak bisa dilihat komunitas lain |

---

*Laporan ini dibuat berdasarkan audit kode sumber aktif per commit `53b886b` (22 Mei 2026).  
Sumber: `supabase/migrations/*.sql` + `src/lib/auth.ts` + `src/app/api/**` + `src/app/**`*
