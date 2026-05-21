# **Approved Open Source Stack**

**Status:** *Approved Reference* | **Versi:** 1.0.0 | **Tanggal:** 2026-05-21

**Author:** AI Coder (Antigravity) & System Design Council

**Target Lingkungan:** Vercel (Edge/Serverless Runtime) & Supabase (PostgreSQL)

## **I. Manifes Filosofi Teknologi URUN**

Pemilihan pustaka (*libraries*), perkakas (*tools*), dan kerangka kerja (*frameworks*) di bawah ini tunduk pada **3 Pilar Utama URUN**:

1. **Local Data Stewardship (Pilar 1):** Seluruh alat pelacak dan penyimpanan wajib bersifat *self-hosted* atau terenkripsi secara lokal. Tidak ada data pribadi warga yang bocor ke platform iklan eksternal.  
2. **Collective Efficiency (Pilar 2):** Teknologi harus ringan dan efisien guna menekan biaya sewa server hingga mendekati Rp 0 (efisiensi token dan runtime).  
3. **Human-Centric Resilience (Pilar 3):** Antarmuka wajib bersahabat untuk ponsel jadul dan koneksi internet marjinal di pelosok daerah.

## **II. Daftar Tumpukan Teknologi Resmi (Approved Stack)**

AI Coder wajib merujuk secara kaku pada daftar pustaka berikut dan dilarang menginstal modul di luar dokumen ini tanpa persetujuan arsitek sistem.

