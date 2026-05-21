# 30_maintenance_manual

# **30\_maintenance\_manual.md**

**Status:** *Operational Continuity & Emergency Blueprint* | **Audience:** *Maintainers, System Admins, AI Coder*

## **I. Filosofi Maintenance: "Sovereign Continuity"**

Pemeliharaan sistem URUN bukan sekadar perbaikan teknis, melainkan upaya menjaga **kedaulatan data dan kepercayaan komunitas**. Sistem yang berdaulat harus mampu bertahan dari gangguan eksternal (API *down*) dan internal (kesalahan data). Maintenance wajib mengikuti prinsip *minimal intervention*—biarkan sistem berjalan otonom melalui automasi, intervensi manual hanya dilakukan pada kondisi anomali atau *emergency*.

## **II. Rutinitas Pemeliharaan (Health Check Checklist)**

Maintainer wajib melakukan pengecekan berkala untuk memastikan "detak jantung" sistem tetap stabil.

| Frekuensi | Area | Tugas Utama |
| :---- | :---- | :---- |
| **Harian** | Log & Audit | Periksa interaction\_log untuk aktivitas mencurigakan atau gagal (*failed attempts*). |
| **Harian** | Ledger Integrity | Jalankan reconcile\_ledger.js untuk memvalidasi selisih kas. |
| **Mingguan** | SEO/GEO Index | Cek apakah sitemap.xml ter-update dan Google Search Console tidak melaporkan error. |
| **Bulanan** | RLS Security Audit | Audit kebijakan RLS (Row-Level Security) untuk memastikan tidak ada kebocoran data antar community\_id. |
| **Bulanan** | Cleanup | Eksekusi script cleanup\_garbage.js untuk arsip workflow\_processes yang kadaluarsa. |

## **III. Prosedur Darurat (Incident Response)**

Jika terjadi gangguan sistem, ikuti eskalasi protokol berikut:

### **1\. Gangguan Pihak Ketiga (API/WhatsApp Down)**

* **Tindakan:** Aktifkan **"Mode Manual"**.  
* **Langkah:**  
  1. Ubah konfigurasi di communities.settings ke mode: 'manual'.  
  2. Bot WhatsApp akan mengirimkan pesan otomatis: *"Sistem sedang dalam mode manual, silakan hubungi pengurus untuk pencatatan transaksi."*  
  3. Admin melakukan input data transaksi secara manual melalui dasbor admin untuk menjaga ledger tetap sinkron.

### **2\. Inkonsistensi Data (Ledger Anomaly)**

* **Tindakan:** Identifikasi dan Reversal.  
* **Langkah:**  
  1. Identifikasi ledger\_id yang bermasalah melalui laporan reconcile\_ledger.  
  2. **DILARANG:** Menghapus atau mengubah baris data yang salah.  
  3. **WAJIB:** Buat entri baru di ledger dengan entry\_type \= 'correction' dan amount yang merupakan kebalikan (*reversal*) dari transaksi salah.  
  4. Dokumentasikan alasan koreksi di audit\_logs.

### **3\. Kebocoran Data (Data Breach/RLS Failure)**

* **Tindakan:** *Lockdown* & *Reset*.  
* **Langkah:**  
  1. Segera matikan akses API melalui Edge Functions.  
  2. Jalankan skrip audit RLS\_Policy\_Checker untuk menemukan celah pada kebijakan RLS.  
  3. Setelah celah ditutup, lakukan rotasi JWT/Token pada semua profiles.

## **IV. Prosedur Disaster Recovery (Backup & Restore)**

URUN menganut prinsip **"Portable Sovereignty"**. Data tidak boleh terjebak di satu provider.

1. **Backup:** Lakukan *Export* data dari Supabase (SQL Dump) ke penyimpanan eksternal (S3/Cloud Storage) secara mingguan. Pastikan backup mencakup seluruh tabel yang dipartisi per community\_id.  
2. **Portability:** URUN menjamin data komunitas dapat diekspor ke format JSON/CSV kapan saja. Jika sistem harus berpindah *provider* (misal: pindah dari Supabase ke *Self-hosted PostgreSQL*), gunakan skrip migration\_tool yang tersedia di repositori untuk menjaga integritas ledger dan workflow\_processes.

## **V. Mandat untuk AI Maintainer**

AI yang bertugas menjaga sistem wajib mematuhi aturan operasional berikut:

1. **Non-Intrusive Monitoring:** Saat melakukan pemantauan, AI dilarang mengakses data identitas warga (PII). AI hanya boleh mengakses data agregat atau *log* sistem.  
2. **Report-Only Mode:** Kecuali diinstruksikan oleh Admin (via *governance command*), script automasi perbaikan (seperti reconcile) wajib berjalan dalam mode report-only (hanya melaporkan anomali, tidak mengubah data secara otomatis).  
3. **Documentation Traceability:** Setiap perubahan konfigurasi sistem (misal: mengubah batas *Multi-Sig threshold*) wajib dicatat dalam system\_changelog.md yang tersimpan di repositori, agar riwayat perubahan selalu transparan.  
4. **Public Transparency:** Untuk hal-hal yang berkaitan dengan kebijakan keuangan atau perubahan algoritma, AI wajib menyarankan Admin untuk mempublikasikan notifikasi di dasbor agar komunitas mengetahui perubahan yang terjadi.

**Catatan:**

Pemeliharaan adalah cermin dari profesionalisme sebuah infrastruktur. Sistem yang baik adalah sistem yang "membantu penggunanya tanpa harus membuat mereka merasa sedang diawasi oleh mesin yang rumit." Pastikan setiap tindakan pemeliharaan, sekecil apa pun, berfokus pada kelancaran operasional komunitas.

