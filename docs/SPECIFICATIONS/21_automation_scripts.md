# 21_automation_scripts

# **21\_automation\_scripts.md**

**Status:** *Operational Automation Blueprint* | **Audience:** *AI Coder, System Architect, Maintainers*

## **I. Filosofi Automasi: "The Autonomous Steward"**

Automasi dalam URUN berfungsi sebagai *steward* (penjaga aset digital) yang bertugas menjaga kesehatan data, integritas finansial, dan keterlibatan komunitas tanpa campur tangan manusia yang konstan. Script automasi **WAJIB** bersifat **Idempotent** (eksekusi berkali-kali memberikan hasil yang sama) dan **Non-Intrusif** (tidak mengganggu privasi warga).

## **II. Jenis Script & Eksekusi**

Automasi dijalankan melalui **Vercel Cron Jobs** atau **GitHub Actions** untuk memastikan *serverless execution* yang efisien.

| Kategori | Nama Script | Deskripsi | Frekuensi | Endpoint |
| :---- | :---- | :---- | :---- | :---- |
| **Financial** | reconcile\_ledger | Memvalidasi saldo total (ledger) vs workflow\_processes untuk mendeteksi anomali. | Harian (00:00 UTC) | `GET /api/multisig/reconcile` |
| **Engagement** | notify\_community\_digest | Merangkum aktivitas (tender/kontribusi) dan mengirim notifikasi via WhatsApp Fonnte. | Mingguan (Senin 07:00) | `GET /api/cron/digest` |
| **Engagement** | remind\_pending\_tender | Mengirim pengingat otomatis untuk tender yang mendekati batas waktu (due\_date). | Harian (09:00 UTC) | `GET /api/cron/tender-remind` |
| **System** | cleanup\_garbage | Menghapus entri workflow\_processes yang kadaluarsa (gagal/dibatalkan). | Bulanan | *(manual/pg\_cron)* |
| ~~**SEO/GEO**~~ | ~~generate\_sitemap~~ | ~~Memindai catalog\_items publik dan memperbarui sitemap.xml.~~ | ~~Dihapus~~ | ~~(ditangani Next.js native ISR)~~ |

> **Keamanan Cron:** Semua endpoint Vercel Cron (`/api/multisig/reconcile`, `/api/cron/digest`, `/api/cron/tender-remind`) dilindungi oleh header `Authorization: Bearer <CRON_SECRET>`. Tanpa nilai `CRON_SECRET` yang valid di environment variables, endpoint akan merespons **HTTP 401 Unauthorized**.

## **III. Spesifikasi Script Inti**

### **1\. generate\_sitemap.js (SEO/AEO Pipeline)**

Script ini wajib dijalankan setiap kali ada penambahan atau perubahan besar pada catalog\_items.

* **Logic:**  
  1. Query semua catalog\_items dengan status \= 'public'.  
  2. Generate file XML berisi URL: /{{community\_slug}}/catalog/{{slug}}.  
  3. Update file sitemap.xml di *root directory* publik.  
  4. *Ping* Google Search Console / Bing melalui API untuk indexing instan.

### **2\. reconcile\_ledger.js (Financial Integrity)**

Script ini berfungsi sebagai "Audit Internal" otomatis untuk mendeteksi ketidaksesuaian data.

* **Logic:**  
  1. Hitung total amount masuk dan keluar per community\_id di tabel ledger.  
  2. Bandingkan dengan saldo kas yang dilaporkan di workflow\_processes.  
  3. Jika terdapat selisih (imbalance), kirimkan *Alert* ke Admin Komunitas (via Bot WhatsApp) untuk tinjauan manual.  
  4. **PENTING:** Script dilarang mengubah data secara otomatis. Script hanya berhak mencatat temuan ke dalam log audit.

### **3\. remind\_pending\_tender.js (Community Engagement)**

Script ini mendukung fungsi "WhatsApp-First" URUN.

* **Logic:**  
  1. Query workflow\_processes di mana current\_state \= 'requested' dan due\_date dalam 24 jam ke depan.  
  2. Ambil community\_id dan detail catalog\_item terkait.  
  3. Kirim notifikasi via WhatsApp API ke warga/pengurus yang relevan.  
  4. Log pengiriman ke interaction\_log untuk memverifikasi apakah notifikasi berhasil terkirim.

## **IV. Mandat untuk AI Coder & Implementator**

1. **Idempotency Guarantee:** Setiap script wajib memeriksa processed\_at atau status di tabel relevan sebelum melakukan aksi. Script tidak boleh mengirimkan notifikasi yang sama dua kali dalam satu periode.  
2. **Stateless Execution:** Automasi dilarang menyimpan state lokal. Semua data harus ditarik langsung dari Supabase (database utama) sebagai *Source of Truth*.  
3. **Error Handling (Fail-Safe):** Jika script gagal (misal: koneksi database terputus), script wajib mengirim log error ke *Sentry* atau *log channel* komunitas. Jangan pernah membiarkan script *silent failure* (gagal diam-diam).  
4. **Resource Limits:** Mengingat penggunaan *serverless execution*, script tidak boleh melakukan *looping* tanpa batas. Gunakan *pagination* untuk memproses data dalam jumlah besar (batching).  
5. **Auditability:** Semua aksi yang dilakukan oleh script automasi wajib dicatat di tabel audit\_logs (atau interaction\_log) dengan actor\_id \= 'SYSTEM\_AUTO'. Jangan pernah menyamar sebagai user manusia dalam *log*.

### **V. Template Implementasi (Batch Processing)**

Contoh struktur *batch processing* untuk menjaga performa:

JavaScript  
// Contoh pola untuk AI Coder saat membuat script automasi  
async function processBatch() {  
  const { data, error } \= await supabase  
    .from('workflow\_processes')  
    .select('\*')  
    .eq('current\_state', 'requested')  
    .limit(50); // Batching untuk mencegah timeout serverless

  if (error) throw error;

  for (const item of data) {  
    // 1\. Eksekusi logika  
    // 2\. Tandai sebagai diproses agar tidak duplikasi  
    // 3\. Log hasil  
  }  
}

Script-script ini memastikan URUN tidak hanya "pintar" saat diakses, tetapi tetap "hidup" dan "aktif" mengawal kebutuhan ekonomi warga tanpa memerlukan *server administrator* manual.

