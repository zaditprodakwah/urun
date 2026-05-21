# **Laporan Audit Kritis & Evaluasi Kerentanan Sistem URUN**

**Status:** Tindak Lanjut Mendesak (Action Required)

**Fokus:** Evaluasi Celah Keamanan, Integritas Data, dan Friksi Sistem

Dokumen ini merinci temuan kritis pada *codebase* URUN yang memerlukan pembaruan, perbaikan, atau evaluasi mendalam sebelum sistem dapat dianggap layak untuk peluncuran (Production Ready).

## **I. Kerentanan Keamanan Arsitektur & Database**

### **1\. Potensi Bypass RLS via Service Role (src/lib/supabase-server.ts)**

* **Masalah:** Penggunaan klien Supabase di sisi server (*Server Components* / API Routes) berisiko tinggi jika diinisialisasi menggunakan SUPABASE\_SERVICE\_ROLE\_KEY. Kunci ini memiliki hak istimewa yang secara otomatis **mengabaikan seluruh kebijakan Row-Level Security (RLS)** yang telah ditetapkan di 20260521000004\_rls\_policies.sql.  
* **Dampak:** Jika kueri pada berkas server tidak secara manual dan eksplisit memfilter community\_id yang diekstrak dari JWT (cookie urun\_session), sistem rentan terhadap kebocoran data lintas-komunitas (Cross-Tenant Data Breach).  
* **Tindak Lanjut:** Evaluasi ulang seluruh pemanggilan supabase-server.ts. Pastikan setiap instansiasi klien untuk data warga tetap menggunakan kunci anonim/publik yang disuntikkan dengan konteks sesi JWT, bukan kunci *service role*, kecuali untuk otomasi murni (cron jobs).

### **2\. Celah Pemalsuan Webhook (src/app/api/webhook/fonnte/route.ts)**

* **Masalah:** Rute *webhook* yang menerima data dari gerbang WhatsApp (Fonnte) belum menunjukkan adanya mekanisme perlindungan yang kuat (seperti verifikasi *signature*, token statis, atau validasi *IP Whitelist* dari server Fonnte).  
* **Dampak:** Peretas dapat mengirimkan *POST request* palsu ke *endpoint* ini untuk meniru *payload* persetujuan pengurus atau manipulasi alur OTP, yang berpotensi memicu perubahan status pada workflow\_processes atau ledger tanpa otorisasi sah.  
* **Tindak Lanjut:** Wajib mengimplementasikan verifikasi HMAC atau token otorisasi rahasia pada *header* permintaan sebelum memproses *payload* dari *webhook*.

## **II. Ancaman Integritas Data & Skalabilitas API**

### **1\. Ketiadaan Idempotency Key pada Transaksi (src/app/api/v1/ledger/contribution/route.ts)**

* **Masalah:** Rute pencatatan iuran/kontribusi ke buku besar (ledger) tidak memberlakukan validasi Idempotency-Key secara ketat pada HTTP Headers.  
* **Dampak:** Karena ledger didesain secara *Append-Only* (tidak dapat ditimpa), ketidakstabilan jaringan seluler yang memicu *retry* otomatis dari peramban klien, atau pengguna yang mengklik tombol bayar dua kali, akan menghasilkan entri ganda. Ini akan merusak akurasi saldo keuangan komunitas.  
* **Tindak Lanjut:** Wajib memberlakukan validasi Idempotency-Key (misal via Redis/Vercel KV atau tabel transaksi sementara) untuk menolak permintaan dengan *key* yang sama dalam jangka waktu tertentu (misal 24 jam).

### **2\. Kerentanan Parser Marketplace tanpa Circuit Breaker (src/app/api/parser/route.ts)**

