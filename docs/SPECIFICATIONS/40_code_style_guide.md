# 40_code_style_guide

# **`40_code_style_guide.md`**

**Status:** *Development Standards & Engineering Norms* | **Audience:** *AI Coder, Front-End Developer, System Architect*

## **I. Filosofi Coding: "Sovereign, Maintainable, & Predictable"**

Kode URUN adalah aset komunitas. Kode tersebut tidak hanya harus berjalan, tetapi harus mudah dibaca, diaudit, dan dipelihara oleh siapa pun di masa depan. Kita mengutamakan **keterbacaan di atas kecerdasan algoritma** dan **keamanan di atas kecepatan**.

## **II. Stack & Standar Teknologi**

AI Coder wajib mematuhi standar berikut dalam setiap baris kode:

* **Bahasa:** **TypeScript (Strict Mode)**. Tidak diperbolehkan menggunakan `any`. Gunakan `unknown` jika tipe data tidak pasti dan lakukan *type-narrowing*.  
* **Validasi Data:** Wajib menggunakan **Zod** untuk validasi *runtime* (input form, response API pihak ketiga). Jangan pernah mempercayai data tanpa validasi skema.  
* **Styling:** **Tailwind CSS**. Utamakan utilitas; tidak diperbolehkan menulis CSS custom kecuali dalam file `.module.css` yang sangat spesifik (dan jarang terjadi).  
* **Component Framework:** **React (Next.js App Router)**. Gunakan *Server Components* secara default. *Client Components* hanya jika diperlukan (interaktivitas/state).

## **III. Prinsip Arsitektur Kode**

### **1\. The Adapter Pattern (Mandatory)**

Dilarang memanggil SDK pihak ketiga secara langsung di dalam logika bisnis.

* *Salah:* Memanggil `midtransClient.charge()` langsung di komponen.  
* *Benar:* Buat `src/services/payments/midtrans-adapter.ts` dan panggil `paymentService.charge()` di komponen.

### **2\. Database & RLS**

* **Isolasi Tenant:** Setiap *query* ke database (Supabase) **WAJIB** menyertakan filter `community_id`.  
* **RPC First:** Gunakan fungsi Stored Procedure (RPC) untuk operasi yang melibatkan logika bisnis kompleks atau finansial.  
* **RLS Check:** Setiap kali Anda membuat *query*, pastikan kebijakan RLS tabel tersebut mengizinkan akses.

### **3\. Functional Programming (Pure Logic)**

* Logika perhitungan (misal: hitung pajak, hitung skor reputasi) harus ditulis sebagai **Pure Functions** yang tidak memiliki *side-effects* (tidak mengubah variabel luar, tidak mengakses API).  
* Setiap fungsi harus memiliki *Unit Test* sederhana jika memungkinkan.

### **4\. Atomic Design**

Komponen UI harus dibangun dengan prinsip *Atomic Design*:

* **Atoms:** Komponen dasar (Button, Input).  
* **Molecules:** Gabungan atom (LedgerEntry, WorkflowStatusBadge).  
* **Organisms:** Gabungan molekul (Data table, Dashboard section).

## **IV. Aturan Penamaan & Struktur (Naming Conventions)**

* **File:** `kebab-case` (misal: `workflow-status-badge.tsx`).  
* **Component:** `PascalCase` (misal: `WorkflowStatusBadge`).  
* **Variables:** `camelCase` (misal: `communityId`, `ledgerAmount`).  
* **Database Tables:** `snake_case` (misal: `workflow_processes`).

## **V. Mandat Penanganan Kesalahan (Error Handling)**

1. **No Silent Failures:** Dilarang mengabaikan error (`catch (e) {}` kosong adalah pelanggaran fatal).  
2. **Logging:** Setiap error wajib di-*log* ke *error tracking service* (misal: Sentry) atau tabel `system_audit_log`.  
3. **User Feedback:** Setiap *action* (transaksi, submit) wajib memberikan umpan balik kepada pengguna:  
   * `Idle`: Tombol normal.  
   * `Loading`: Tombol disabled \+ spinner.  
   * `Success`: Toast/Notifikasi sukses.  
   * `Error`: Pesan error yang jelas dan dapat dimengerti (bukan teknis).

## **VI. Contoh Pola Koding (The URUN Way)**

### **1\. Validasi Data dengan Zod**

TypeScript  
import { z } from 'zod';

const LedgerEntrySchema \= z.object({  
  amount: z.number().positive(),  
  entryType: z.enum(\['tender\_contribution', 'platform\_revenue', 'correction'\]),  
  actorId: z.string().uuid(),  
});

// Gunakan ini untuk memvalidasi input sebelum insert ke DB

### **2\. Penggunaan Adapter Pattern**

TypeScript  
// src/services/adapter.ts  
export interface PaymentProvider {  
  processPayment(amount: number): Promise\<void\>;  
}

// Implementasi spesifik  
export class MidtransAdapter implements PaymentProvider {  
  async processPayment(amount: number) { /\* ... \*/ }  
}

## **VII. Checklist Pra-Commit (Self-Audit untuk AI)**

Sebelum AI Coder menyelesaikan tugas:

1. \[ \] Apakah semua `community_id` sudah difilter?  
2. \[ \] Apakah ada hardcoded API key atau endpoint? (Jika ya, pindahkan ke `.env`).  
3. \[ \] Apakah fungsi ini mengikuti prinsip *Idempotency*?  
4. \[ \] Apakah komponen ini bisa diakses dengan *screen-reader*?  
5. \[ \] Apakah dokumentasi relevan diperbarui?

*Instruksi untuk AI:* "Panduan ini adalah hukum tertinggi dalam penulisan kode URUN. Jika Anda menemukan kode yang melanggar standar ini dalam codebase, Anda wajib melakukan *refactoring* segera setelah fitur utama selesai."

