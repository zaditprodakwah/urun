# CHANGELOG

Semua pembaharuan, rilis, perbaikan bug, dan optimasi arsitektur sistem URUN (Micro-Community Operating System) didokumentasikan di sini.

## [Unreleased] - 2026-05-22

### 🛡️ Keamanan & Kepatuhan Database (Supabase / PostgreSQL)
* **[NEW]** Migrasi `20260522000004_fix_idempotency_and_thresholds.sql`.
* **[NEW]** Tabel konfigurasi global `global_settings` untuk mengatur parameter sistem terpusat (contoh: ambang batas multi-sig). Menggantikan sistem hardcode COALESCE yang kaku.
* **[FIX]** **Celah Kritis Idempotensi & Multi-sig:** Menambahkan kolom `idempotency_key` (UNIQUE) pada antrean tabel `multisig_requests`. RPC `process_ledger_entry` kini memeriksa duplikasi kunci di tabel `ledger` maupun `multisig_requests`, sehingga mematikan potensi *double-spending* atau *double-queueing* jika terjadi *network retry* dari perangkat klien.

### ⚙️ TypeScript & Serverless Optimizations
* **[FIX]** **Race Condition Idempotensi:** Menyempurnakan `checkIdempotency` (`src/lib/idempotency.ts`) agar menangkap *Unique Constraint Violation* (Kode: 23505). Jika ada dua eksekusi paralel pada milidetik yang sama, salah satunya akan ditolak dengan rapi dengan status HTTP 409 (Conflict).
* **[FIX]** **Presisi Pecahan Finansial (Floating-Point Bug):** Merombak komputasi uang pada mesin audit `reconcile_ledger.ts`. Seluruh proses rekonsiliasi yang tadinya memakai tipe desimal kasar (`parseFloat`) kini diubah sementari menjadi format integer *cents* (`Math.round(amount * 100)`). Hal ini membersihkan anomali peringatan palsu akibat sisa pecahan dari spesifikasi `IEEE 754`.
* **[FIX]** **Serverless Execution Timeout:** Mengubah logika sekuensial linear pengiriman WhatsApp `P1 Alert` pada mesin audit menjadi asinkron paralel menggunakan `Promise.allSettled`. Metode ini mengamankan *cron job* Vercel dari bahaya *timeout* (mati di tengah eksekusi) karena hambatan API eksternal (Fonnte). 

### 🖥️ Frontend & Antarmuka Warga
* **[NEW]** Halaman **Changelog Publik** (`/changelog`): Merupakan rute transparansi agar warga dapat melacak pembaruan platform secara real-time.
* **[UPDATE]** **Mandatory Consent Box (`/login`):** Warga dan pengurus kini diwajibkan untuk menekan centang persetujuan terhadap Syarat Ketentuan, Kebijakan Privasi, serta meluangkan waktu memahami Dokumentasi URUN, sebelum bisa memicu pengiriman OTP atau *Magic Link*.
