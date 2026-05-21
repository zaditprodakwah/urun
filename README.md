# URUN — Micro-Community Operating System

> **Berdaulat. Transparan. Gotong Royong Digital.**

Platform keuangan dan logistik komunitas berbasis Next.js + Supabase, dibangun untuk RT/RW/Komunitas Lokal Indonesia.

**Production URL:** [urunwarga.vercel.app](https://urunwarga.vercel.app)  
**Repository:** [github.com/zaditprodakwah/urun](https://github.com/zaditprodakwah/urun)

---

## 🚀 Quick Start (Development)

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Isi nilai SUPABASE dan FONNTE di .env.local

# Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Build & Deploy

### Production Build (Local Check)

```bash
npm run build
```

Pastikan output **tidak ada error TypeScript** sebelum push ke GitHub.

### Deploy ke Vercel

Deployment berjalan **otomatis** via GitHub Actions setiap kali ada push ke branch `main`.

> ⚠️ **PENTING — Aturan Git Author**
>
> Vercel Project `inframeet-s-projects/urunwarga` hanya menerima commit dari author yang **terdaftar sebagai member tim**.
>
> **Selalu gunakan konfigurasi git berikut sebelum commit:**
> ```bash
> git config user.email "dakuprodakwah@gmail.com"
> git config user.name "zaditprodakwah"
> ```
>
> Commit dengan author lain (misalnya `muhzadnet@gmail.com` / `bitmuh`) akan **otomatis diblokir (Blocked)** oleh Vercel dan tidak akan pernah live.

### Vercel Project Info

| Item | Detail |
|------|--------|
| Project | `inframeet-s-projects/urunwarga` |
| Project ID | `prj_9VvhG7y8cGPBSW9pL9vGyn0lEq4w` |
| Production Domain | `urunwarga.vercel.app` |
| GitHub Repo | `zaditprodakwah/urun` |
| Authorized Author Email | `dakuprodakwah@gmail.com` |
| Authorized GitHub User | `zaditprodakwah` |
| Vercel Account | `dakuprodakwah-4228` |

---

## 📦 Environment Variables

Variabel berikut **wajib** tersedia di Vercel Environment Variables dan `.env.local`:

| Variable | Scope | Keterangan |
|----------|---------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | URL Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only 🔒 | Supabase service role key (RAHASIA) |
| `FONNTE_TOKEN` | Server-only 🔒 | Token WhatsApp gateway Fonnte |
| `FONNTE_WEBHOOK_SECRET` | Server-only 🔒 | Secret validasi webhook Fonnte |
| `CRON_SECRET` | Server-only 🔒 | Token otorisasi Vercel Cron (min. 32 karakter) |
| `SESSION_SECRET` | Server-only 🔒 | Kunci signing JWT `jose` untuk sesi (min. 32 karakter) |
| `NEXT_PUBLIC_SITE_URL` | Public | URL produksi (`https://urunwarga.vercel.app`) |

> ⚠️ **Keamanan:** Variabel berlabel 🔒 tidak boleh pernah ter-expose ke browser. `CRON_SECRET` dan `SESSION_SECRET` adalah **variabel baru** yang wajib ditambahkan di Vercel Dashboard sebelum deploy.

---

## 🗺️ Routes Aplikasi

| Route | Tipe | Keterangan |
|-------|------|-----------|
| `/` | Static | Homepage & navigasi utama |
| `/login` | Static | Halaman login OTP WhatsApp |
| `/catalog` | ISR (60s) | Katalog produk publik (SEO/AEO ready) |
| `/catalog/[slug]` | SSR | Detail produk dengan JSON-LD schema |
| `/dashboard` | SSR | Dashboard personal warga (auth required) |
| `/admin` | SSR | Panel admin pengurus komunitas (auth required) |
| `/leaderboard` | Static | Papan keaktifan warga |
| `/multisig` | Static | Multi-Sig Command Center pengurus |
| `/sitemap.xml` | ISR (1h) | Sitemap native Next.js |
| `/api/auth/send-otp` | Dynamic | Kirim OTP ke WhatsApp (rate-limit 60s) |
| `/api/auth/verify-otp` | Dynamic | Verifikasi OTP (max 5 attempt) |
| `/api/auth/logout` | Dynamic | Hapus sesi & redirect |
| `/api/webhook/whatsapp` | Dynamic | Webhook penerima pesan WhatsApp |
| `/api/multisig/requests` | Dynamic | Daftar permintaan Multi-Sig |
| `/api/multisig/approve` | Dynamic | Prosesor persetujuan Multi-Sig |
| `/api/multisig/simulate` | Dynamic | Simulator transaksi besar |
| `/api/multisig/reconcile` | Dynamic | Engine rekonsiliasi kas (Cron endpoint) |
| `/api/cron/digest` | Dynamic | Weekly WhatsApp digest (Vercel Cron) |
| `/api/cron/tender-remind` | Dynamic | Pengingat tender harian (Vercel Cron) |
| `/api/parser` | Dynamic | Ethical marketplace parser |
| `/api/profile/export` | Dynamic | Export data pribadi warga |
| `/api/profile/delete` | Dynamic | Hapus data PII warga |

---

## 📚 Dokumentasi Lengkap

Lihat folder [`docs/`](docs/README.md) untuk dokumentasi teknis, arsitektur, dan spesifikasi lengkap.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Database:** Supabase (PostgreSQL + RLS)
- **Hosting:** Vercel (Edge Network)
- **WhatsApp Gateway:** Fonnte
- **Session Auth:** Custom OTP WhatsApp + `jose` (JWT HS256)
- **Language:** TypeScript

> ⚠️ **Catatan:** `drizzle-orm` dan `drizzle-kit` telah **dihapus** dari proyek. Semua interaksi database menggunakan `@supabase/supabase-js` client secara langsung.

Lihat [`docs/SPECIFICATIONS/14_approved_open_source_stack.md`](docs/SPECIFICATIONS/14_approved_open_source_stack.md) untuk daftar lengkap.
