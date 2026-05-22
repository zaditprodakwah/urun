# 04_ux_personas

# **04\_ux\_personas.md**

**Status:** *User Research Data* | **Audience:** *AI Coder & UI/UX Designer*

## **I. Aktor Utama (The User Personas)**

Ekosistem URUN dibangun berdasarkan pemahaman mendalam terhadap profil pengguna di tingkat komunitas lokal. Pengembangan fitur wajib merujuk pada tiga persona utama berikut untuk menjamin fungsionalitas yang tepat guna.

### **1\. Ibu Aminah (55 thn, Bendahara RT / Penggerak)**

* **Karakter:** Pengelola kas, memiliki keterbatasan terhadap teknologi kompleks, namun memegang otoritas kepercayaan komunitas.  
* **Pain Points:** Beban administrasi manual (buku kas fisik), risiko kehilangan catatan, dan keletihan melakukan penagihan iuran secara konvensional via WhatsApp.  
* **Expectation:** Dasbor transparan yang menunjukkan status pembayaran warga secara otomatis, laporan keuangan instan, dan alur kerja yang meminimalkan input manual.  
* **Mandat untuk AI:** UI wajib mengedepankan keterbacaan tinggi (*high contrast*), tipografi berukuran besar, navigasi minimalis, dan alur "Satu Klik" untuk setiap aksi.

### **2\. Pak Budi (42 thn, Pedagang Grosir Lokal / Supplier)**

* **Karakter:** Pragmatis, berorientasi pada margin keuntungan, sangat sibuk dengan operasional logistik.  
* **Pain Points:** Ketidakpastian stok barang, kurangnya visibilitas terhadap permintaan agregat warga, serta keterbatasan jangkauan pemasaran ke warga sekitar secara kolektif.  
* **Expectation:** Sistem yang menyediakan data tren kebutuhan (prediksi permintaan), sehingga stok barang lebih efisien dan terarah.  
* **Mandat untuk AI:** Dasbor harus menampilkan visualisasi data stok & tren pasar, serta tombol "Tender Lokal" yang sangat responsif.

### **3\. Mas Rio (28 thn, Warga Muda / Tech-savvy)**

* **Karakter:** Profesional muda, produktif, malas dengan birokrasi fisik, namun ingin berkontribusi pada lingkungan.  
* **Pain Points:** Merasa terganggu dengan admin grup WhatsApp yang *spamming*, serta enggan melakukan proses manual yang memakan waktu.  
* **Expectation:** Otomatisasi pembayaran (e-wallet), cara cepat berkontribusi dana, dan transparansi kas yang dapat diakses kapan saja.  
* **Mandat untuk AI:** Fokus pada *Command-based interaction* (via bot WhatsApp) atau *shortcut* UI agar interaksi dapat dilakukan tanpa membuka dasbor yang berat.

### **4\. Pak Harjo (50 thn, Investor / Eksekutif Strategis)**

* **Karakter:** Memikirkan *Return of Investment* secara makro, memonitor perputaran kas, dan mengawasi skala pertumbuhan aplikasi secara agregat (Level Nasional/Provinsi).
* **Pain Points:** Terlalu banyak detail mikro (transaksi individu warga), butuh *bird's-eye view* atau metrik performa (KPI).
* **Expectation:** Dasbor *Executive Center* yang menyediakan visualisasi grafik dan volume kas tanpa mengekspos privasi data warga secara spesifik.
* **Mandat untuk AI:** UI *Executive Dashboard* fokus pada High-Level Data (SVG/Canvas Charts) dan *readonly* total. Tidak ada tombol edit atau delete data.

### **5\. Bu Dewi (45 thn, Auditor / Pemerintah)**

* **Karakter:** Fokus pada kepatuhan aturan (Compliance), akuntabilitas, transparansi, dan verifikasi aliran dana (Ledger).
* **Pain Points:** Kesulitan memverifikasi apakah laporan keuangan telah dimanipulasi atau tidak. Kekhawatiran atas privasi data pribadi (*PII*).
* **Expectation:** Modul *Compliance* khusus yang bisa mengaudit ledger wilayah tertentu (Kecamatan/Desa) menggunakan rekonsiliasi hash kriptografi untuk membuktikan integritas, namun data warga disamarkan menjadi "Warga_Anonim".
* **Mandat untuk AI:** Tabel data berdensitas tinggi (*High-Density*) khusus untuk verifikasi bukti, serta masking mutlak pada NIK dan Nama Lengkap warga.

## **II. Interaction Matrix (The "How They Use URUN")**

| Fitur | Ibu Aminah | Pak Budi | Mas Rio |
| :---- | :---- | :---- | :---- |
| **Papan Urun** | Pantau iuran masuk | Update stok/tender | Klik bayar/kontribusi |
| **Ledger Kas** | Input & Verifikasi | Cek transparansi | Cek transparansi |
| **Bot WA** | Notifikasi warga | Terima orderan | Balas cepat/konfirmasi |

## **III. AI Strategy for User Experience**

Pengembangan fitur oleh AI wajib mematuhi aturan strategi pengalaman pengguna berikut:

1. **Adaptive Interface:** Sistem harus menerapkan *context-aware layout*. Pengguna dengan peran "Admin" (Ibu Aminah) mendapatkan fitur *Financial Reporting* sebagai tampilan utama. Pengguna "Warga" (Mas Rio) mendapatkan fitur *Quick-Action* sebagai tampilan utama.  
2. **Accessibility (The Mother-Test):** Setiap antarmuka wajib lulus uji penggunaan oleh pengguna dengan literasi digital rendah. Jika fitur memerlukan lebih dari tiga klik untuk mencapai fungsi utama, sistem wajib melakukan *refactoring* alur kerja.  
3. **WhatsApp-First Logic:** Seluruh fungsi krusial di aplikasi **wajib** memiliki *mirror* (bayangan) fungsional di WhatsApp. Sistem harus memastikan data dapat dipanggil melalui perintah teks sederhana tanpa memaksa pengguna beralih ke UI dasbor.