| Kategori | Pustaka/Alat | Tautan Referensi |
| ----- | ----- | ----- |
| **UI/UX** | Radix Primitives | [radix-ui.com](https://www.radix-ui.com/) |
|  | shadcn/ui | [ui.shadcn.com](https://ui.shadcn.com/) |
|  | Vaul | [github.com/emilkowalski/vaul](https://github.com/emilkowalski/vaul) |
|  | Embla Carousel | [embla-carousel.com](https://www.embla-carousel.com/) |
|  | Framer Motion | [framer.com/motion](https://www.framer.com/motion/) |
| **Data & Logic** | Drizzle ORM | [orm.drizzle.team](https://orm.drizzle.team/) |
|  | Supabase Vault | [supabase.com/docs/guides/database/vault](https://supabase.com/docs/guides/database/vault) |
|  | pg\_cron | [github.com/citusdata/pg\_cron](https://github.com/citusdata/pg_cron) |
|  | pgaudit | [github.com/pgaudit/pgaudit](https://github.com/pgaudit/pgaudit) |
|  | ts-pattern | [github.com/gvergnaud/ts-pattern](https://github.com/gvergnaud/ts-pattern) |
|  | Zod | [zod.dev](https://zod.dev/) |
| **SEO, AEO, GEO** | @vercel/og | [vercel.com/docs/functions/og-image-generation](https://vercel.com/docs/functions/og-image-generation) |
|  | Partytown | [partytown.builder.io](https://partytown.builder.io/) |
|  | schema-dts | [github.com/google/schema-dts](https://github.com/google/schema-dts) |
|  | PostGIS | [postgis.net](https://postgis.net/) |
| **Analitik/Legal** | Umami | [umami.is](https://umami.is/) |
|  | Formbricks | [formbricks.com](https://formbricks.com/) |
|  | pg\_anonymizer | [postgresql-anonymizer.com](https://postgresql-anonymizer.com/) |
|  | i18next | [i18next.com](https://www.i18next.com/) |
| **AI Agent/Monev** | Vercel AI SDK | [sdk.vercel.ai](https://sdk.vercel.ai/) |
|  | Langfuse | [langfuse.com](https://langfuse.com/) |
|  | Tremor | [tremor.so](https://www.tremor.so/) |
|  | pgTAP | [pgtap.org](https://pgtap.org/) |
|  | Pino | [getpino.io](https://getpino.io/) |
|  | Signoz | [signoz.io](https://signoz.io/) |

### **1\. Antarmuka (Frontend) & UI/UX Aksesibel**

Dirancang untuk menghadirkan kenyamanan interaksi mobile-first yang sehalus aplikasi WhatsApp bagi warga akar rumput.

* **Radix Primitives & shadcn/ui:**  
  * *Fungsi:* Pondasi komponen antarmuka tanpa gaya (*headless*) yang mematuhi standar aksesibilitas internasional (WAI-ARIA).  
  * *Urun Context:* Menjamin kompatibilitas *screen reader* (pembaca layar) bagi warga lansia atau tunanetra.  
* **Vaul (oleh Emil Kowalski):**  
  * *Fungsi:* Komponen laci bawah (*drawer*) yang dioptimalkan untuk perangkat seluler.  
  * *Urun Context:* Menampilkan opsi partisipasi tender warga dengan nuansa menu laci bawah khas aplikasi WhatsApp.  
* **Embla Carousel:**  
  * *Fungsi:* Karusel geser (*slider*) super ringan tanpa ketergantungan modul berat lainnya.  
  * *Urun Context:* Menampilkan daftar program gotong-royong aktif di layar utama ponsel warga secara mulus.  
* **Framer Motion (Optimized Core):**  
  * *Fungsi:* Animasi transisi tata letak deklaratif yang hemat memori browser.  
  * *Urun Context:* Mengurangi kecemasan tunggu warga saat memproses input transaksi kas.  
* **Tailwind Merge & clsx:**  
  * *Fungsi:* Utilitas penggabung kelas Tailwind CSS secara dinamis untuk menghindari konflik visual di runtime.

### **2\. Sistem Inti & Logika Data (Backend & DB)**

PostgreSQL dan Next.js Serverless/Edge Runtime dioptimalkan untuk performa ekstrim dan keamanan otonom.

* **Drizzle ORM (drizzle-orm):**  
  * *Fungsi:* ORM TypeScript teringan dengan dukungan penuh tipe data JSONB Postgres secara *type-safe*.  
  * *Urun Context:* Menjalankan query transaksi kas kolektif dengan latensi di bawah 10ms.  
* **Supabase Vault (pg\_vault):**  
  * *Fungsi:* Ekstensi PostgreSQL untuk enkripsi baris data tingkat tinggi menggunakan algoritma AES-GCM.  
  * *Urun Context:* Mengamankan penyimpanan FONNTE\_TOKEN atau kunci API Google secara terenkripsi langsung di basis data.  
* **pg\_cron:**  
  * *Fungsi:* Penjadwal tugas kronologis (*cron jobs*) di level PostgreSQL.  
  * *Urun Context:* Otomasi penalti reputasi harian dan pembersihan tender kedaluwarsa secara internal di level database tanpa memicu panggilan API eksternal.  
* **pgaudit & supautils:**  
  * *Fungsi:* Pustaka audit sistem dan pengamanan struktur hak akses *superuser*.  
  * *Urun Context:* Melacak kepatuhan manipulasi database untuk dicatat di 31\_compliance\_log.md.  
* **ts-pattern:**  
  * *Fungsi:* Pustaka *pattern matching* TypeScript untuk menjamin transisi status yang ketat.  
  * *Urun Context:* Mengunci status siklus hidup pada mesin status tabel tenders dan workflow\_processes.  
* **Zod:**  
  * *Fungsi:* Skema validasi runtime TypeScript yang ketat untuk seluruh muatan payload API / Webhook.

### **3\. Core Web Vitals, SEO, & AEO (Akses Informasi)**

Memastikan halaman publik URUN terindeks sempurna di mesin pencari lokal dan dikenali dengan baik oleh mesin kecerdasan buatan (AEO).

* **@vercel/og (Satori Engine):**  
  * *Fungsi:* Pembuat gambar pratinjau (*Dynamic Open Graph Images*) instan berbasis HTML/CSS di Edge Runtime.  
  * *Urun Context:* Menampilkan grafik status pencapaian dana dan kuota tender secara visual saat tautan program dibagikan ke WhatsApp.  
* **@builder.io/partytown:**  
  * *Fungsi:* Menjalankan skrip pelacak atau analitik di latar belakang menggunakan *Web Worker*.  
  * *Urun Context:* Menjamin tombol interaksi "Urun Sekarang" merespons instan tanpa terhambat pemrosesan telemetri di browser.  
* **schema-dts:**  
  * *Fungsi:* Tipe data TypeScript untuk Schema.org guna menyusun metadata JSON-LD secara valid.  
  * *Urun Context:* Memudahkan bot pencari AI (seperti Gemini) memberikan jawaban akurat atas pencarian produk lokal warga.  
* **PostGIS (PostgreSQL Extension):**  
  * *Fungsi:* Mesin kalkulasi geospatial di dalam database PostgreSQL.  
  * *Urun Context:* Melakukan kalkulasi pencarian radius komoditas pangan warga terdekat menggunakan fungsi ST\_DWithin.

### **4\. Analitik Berdaulat & Kepatuhan Legal (PDP Compliance)**

Membangun pertumbuhan komunitas yang sehat sekaligus patuh terhadap UU Pelindungan Data Pribadi (UU PDP No. 27/2022).

* **Umami Analytics / Plausible (Self-hosted):**  
  * *Fungsi:* Analitik web super ringan tanpa *cookies* pelacak individu.  
  * *Urun Context:* Mengukur interaksi halaman web agregat tanpa merekam data pribadi sensitif (IP Address disamarkan).  
* **Formbricks:**  
  * *Fungsi:* Pustaka survei mikro dalam aplikasi (*in-app survey*).  
  * *Urun Context:* Mengumpulkan umpan balik warga terhadap pengiriman barang pengadaan oleh penyedia jasa.  
* **postgresql-anonymizer (pg\_anonymizer):**  
  * *Fungsi:* Penyemaran (*masking*) data pribadi tingkat basis data secara dinamis.  
  * *Urun Context:* Menghapus identitas pengguna (PII) secara permanen sesuai regulasi "Hak untuk Dilupakan" jika warga keluar dari komunitas, tanpa merusak data keuangan historis ledger.  
* **i18next:**  
  * *Fungsi:* Pustaka pelokalan bahasa untuk menyajikan antarmuka bot dalam bahasa daerah (Sunda, Jawa, dsb.).

### **5\. AI Agent & Observabilitas Bot WhatsApp**

Memantau integritas Bot WhatsApp agar tidak mengalami halusinasi dan merespons warga secara deterministik.

* **Vercel AI SDK (@ai-sdk/react):**  
  * *Fungsi:* SDK standar untuk mengalirkan respons kecerdasan buatan (*streaming responses*).  
  * *Urun Context:* Mengatur aliran data respons model bahasa ke gerbang Fonnte tanpa terkena kendala serverless timeout.  
* **Langfuse (Open Source LLM Platform):**  
  * *Fungsi:* Pemantau dan pelacak biaya token AI, latensi, serta evaluasi performa model.  
  * *Urun Context:* Melacak kepatuhan bot asisten dalam merespons perintah transaksi kas warga agar tetap berada dalam koridor 3 Pilar.

### **6\. Visualisasi Dasbor & Telemetri Monev**

Memantau kesehatan infrastruktur serta menampilkan grafik neraca Buku Kas Kolektif secara transparan.

* **Tremor & Recharts:**  
  * *Fungsi:* Komponen visualisasi grafik keuangan berbasis Tailwind CSS yang ramah seluler.  
  * *Urun Context:* Menampilkan grafik sirkulasi surplus kas RT yang mudah dipahami warga awam.  
* **pgTAP:**  
  * *Fungsi:* Unit testing database berbasis SQL untuk membongkar dan menguji ketangguhan kebijakan RLS.  
  * *Urun Context:* Menguji ketahanan database secara otomatis di GitHub Actions sebelum deploy.  
* **Pino:**  
  * *Fungsi:* Logging JSON super cepat untuk memantau waktu respons API Fonnte.  
* **OpenTelemetry (OTel) & Signoz / HyperDX:**  
  * *Fungsi:* Dasbor pemantau infrastruktur (APM) open-source mandiri untuk mendeteksi dini eror webhook sebelum disadari warga.

## **III. Formula & Algoritma Determistik Sistem**

Sesuai **Aturan Sakral \#4 (Reputasi Deterministik)**, kalkulasi poin reputasi warga tidak boleh menggunakan faktor kebetulan (*randomness*). AI Coder wajib menerapkan formula linier absolut berikut di level trigger PostgreSQL (MIGRATION 005):

![][image1]Di mana konstanta ![][image2] dipetakan secara absolut berdasarkan tipe interaksi fisik berikut:

* ![][image3] : Transaksi tender sukses dibayar (tender\_contribution\_paid).  
* ![][image4] : Berpartisipasi aktif dalam tender kolektif (tender\_participation).  
* ![][image5] : Membawa anggota baru bertransaksi (successful\_referral).  
* ![][image6] : Pelanggaran transaksi / iuran terdeteksi (violation\_detected).  
* ![][image7] : Percobaan pemalsuan data transaksi (fraud\_attempt).

## **IV. Mandat Mandatori untuk AI Coder**

1. **Gunakan ORM Standar:** Seluruh interaksi PostgreSQL wajib menggunakan Drizzle ORM untuk menjamin keamanan tipe data dan pencegahan SQL Injection.  
2. **No Extravagant Packages:** Jangan menginstal pustaka di luar dokumen ini tanpa izin. Jika Anda membutuhkan alat utilitas baru, mintalah izin terlebih dahulu.  
3. **Kepatuhan RLS & pgTAP:** Sebelum menyelesaikan pekerjaan pengodean database, tulis *unit test* di pgTAP untuk menguji isolasi data community\_id di bawah kebijakan RLS.  
4. **Logging Semua Webhook:** Pastikan setiap payloads dari Fonnte divalidasi dengan Zod dan kegagalan respons dicatat dengan Pino.

eof  


[image1]: <data:image/png;base64,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>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAZCAYAAADXPsWXAAAAwUlEQVR4XmNgGDlAXl7+p4yMDCe6ONEAaEAVEP8H4qfockQDqAFgrKWlxYYuTxAoKCgUADU3A3Et1KB76GoIApBGZDaUz4ykBD8AakgG4m4YH+iqDqhBV5HV4QXIrkAWwyaOFcjJyYUBFU9FFweKTQYZApQ/iS6HAfDZRpRrgH73AOKF6OIwAHTFfKhBe9Dl4ICgLQwEXAOUsALiteji6ACoZh3UIEy1MBtIwSgGKCkpyaErIAYDw6gfxaBRMAoIAAAJkFhSOlmOQAAAAABJRU5ErkJggg==>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAAAZCAYAAABjNDOYAAAB2UlEQVR4Xu2Vv0rDUBTGq6Io6Fhc2qQNQqGO1cVFBAcnR30AX8BFB0EQXEQHQXHx/59ZRxf1AXwAVxWkg08gKlK/U2/g8oW2J0ua2vuDj+Se+92TnJObJJNxOBxJ4vv+Zy6XG+J414PGrEE1qMpznQjq+CoUCsvFYnFUHrjnebOIvbJPhWlMXeVyeYDnOw27Hksz7GuJdBgLN6F1k+SZPWmhUqn04/5WOM5IHahrA8djHBd5Xo0kss/NuM+ypAYUOqhtDsdigyRL0E44xsW3TIOebF9ayGazw0k2J5LE2j2po1QqjWibA91BVehWxvJxZl9D8AVfwKIDjiO2L8kw/8hzjYD/qpGwGy+Q6xznp9AJdIQ/yBjn0BCnOWiGH45x/VWJ2Z6mNDPLXLP5JMjn8xMsNHoa97XHcRGvZ0xNDxyPgIvMyRPleAg6fWaS3fNcUqDgeZb8eWQXclxkr5W/mj0W1A9cY1Iny9S923GEAsc5hwbNa+X/vbo1NGyS4jXo245FgGEKuuY4A8+NSdjSmxTK5lxCPzjtCWNmndRyaFmjGFMscY52oWkO6IXnww5g/NKyjiAIPC5cI7wGu5yrHSibU/+Ym3t/N8c39vw7tM1xOBwOh8PRdfwCfA7EFXa7dxcAAAAASUVORK5CYII=>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAAAZCAYAAABjNDOYAAAB80lEQVR4Xu2WvUsDQRDFA6IoKDamCbk7cxECsTwLsbG10VL/AAvBRhsbQRC0EC0ExUr8wloFmzRir4WVYmcnCJYWYqHxzbEH48QkcxaXxOwPHsnNzM7tvL18pFIWiyVJPM/7yGazPTLe9sCYZagMPctcq4JZds1Mn9CWzKsxTUIVi8UumW81MMf7IGDX4WysRAd6LGLhGrRimjzJmmYhCIJO7G9Jxjl0uGaOtyiG9xcUw6xzvLYu3FHmcAcraRowXHc9cwhjxC27LlHMdd1JXlcTLJj12OcRDTeMQQ+8rllIp9O9GnMk7ND1/LbgT40SolAo9MU1Bwd+SfP4vt8vc1XBIzaNRXsy7plveeRvZK4aqD+tJmzuBL2O8f4QOoD28ZdhSPbQEMcc3HfUzPII3cX6oSEDZCyCcrXySeA4zogUBh7HvnZknCTXc7DmmubJZDIDMlcBbjJBJyrjETjpI2PQlcwlBQaeksKeZ+gplHGSXM/BmkB94JoidbNUWLsZR9jssOyhQfOxQn6e9k21Il4m8VgFKBiDzmRcgppz07BubVIozQlNwFO2GsXoO05rTlgUR7JHo9CYg6dyATUvPIbre5ojl8t5PP4D/Jy5cnCNcMNt2asRaMwhULNu9v5qXr/y+bwj6/4VWnMsFovFYrG0Hd9Pxcl7lJ4p0QAAAABJRU5ErkJggg==>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAAAZCAYAAABjNDOYAAAB7klEQVR4Xu2WO0sDQRSFg+IT7UwTk50kLARiYREbLbS1stQfYCmIjYiClYKioOCjEl8ES/0B4g/QzsZKsLMTW7EQPWNmZDnJOrMpNtHMBwd275y5O/fu7LCJhMPhiBMhxHs6ne7heMuDxqxAn9Azj/1VUMuFqukNWudxa1SSbxWLxU4e/2vIOlKp1IC8zuVyw6q2D/YZyWazC5i4Bq2qJE/saRZKpVIH1rfI8SCe5y3Bc4/LNh2Tc1RtOwGrGTkpeK3u2wOWpgEvstvUHIzfqjoOKK5rswPmWWhb3+PhmyrJQ9DXLCSTyT5Tc/A59cJzmQjsHN/3u+ppTpU5cpIYKRQK/abm1AIvfVnVNcdjNcG3OQ3zIccR25eJMH7HY2HAXw4TFnaOXGe4PoGOoSP8Mvicw4Z6myPrgV45HoqcwDGNShY6HgeZTGaEhUZPYF17HJfi+Rr4H6EXjoeCh0zKN8pxDd70qWrQDY/FBQqeYmHNM3IXclyK50tE5V8n2vlpsyui7B74tqIIBQ5xDhuifFZ4xjyaeR2MGeuBYUxUTvNfgedKJrPxxoVtc/DjNw5fmePCtItUwZHEORqFTXNw2A/y+rWwmzbY/0M+n/d4go2QdJdzNQKb5ojKAVxVg9Io+/8NNs1xOBwOh8PRknwBqtjJgGXb+XMAAAAASUVORK5CYII=>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAAAZCAYAAABJhMI3AAACF0lEQVR4Xu2XPywDcRTHKw3CJhj03/VfSGqR1CQsJpPBYDF2l8ZACFMXQSIhLKKISYTBbGOxiYTRok1I7MKA70/eJa+v/d1dhza9+H2Sb+q+7/3e/d67q7sGAgaD4T9gWdZnJBLpkr7BIxjgCvQDlWXM76CnN+lxED+n3p9CoVC3jHuGivwpk8l0yLjfQB/3vCcZV2Sz2XYVSyaTMbKClD9QkeiFeDyex8ICtEZFnmWOX0FvV7ohwr+BSsLb0uU7whfRENVxkKX4Fpchql73hTemy9eCBTlo0z7GSdep+CPP8ysOQ7S/uqvcTCQSFvkz3Hek1gmoSJXvR3RDhD9CfS5wP51O9ys/FostcV8LEmexYE/68Hap0J2M6UD+qU7Y8AlqHePvInQIHeBVKi1rNALdEOFNUo/z3Mdxj/LVHrmvpVZxGyqkjTeDcDjcG41GR70IX8MhuV6hGyKeyIPKRzzPfbzi9FHvBe7XBIun1B0ifRtckSMqdi1jzUL9f8KApj1qQq5X6IYI2miIy9xMpVJR6nuO+zXRFK6AirnmKZC3UY9wkYZljUbgMETHp7Pl9q5IiRfSlyDnkgq65rYqLkP8RvyBe7i4i7r8CmgwdUnW8AvY+63aP566nTKGgY3L3qjfHe5VoX7iyAF5EU64LWu1MtjzB/QKlaAXqAy9QzmeZ995uCPP8PkFFXncYDAYDAaDwWDwyi8T1ePeNyCyDQAAAABJRU5ErkJggg==>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAAAZCAYAAABJhMI3AAACBklEQVR4Xu2Xv0tbURiGQwvWQjcJIvlxk8sFIU4NXbQtXRw6Obo65B/oLDioS7GDQnHSaosUB1FKwS1DabsIDll0FMQGVJyVdkmfk57A8UvuzYmYkEvPAy/mft97vnvPew8kJhIOh+N/wPO83+l0+rGsOywhwFlUQ1XZizvs6ULWFNSfojIqcvkgm836uVxuhb9fpNcKHWBdhUJhQPbjBvuomHuSfQVhTZoerUvps4L037B4Ec3pQSfSE1fY29ewEOm9oreP1tFCMpl8Ij3WmDdpvBE+PjQssSUqRE7iC/rzst4x3KCE3jWuGfpWB3lk+uJKmxCf31eITTcwTmPsiQqR+jj6rPe7ja7xf5e+SHgT0yxclXVq79Vg+geyFwb+rTDxYJ+Y9ZHPG+gDWuOnVCBndIM2IRbRqajV0A+zFknYcIUeFtrvBalUaiiTyTyzUT6fH5XrFVEhtgLvubWf4a/VCZH1BpycTR1kWfZ6BcF4BDRlqZdyveIOIX5Tfu49LHtN2Azu5DTiW+pEvKQxOaMbRIXYan9cH6oa6wbNehOYJtCurEvw7OkbtfX2KxYh7ojanzD/LfTijiRnxAWe/ad6/iAIHrXoVdTPHON6RHkJfsb0NeH7flYGZCNutixn9TM8843370viFzpDVXSFSsJ3rPdYP4HqX0Gz73A4HA6Hw+Fw2PIX/SDdpt+Mlo8AAAAASUVORK5CYII=>