* **Masalah:** Fungsi serverless yang memanggil logika pengurai (src/lib/parser.ts) untuk mengambil data dari Tokopedia/Shopee sangat rentan terhadap perubahan struktur HTML/DOM dari pihak marketplace.  
* **Dampak:** Ketika marketplace memperbarui struktur web mereka, fungsi pengurai akan gagal (*crash*). Tanpa *Circuit Breaker*, sistem akan terus mencoba memproses permintaan (*infinite retries* atau pemborosan *timeout*), yang akan menguras kuota Vercel Edge Functions secara masif dan menimbulkan lonjakan biaya server.  
* **Tindak Lanjut:** Terapkan pola *Circuit Breaker* (batas toleransi kegagalan, misalnya 3x gagal berturut-turut). Jika batas tercapai, matikan fungsi pengurai sementara (misal 12 jam), kirim peringatan ke admin via sistem cron digest, dan paksa antarmuka web untuk *fallback* ke mode pengisian manual (*Graceful Degradation*).

## **III. Friksi Antarmuka Pengguna & Reaktivitas State**

### **1\. Data Basi (Stale State) pada Persetujuan Multi-Sig (src/app/multisig/page.tsx)**

* **Masalah:** Mengingat arsitektur sistem memungkinkan persetujuan Multi-Sig dilakukan secara asinkron via WhatsApp oleh pengurus A, sementara pengurus B memantau via web dasbor, halaman dasbor saat ini berpotensi tidak menangkap pembaruan tersebut secara *real-time*.  
* **Dampak:** Pengurus B melihat status transaksi yang belum disetujui, padahal pengurus A sudah menyetujuinya lewat WhatsApp beberapa detik sebelumnya. Ini memicu friksi koordinasi ganda dan potensi bentrokan perintah persetujuan (*race condition*).  
* **Tindak Lanjut:** Refaktor halaman ini menggunakan *Data Fetching library* yang mendukung revalidasi latar belakang (seperti integrasi SWR atau React Query dengan revalidateOnFocus dan polling interval tertentu), atau gunakan Supabase Realtime *subscriptions* untuk memantau perubahan pada workflow\_processes.

### **2\. Kebutaan Visual pada Audit Ledger (src/app/dashboard/page.tsx & Laporan)**

* **Masalah:** Mekanisme pembacaan buku besar (ledger) yang kaku menyulitkan persona pengguna pengurus (Ibu Aminah) untuk mendeteksi anomali selisih kas tanpa melakukan perhitungan memori manual.  
* **Dampak:** Meskipun skrip otomasi reconcile\_ledger.ts berjalan di latar belakang, warga dan pengurus kehilangan transparansi visual yang dijanjikan oleh sistem. Audit manual menjadi proses yang memakan waktu.  
* **Tindak Lanjut:** Antarmuka membutuhkan pengembangan *chart* atau grafik riwayat kas (menggunakan pustaka ringan seperti Recharts) dan filter komparasi kas (In vs Out per periode) langsung di halaman dasbor.

## **IV. Matriks Prioritas Tindak Lanjut**

| Komponen / Berkas | Evaluasi Masalah | Prioritas | Tindakan |
| :---- | :---- | :---- | :---- |
| src/app/api/webhook/fonnte/route.ts | Endpoint rentan dimanipulasi peretas. | **CRITICAL** | Tambahkan validasi token/IP *whitelist*. |
| src/lib/supabase-server.ts | Potensi bypass RLS global jika salah panggil. | **CRITICAL** | Audit pemakaian token klien vs *service role*. |
| src/app/api/v1/ledger/... | Risiko duplikasi data keuangan warga. | **HIGH** | Wajibkan & validasi Idempotency-Key. |
| src/app/multisig/page.tsx | UI tidak sinkron dengan *state* WhatsApp. | **HIGH** | Terapkan SWR/Realtime Subscription. |
| src/app/api/parser/route.ts | Boros *resource* jika DOM marketplace berubah. | **MEDIUM** | Implementasikan *Circuit Breaker* & notifikasi log. |
| src/app/dashboard/page.tsx | Laporan kas sulit dibaca untuk audit manual. | **MEDIUM** | Rancang visualisasi data historis. |

