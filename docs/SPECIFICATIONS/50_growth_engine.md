# 50_growth_engine

# **50\_growth\_engine.md**

**Status:** *Gamification & Referral Logic Blueprint* | **Audience:** *AI Coder, Growth Hacker, System Architect*

## **I. Filosofi Pertumbuhan: "Collective Participation"**

Pertumbuhan di URUN tidak diukur dari *vanity metrics* seperti jumlah pengguna yang "terjebak" di aplikasi. Pertumbuhan diukur dari **Kapasitas Ekonomi Kolektif** (volume tender yang sukses) dan **Partisipasi Aktif** (jumlah warga yang berkontribusi). Kami menolak *growth hacking* yang manipulatif/adiktif; pertumbuhan kami didorong oleh **Positive Reinforcement** dan **Social Proof**.

## **II. Viral Loop Mechanics (The Social Multiplier)**

URUN mengandalkan *Viral Loop* yang berbasis pada penyelesaian masalah, bukan sekadar berbagi konten.

### **1\. Referral Logic (Tender-Linked)**

Referral tidak diberikan hanya karena mendaftar, melainkan karena **"Membawa Nilai"** bagi komunitas.

* **Mekanisme:** Setiap catalog\_item (terutama tender) memiliki *Dynamic Sharing Link*.  
* **Reward:** Jika seorang warga (User A) membagikan link ke warga lain (User B) dan User B menyelesaikan transaksi/kontribusi, User A mendapatkan Reputation Boost otomatis melalui Reputation\_Engine.  
* **Social Multiplier:** Jika sebuah tender mencapai 100% pendanaan tepat waktu, semua warga yang membagikan link tersebut mendapatkan bonus reputasi tambahan (*multiplier*).

### **2\. Micro-Community Leaderboards**

Untuk mendorong partisipasi tanpa kompetisi toksik, sistem menyediakan *Leaderboard* berbasis RT/Komunitas.

* **Tampilan:** Menampilkan "Top 5 Kontributor Minggu Ini" di dashboard RT/RW.  
* **Fungsi:** Sebagai pengakuan sosial (*social recognition*) yang memperkuat ikatan antar warga, bukan untuk membandingkan kekayaan, melainkan dedikasi pada kepentingan bersama.

## **III. Gamification Engine (Reputation Scoring)**

reputation\_score di tabel profiles adalah pusat dari *growth engine* kami.

| Aktivitas | Dampak Reputasi | Rasional |
| :---- | :---- | :---- |
| **Transaksi Sukses** | \+5 pts | Kepercayaan finansial. |
| **Berhasil Ajak Warga** | \+2 pts | Pertumbuhan komunitas. |
| **Tender Tepat Waktu** | \+3 pts | Efisiensi kolektif. |
| **Pelanggaran** | \-10 pts | Menjaga integritas ekosistem. |

**Mandat:** Perhitungan skor wajib dilakukan oleh Reputation\_Engine di 22\_algorithm\_spec.md. Perubahan skor wajib tercatat di interaction\_log.

## **IV. Anti-Gaming & Fraud Prevention**

Karena reputasi memiliki nilai sosial dan akses (misal: syarat untuk mengajukan tender besar), AI wajib mencegah manipulasi ("Gaming the System").

1. **Transaction Velocity Limit:** Dilarang memberikan reputasi jika transaksi dilakukan dalam durasi yang tidak masuk akal (misal: 10 transaksi dalam 1 menit).  
2. **Anti-Self-Dealing:** Reputasi tidak bertambah jika warga bertransaksi dengan dirinya sendiri atau dengan akun yang memiliki alamat IP/Perangkat yang sama.  
3. **Audit Check:** Script reconcile\_ledger.js secara berkala memeriksa pola transaksi mencurigakan yang bertujuan menaikkan reputasi secara artifisial.

## **V. Mandat untuk AI Coder & Growth Hacker**

1. **Transparency:** Setiap warga yang mendapatkan poin reputasi wajib mendapatkan notifikasi: *"Anda mendapatkan \+2 poin karena membantu tender \[Nama Tender\] sukses\!"*. Jangan pernah memberikan poin tanpa penjelasan.  
2. **Determinism:** Algoritma pertumbuhan harus bersifat deterministik. Jangan menggunakan probabilitas/gacha dalam pemberian *reward* reputasi.  
3. **No-Vanity Metrics:** Jangan tampilkan jumlah "Followers" atau "Likes" di UI. Fokuslah pada metrik yang menunjukkan kesehatan komunitas: "Warga yang aktif", "Dana yang dihemat", atau "Proyek yang diselesaikan".  
4. **Data Stewardship:** AI dilarang mengirimkan data perilaku *user* (misal: "Siapa yang paling sering mengklik tender") ke layanan pihak ketiga untuk kebutuhan analitik pertumbuhan eksternal. Gunakan interaction\_log internal saja.

*Instruksi untuk AI:* "Growth di URUN adalah konsekuensi dari sistem yang bekerja dengan baik, bukan hasil dari manipulasi user. Saat Anda membangun modul ini, tanyakan pada diri sendiri: 'Apakah fitur ini membuat warga lebih peduli pada komunitasnya, atau hanya membuat mereka lebih sering membuka aplikasi?' Jika jawabannya yang kedua, Anda harus mendesain ulang fitur tersebut."

