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

| Variable | Keterangan |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `FONNTE_TOKEN` | Token WhatsApp gateway Fonnte |
| `FONNTE_WEBHOOK_SECRET` | Secret validasi webhook Fonnte |

---

## 🗺️ Routes Aplikasi

| Route | Tipe | Keterangan |
|-------|------|-----------|
| `/` | Static | Homepage & navigasi utama |
| `/catalog` | ISR (60s) | Katalog produk publik (SEO/AEO ready) |
| `/catalog/[slug]` | SSR | Detail produk dengan JSON-LD schema |
| `/leaderboard` | SSR | Papan keaktifan warga |
| `/multisig` | Client | Multi-Sig Command Center pengurus |
| `/api/webhook/whatsapp` | Dynamic | Webhook penerima pesan WhatsApp |
| `/api/multisig/requests` | Dynamic | Daftar permintaan Multi-Sig |
| `/api/multisig/approve` | Dynamic | Prosesor persetujuan Multi-Sig |
| `/api/multisig/simulate` | Dynamic | Simulator transaksi besar |
| `/api/parser` | Dynamic | Ethical marketplace parser |
| `/api/reconcile` | Dynamic | Engine rekonsiliasi kas harian |

---

## 📚 Dokumentasi Lengkap

Lihat folder [`docs/`](docs/README.md) untuk dokumentasi teknis, arsitektur, dan spesifikasi lengkap.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Database:** Supabase (PostgreSQL + RLS)
- **Hosting:** Vercel (Edge Network)
- **WhatsApp Gateway:** Fonnte
- **Language:** TypeScript

Lihat [`docs/SPECIFICATIONS/14_approved_open_source_stack.md`](docs/SPECIFICATIONS/14_approved_open_source_stack.md) untuk daftar lengkap.
