# 51_marketplace_parser_handbook

# **`51_marketplace_parser_handbook.md`**

**Status:** *Ethical Data Integration Blueprint* | **Audience:** *AI Coder, System Architect*

## **I. Filosofi Integrasi: "Ethical Data Harvesting"**

Sistem parser marketplace URUN tidak dibangun untuk melakukan *data mining* invasif. Tujuannya murni untuk mendukung **Collective Procurement** (Pembelian Kolektif), memungkinkan warga membandingkan harga secara transparan dan melakukan tender kolektif untuk kebutuhan pokok. Kami memegang teguh prinsip **transparansi, etika, dan penghormatan terhadap ketentuan layanan (ToS) pihak ketiga**.

## **II. Prinsip Etika (The "No-Spy" Rule)**

AI Coder dan sistem parser wajib mematuhi batasan etika berikut:

1. **Strictly Product-Only:** Hanya data produk yang diizinkan untuk diambil (Judul, Harga, SKU, Kategori, Foto, Link).  
2. **PII Prohibition:** **DILARANG KERAS** mengambil data pengguna, ulasan pembeli, nama penjual, profil toko, atau data pribadi apa pun dari marketplace.  
3. **Robots.txt Compliance:** Sistem wajib menghormati `robots.txt` dari setiap platform. Jika platform melarang bot, parser harus berhenti dan mengarahkan warga ke mode input manual.  
4. **No-Aggressive Scraping:** Dilarang melakukan *bombardir request* yang menyebabkan *DDoS* pada marketplace. Gunakan *rate-limiting* yang ketat (misal: 1 request per detik per IP).

## **III. Arsitektur Parser (The Adapter Engine)**

Parser wajib dibangun sebagai *Independent Adapter* (sesuai `13_external_services.md`) untuk memisahkan logika scraping dari logika bisnis utama.

### **1\. Adapter Interface**

Setiap marketplace (Shopee, Tokopedia, dll.) harus memiliki *Adapter* sendiri yang mengimplementasikan interface standar:

TypeScript  
interface MarketplaceAdapter {  
  fetchProductDetails(url: string): Promise\<ProductData\>;  
  injectAffiliateLink(url: string): string;  
}

### **2\. Execution Flow**

1. **Request:** User atau System (melalui `catalog_items`) meminta data produk.  
2. **Adapter Worker:** *Serverless function* melakukan *fetch* data.  
3. **Data Cleaning (Zod):** Data mentah dibersihkan dan divalidasi menggunakan Zod sebelum disimpan ke `metadata` (JSONB).  
4. **Affiliate Injection:** Jika fitur afiliasi aktif, sistem otomatis mengganti URL asli dengan link afiliasi URUN.  
5. **Storage:** Data bersih disimpan di `catalog_items.metadata`.

## **IV. Spesifikasi Integrasi & Affiliasi**

### **1\. Real-time Affiliate Injection**

Sistem tidak boleh mengubah link produk di database secara permanen (untuk menjaga integritas data).

* **Strategi:** Simpan `original_link` di metadata, lakukan *Affiliate Injection* saat link akan dirender (JIT \- Just In Time) oleh *Edge Function*.  
* **Keuntungan:** Jika program afiliasi marketplace berubah, Anda cukup mengubah *injector logic* di satu tempat, tidak perlu melakukan *batch update* ribuan record database.

### **2\. Circuit Breaker**

Jika sebuah marketplace sering memblokir IP atau mengganti struktur HTML, sistem harus:

1. Mendeteksi kegagalan berturut-turut (misal: 3 kali gagal).  
2. Mengaktifkan *Circuit Breaker* (menonaktifkan parser untuk platform tersebut selama 24 jam).  
3. Mengirim notifikasi ke admin (via `21_automation_scripts.md`) bahwa parser perlu diperbarui.

## **V. Mandat untuk AI Coder**

1. **No-Hardcoding:** Jangan pernah menyimpan API Key atau konfigurasi parser di dalam kode. Gunakan *Environment Variables*.  
2. **Standardization:** Semua produk dari berbagai marketplace wajib di-*map* ke kategori standar URUN (misal: `Sembako`, `Peralatan Pertukangan`) agar sistem `Recommendation Engine` bisa bekerja dengan data yang seragam.  
3. **Ghost Caching:** Gunakan *caching* (Redis/Vercel KV) untuk hasil *scraping* yang sering diakses (misal: harga minyak goreng). Jangan melakukan *request* ke marketplace setiap kali ada warga yang membuka halaman, untuk menghemat kuota dan mematuhi etika *crawling*.  
4. **Schema Integrity:** Pastikan metadata hasil parsing selalu memenuhi standar JSON-LD (Schema.org) yang didefinisikan dalam `11_data_schema.md`.

*Instruksi untuk AI:* "Parser ini adalah mata dan telinga komunitas terhadap harga pasar. Anda harus memastikan mata ini bersih (tidak mencuri data orang) dan tidak terlalu agresif (tidak merusak sistem marketplace). Jika Anda ragu apakah sebuah data boleh diambil atau tidak, **default-nya adalah tidak ambil**."

