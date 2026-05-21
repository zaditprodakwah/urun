# 12_protocol_spec

# **12\_protocol\_spec.md**

**Status:** *API & Integration Specification* | **Audience:** *AI Coder, System Architect, External Partners*

## **I. Filosofi Protokol: "Sovereign Interoperability"**

Protokol URUN dibangun untuk memfasilitasi interaksi sistem dengan entitas eksternal tanpa mengorbankan **Kedaulatan Data**. Protokol ini memungkinkan lingkungan luar (grup WhatsApp, channel Discord, aplikasi marketplace lokal, atau website komunitas) untuk mengeksekusi operasi ekonomi komunitas secara aman. URUN mengadopsi standar **RESTful API** untuk operasional publik dan **RPC (Remote Procedure Call)** untuk transaksi finansial yang membutuhkan integritas tinggi.

## **II. Spesifikasi Autentikasi & Keamanan**

Setiap permintaan ke API wajib menyertakan token otentikasi. URUN menggunakan pendekatan *Scope-Based Access Control* (SBAC) untuk memastikan akses terbatas sesuai kebutuhan.

| Komponen | Spesifikasi |
| :---- | :---- |
| **Authentication Scheme** | Authorization: Bearer \<JWT\_TOKEN\> |
| **Scopes** | catalog\_read (Public/SEO), ledger\_write (Transaction), community\_admin (Config) |
| **Tenant Isolation** | Header X-Community-ID wajib disertakan pada setiap request |

## **III. API Endpoint Specification (Core Routes)**

### **A. Katalog (SEO/AEO Friendly)**

Digunakan oleh *crawler* atau aplikasi pihak ketiga untuk menampilkan barang/jasa dengan *Schema.org JSON-LD* yang tersemat secara dinamis.

* GET /v1/catalog \- Mengambil daftar katalog (mendukung paginasi & filter).  
* GET /v1/catalog/{slug} \- Detail item (dengan *JSON-LD Schema* tersemat untuk pendukung GEO/AEO).

### **B. Ledger (Transactional Core)**

Digunakan oleh aplikasi vendor atau bot untuk mencatat aktivitas finansial dengan prinsip atomik.

* POST /v1/ledger/contribution \- Menambah dana (memerlukan actor\_id & item\_id).  
* POST /v1/ledger/fee-override \- Hanya untuk admin, mengubah persentase *service fee* (jika konfigurasi komunitas mengizinkan).

### **C. Webhook (Event Stream)**

Untuk sinkronisasi *real-time* dengan ekosistem (misal: Notifikasi ke Bot WhatsApp).

* POST /v1/webhook/events  
  * Event Type: transaction.created, workflow.updated, catalog.added.

### **D. Callback Kemitraan Afiliasi Eksternal (Inbound Revenue - Epic 4)**

Menerima callback/webhook komisi dari marketplace atau platform afiliasi pihak ketiga eksternal untuk diproses bagi hasil secara instan ke kas warga (70%) dan platform fee (30%).

* **Rute:** `POST /api/v1/affiliate/callback`
* **Keamanan Headers:**
  * `X-Urun-Signature`: String hex tanda tangan HMAC-SHA256 dari *raw request body* menggunakan `SESSION_SECRET`.
  * `X-Urun-Timestamp`: Integer unix epoch timestamp (detik). Ditolak jika selisih dengan waktu server $> 300$ detik (anti replay-attack).
* **Payload Request Body (JSON):**
  ```json
  {
    "product_id": "uuid-v4 (opsional jika ada product_slug)",
    "product_slug": "string (opsional jika ada product_id)",
    "commission_amount": 100000.00,
    "source_tx_id": "string (ID transaksi unik platform asal)",
    "platform": "string (contoh: 'tokopedia', 'shopee')",
    "idempotency_key": "uuid-v4 (kunci idempotensi unik wajib)"
  }
  ```
* **Status Tanggapan (Responses):**
  * **201 Created**: Pencatatan ledger ganda (`community_share` & `platform_revenue`) berhasil diproses pertama kali.
    ```json
    {
      "status": "success",
      "message": "Komisi kemitraan berhasil diproses secara otomatis.",
      "community_ledger_id": "uuid-v4",
      "platform_ledger_id": "uuid-v4",
      "calculations": {
        "total_commission": 100000,
        "platform_fee_30pct": 30000,
        "community_share_70pct": 70000
      }
    }
    ```
  * **200 OK**: Hit idempotensi berulang (kunci idempotensi terdeteksi sudah pernah diproses). Mengembalikan data respons yang sama persis tanpa menulis ulang ledger.
  * **401 Unauthorized**: Header signature hilang, timestamp kedaluwarsa ($> 300$ detik), atau tanda tangan HMAC tidak cocok.
  * **400 Bad Request**: Payload JSON cacat, parameter wajib kosong (`commission_amount <= 0`, `source_tx_id`, `platform`, `idempotency_key`), atau format `idempotency_key` bukan UUID v4.
  * **404 Not Found**: Barang katalog (`product_id` dan `product_slug`) tidak ditemukan di database.
  * **500 Internal Server Error**: Kesalahan server internal atau kegagalan transaksi database.

## **IV. Spesifikasi Webhook (Event Payload)**

Setiap peristiwa di sistem wajib mengirimkan notifikasi ke *webhook* yang terdaftar untuk menjaga sinkronisasi ekosistem.

JSON  
{  
  "event\_type": "transaction.created",  
  "community\_id": "uuid-v4",  
  "payload": {  
    "ledger\_id": "uuid-v4",  
    "amount": 50000.00,  
    "entry\_type": "platform\_revenue",  
    "timestamp": "2026-05-21T11:18:00Z"  
  }  
}

## **V. Mandat untuk AI Coder & Implementator**

1. **Idempotency:** Setiap POST request ke ledger wajib menyertakan idempotency\_key di header untuk mencegah duplikasi transaksi jika terjadi kegagalan jaringan.  
2. **Public Read-Only Strategy:** GET /v1/catalog dilarang memaparkan data privat (seperti daftar harga grosir khusus atau data profil warga). Hanya atribut publik yang boleh dikembalikan.  
3. **Strict Validation:** Permintaan yang mencoba mengakses community\_id di luar otorisasi token pengguna wajib ditolak (403 Forbidden), meskipun slug yang diminta valid.  
4. **Fee Calculation Transparency:** Saat API menampilkan harga, perhitungan biaya layanan wajib dilakukan secara *real-time* berdasarkan pengaturan di tabel communities.settings, tidak diperbolehkan menggunakan nilai yang di-*hardcode*.  
5. **Audit Trail:** Setiap aktivitas melalui API wajib tercatat di interaction\_log dengan mencantumkan source\_system (misal: bot\_wa, partner\_app, web\_ui) untuk keperluan audit independen.

## **VI. Prosedur Integrasi Pihak Ketiga**

Untuk menjamin kualitas dan keamanan, pihak ketiga (vendor/partner) wajib:

1. Melakukan pendaftaran client\_id melalui dasbor admin komunitas.  
2. Menerapkan *Signed Request* (menggunakan HMAC) jika melakukan integrasi transaksi finansial guna mencegah *Man-in-the-Middle Attack*.  
3. Mematuhi format *Schema Markup* yang telah ditentukan dalam 11\_data\_schema.md agar integrasi SEO/AEO tetap konsisten.

