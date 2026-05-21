# 32_legal_compliance

# **32\_legal\_compliance.md**

**Status:** *Regulatory & Administrative Blueprint* | **Audience:** *Founder, Compliance Officer, Legal Partner*

## **I. Filosofi Legal: "Compliance by Design"**

URUN memandang regulasi bukan sebagai beban, melainkan sebagai standar keamanan. Karena URUN adalah "Infrastruktur Publik Digital", kami berkomitmen untuk memenuhi standar PSE Lingkup Privat (Komdigi) dan UU Pelindungan Data Pribadi (UU PDP) dengan menerapkan prinsip *Privacy by Design* pada setiap baris kode.

## **II. Roadmap Kepatuhan Administratif**

| Entitas/Regulasi | Status | Kebutuhan Utama |
| :---- | :---- | :---- |
| **PSE Lingkup Privat (Komdigi)** | **Wajib** | NIB (OSS), Kebijakan Privasi, Syarat & Ketentuan, Prosedur Moderasi Konten. |
| **UU PDP (Pelindungan Data)** | **Wajib** | Penunjukan DPO (Data Protection Officer), Data Mapping, Persetujuan Pengguna (Consent). |
| **Fintech/Escrow (Opsional)** | *TBD* | Jika layanan Escrow/Pembayaran dilakukan mandiri, lisensi Bank Indonesia (PJP) atau OJK mungkin diperlukan. |

## **III. Komponen Kebijakan Publik (Frontend Ready)**

Untuk memenuhi syarat PSE dan UU PDP, aplikasi URUN **WAJIB** menampilkan komponen berikut di situs publik:

1. **Kebijakan Privasi (Privacy Policy):**  
   * Menjelaskan data apa yang diambil (Nama, Kontak).  
   * Menjelaskan tujuan (Manajemen komunitas, efisiensi tender).  
   * Menjamin data tidak dijual ke pihak ketiga (Sovereign Core).  
2. **Syarat & Ketentuan (Terms of Service):**  
   * Aturan perilaku warga di komunitas.  
   * Tanggung jawab pengurus RT/RW sebagai moderator.  
   * Prosedur penanganan konten ilegal atau melanggar hukum.  
3. **Prosedur Moderasi Konten (Takedown Policy):**  
   * Mekanisme pelaporan (Report Button).  
   * Jangka waktu penanganan konten melanggar (Wajib sesuai peraturan Komdigi: 1x24 jam untuk konten mendesak/terlarang).

## **IV. Peta Jalan Implementasi Teknis (Untuk AI Coder)**

Agar sistem memenuhi syarat PSE dan UU PDP secara otomatis:

1. **Data Mapping:** AI Coder wajib memelihara dokumen data\_inventory.json yang memetakan jenis data apa saja yang tersimpan di kolom metadata (JSONB) pada catalog\_items dan profiles.  
2. **Consent Management:** Setiap pengguna baru yang mendaftar wajib mencentang persetujuan *Privacy Policy* & *Terms of Service*. Sistem wajib mencatat consent\_timestamp dan consent\_version di tabel profiles.  
3. **Moderation Tools:** AI wajib mengimplementasikan fungsi report\_content di 12\_protocol\_spec.md agar komunitas bisa melaporkan konten yang melanggar, yang kemudian masuk ke workflow\_processes untuk ditinjau oleh Admin.  
4. **Local Data Storage:** Mengingat UU PDP mewajibkan kepastian lokasi data, pastikan Supabase yang digunakan (jika memilih region tertentu) mematuhi batasan yurisdiksi atau telah memiliki klausa *data transfer* yang sah.

## **V. Mandat untuk Founder**

* **Pendaftaran PSE:** Segera daftarkan entitas (Yayasan/PT) ke sistem **OSS (Online Single Submission)** untuk mendapatkan NIB (Nomor Induk Berusaha). NIB ini adalah tiket utama untuk mendaftar PSE di portal Komdigi.  
* **DPO (Data Protection Officer):** Jika URUN berskala besar, tunjuk satu orang (bisa pengurus yayasan) untuk menjadi DPO yang bertanggung jawab menangani permintaan akses data dari warga atau pemerintah.  
* **Audit Berkala:** Gunakan 31\_compliance\_log.md sebagai lampiran saat proses audit oleh Komdigi untuk membuktikan bahwa sistem memiliki *traceability* (pelacakan) yang baik.

