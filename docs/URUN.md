# 00\_master\_roadmap

# **00\_master\_roadmap.md**

**Status:** *Project Management Overlay* | **Audience:** *Founder, AI Coder, System Architect*

## **I. Filosofi Roadmap: "Evolutionary Sovereignty"**

Pembangunan URUN tidak mengikuti model *Agile* korporat tradisional yang fokus pada *feature shipping* untuk memanen atensi. URUN mengikuti **Roadmap Evolusioner**, di mana setiap fase membangun fondasi kedaulatan baru bagi komunitas. Fokus utama adalah **"Sovereign Core"** (keamanan dan kedaulatan data) sebelum berpindah ke **"Scaling & Growth"**.

## **II. Peta Jalan Pengembangan (Milestones)**

### **Fase 1: The Sovereign Core (Infrastructure & Database)**

*Fokus: Membangun fondasi yang aman, terisolasi, dan patuh hukum.*

1. **Database Provisioning:** Setup Supabase dengan kebijakan RLS (Row-Level Security) untuk isolasi community\_id.  
2. **Core Schema Deployment:** Implementasi tabel communities, profiles, catalog\_items, dan ledger.  
3. **Auth & Identity:** Integrasi Supabase Auth dengan penyesuaian untuk identitas komunitas.  
4. **Compliance Setup:** Registrasi PSE (Komdigi) dan implementasi *Privacy Policy* dasar sesuai 32\_legal\_compliance.md.

### **Fase 2: The Community Utility (MVP \- Minimum Viable Protocol)**

*Fokus: Menyediakan alat bantu nyata bagi pengurus dan warga.*

1. **WhatsApp Integration:** Membangun *Webhook Handler* dan *Adapter* untuk interaksi pesan.  
2. **Ledger Engine:** Membangun fungsi RPC untuk pencatatan transaksi yang *append-only*.  
3. **UI/UX Foundation:** Implementasi component\_library.md (Button, LedgerEntry, WorkflowStatusBadge).  
4. **Workflow State Machine:** Implementasi workflow\_processes untuk mengelola tender/transaksi.

### **Fase 3: Growth & Visibility (SEO, AEO & Marketplace)**

*Fokus: Menggunakan algoritma untuk meningkatkan partisipasi komunitas.*

1. **Public Catalog Rendering:** Implementasi ISR/SSR untuk SEO dan integrasi JSON-LD dinamis.  
2. **Growth Engine:** Implementasi logika referral, leaderboard, dan insentif reputasi (50\_growth\_engine.md).  
3. **Marketplace Parser:** Membangun sistem *auto-affiliate injection* untuk produk kebutuhan warga.  
4. **SEO/GEO Pipeline:** Automasi sitemap dan *Local Search* optimization.

### **Fase 4: Sovereign Autonomy (Resilience & Decentralization)**

*Fokus: Menjadikan sistem mandiri, tangguh, dan anti-rapuh.*

1. **Resilience Layer:** Implementasi *Offline-First* dengan CRDTs untuk sinkronisasi data saat internet terputus.  
2. **Advanced Financial Guardrails:** Implementasi Multi-Sig untuk transaksi bernilai tinggi.  
3. **Federated Intelligence:** Setup *Federated Learning* untuk analitik tren yang menjaga privasi.  
4. **Interoperability:** Membuka API untuk pihak ketiga sesuai 12\_protocol\_spec.md.

## **III. Matriks Prioritas (The "Should-We-Build-This" Test)**

Sebelum AI Coder memulai fitur baru, fitur tersebut harus melalui matriks ini:

| Kriteria | Pertanyaan Kunci | Jika Gagal |
| :---- | :---- | :---- |
| **Sovereignty** | Apakah warga memegang kontrol data? | **Ditolak** |
| **Utility** | Apakah ini membantu efisiensi warga? | **Ditolak** |
| **Compliance** | Apakah ini melanggar UU PDP? | **Ditolak** |
| **Scalability** | Apakah fitur ini membebani operasional manusia? | **Wajib Automasi** |

## **IV. Instruksi untuk AI Coder & AI Project Manager**

1. **Consistency:** Saat mengerjakan Fase 2, AI dilarang mengubah struktur database Fase 1 tanpa menjalankan migration\_script yang sesuai dengan 11\_data\_schema.md.  
2. **Documentation Sync:** Setiap *milestone* yang selesai wajib ditandai di 31\_compliance\_log.md jika melibatkan perubahan akses data atau logika finansial.  
3. **Maintenance Protocol:** Selama fase pengembangan, AI wajib menjalankan 21\_automation\_scripts.md secara rutin di lingkungan *staging* untuk memastikan *self-healing* sistem tetap berjalan.

**Roadmap ini adalah kompas Anda.** Kita tidak membangun sistem yang "besar" di awal, kita membangun sistem yang "benar" di awal, lalu membiarkannya tumbuh secara otonom melalui automasi.

# 01\_manifesto

# **`01_manifesto.md`**

**Status:** *Core Context (The Source of Truth)* | **Audience:** *AI Core Logic, Investors, Partners, and Stakeholders*

## **I. Esensi Eksistensial**

URUN adalah infrastruktur digital untuk **Collective Agency** (Daya Bertindak Kolektif). URUN lahir sebagai antitesis terhadap fragmentasi komunitas yang disebabkan oleh model platform ekonomi ekstraktif. URUN memosisikan diri sebagai **Sistem Operasi Komunitas Mikro** yang mengembalikan kedaulatan data dan ekonomi kepada warga di tingkat RT/RW dan komunitas afinitas, bukan kepada entitas korporasi global.

## **II. Doktrin Kedaulatan (The Sovereign Pillars)**

Setiap pengembangan teknologi, strategi bisnis, dan keputusan operasional **WAJIB** tunduk pada tiga pilar utama:

1. **Local Data Stewardship:** Data adalah aset milik komunitas. Eksploitasi data untuk kepentingan pihak ketiga secara sepihak dilarang keras. Data komunitas bersifat terisolasi (*siloed*) secara logis untuk menjamin privasi dan kedaulatan lokal.  
2. **Collective Efficiency:** Sistem memprioritaskan efisiensi ekonomi komunitas melalui *Collective Procurement* dan pengelolaan aset bersama. Keuntungan dari efisiensi ini mutlak menjadi milik komunitas (Retensi Modal Internal), bukan tersedot sebagai komisi platform.  
3. **Human-Centric Resilience:** Teknologi hanyalah fasilitator. Tujuan utama sistem adalah membangun jembatan antar-manusia, bukan menciptakan ketergantungan pada layar. AI harus meminimalkan *friction* sosial dan mendorong interaksi fisik yang produktif.

## **III. Prinsip Operasional bagi Stakeholder**

Sebagai entitas pengembang (AI Coder) maupun mitra strategis (Sponsor/Investor), standar berikut tidak dapat diganggu gugat:

* **Prinsip Non-Ekstraksi:** Jika sebuah fitur atau model bisnis membutuhkan data pribadi warga untuk dijual ke pihak ketiga, fitur tersebut ditolak.  
* **Prinsip Inklusivitas:** Teknologi harus beradaptasi dengan manusia, bukan sebaliknya. UI/UX harus mudah diakses oleh pengguna dengan literasi digital rendah, dengan penyediaan kanal *Command Line* sederhana (WhatsApp/Text-based) sebagai pendukung utama.  
* **Prinsip Desentralisasi:** Komunitas memiliki hak penuh untuk mengekspor data komunitas kapan saja. Tidak ada *vendor lock-in* dalam ekosistem URUN.  
* **Prinsip Etika AI:** AI bertindak sebagai *steward* (penjaga/pengelola aset digital), bukan otoritas pengambil keputusan. Keputusan finansial kritis harus melalui persetujuan manual dari pengurus atau warga.

## **IV. Doktrin "Anti-Platform"**

URUN menolak untuk menjadi "Platform" dalam artian tradisional yang memanen perilaku pengguna demi monetisasi atensi. URUN adalah **Public Good Infrastructure** (Infrastruktur Publik Digital). Keberhasilan URUN tidak diukur dari *Daily Active Users* yang kecanduan, melainkan dari **"Kapasitas Ekonomi Komunitas yang Menguat"** dan **"Kemandirian Komunitas dalam Mengelola Sumber Dayanya Sendiri"**.

## **V. Mandat Pengambilan Keputusan**

Dalam setiap pengambilan keputusan arsitektural maupun bisnis, setiap pemangku kepentingan wajib melakukan pengujian berdasarkan tiga pertanyaan ini:

1. Apakah ini memberi warga kendali lebih atas aset atau data mereka?  
2. Apakah ini menjaga surplus ekonomi tetap berada di dalam komunitas?  
3. Apakah ini mengurangi biaya atau usaha warga dalam kehidupan sehari-hari?

*Jika jawaban atas ketiga pertanyaan di atas adalah TIDAK, maka rancangan tersebut dianggap sebagai bentuk "Ekstraksi" dan harus dirombak agar selaras dengan visi kedaulatan URUN*.

# 02\_business\_model

# **`02_business_model.md`**

**Status:** *Operational & Scalability Blueprint* | **Audience:** *Founder & AI Core Logic*

## **I. Filosofi Bisnis: "Legal-Agnostic Sovereign Core"**

URUN dirancang sebagai entitas yang **independen terhadap struktur hukum**. Baik dijalankan secara perseorangan (solo founder), Yayasan (non-profit), maupun PT (profit), logika arus uang dan nilai tetap sama.

Strategi kami menggunakan konsep **"Sovereign Core, Adaptable Perimeter"**:

* **Sovereign Core (Yayasan/Inti):** Mengelola protokol, data warga, dan infrastruktur publik. Bagian ini menjaga integritas dan kepercayaan.  
* **Adaptable Perimeter (Unit Bisnis/PT/Operasional):** Mengelola arus kas komersial, *sponsorship*, dan *marketplace fee*. Bagian ini memberikan fleksibilitas operasional seperti startup.

## **II. Model Pendapatan (Hybrid Revenue Portfolio)**

Model ini dirancang agar Anda bisa memulai dari nol (solo) hingga memiliki badan hukum yang kompleks.

### **A. Sovereign Revenue (Internal Core)**

*Pendapatan ini melekat pada nilai utility URUN bagi komunitas.*

1. **Collective Procurement Fee (Efficiency Fee):** Margin efisiensi dari transaksi grosir. Saat Anda masih sendiri, margin ini adalah "cuan" dari efisiensi yang Anda fasilitasi. Saat menjadi Yayasan/PT, ini menjadi sumber operasional protokol.  
2. **Community SaaS (Flat-Fee):** Biaya pemeliharaan infrastruktur *fixed cost* per komunitas/RT. Ini adalah model *recurring revenue* yang paling stabil.  
3. **Escrow & Trust Services:** Biaya flat untuk penjaminan transaksi. Semakin tinggi volume transaksi komunitas, semakin besar stabilitas kas operasional Anda.

### **B. Adaptable Perimeter (Startup/Profesional Growth)**

*Fitur ini fleksibel; bisa diaktifkan/dinonaktifkan sesuai kebutuhan hukum dan sosial Anda.*

1. **Contextual Placement Sponsorship:** Ruang promosi bagi UMKM/vendor lokal yang relevan. Sangat efektif saat Anda bertransisi menjadi PT (Badan Usaha).  
2. **Platform Service Fee (Marketplace Fee):** Biaya layanan untuk transaksi C2C/B2C. Besaran persentase (misal 1-5%) ditentukan melalui *Governance Logic* di Dasbor Pengurus.  
3. **Data-as-a-Service (Analytics):** Penyediaan data tren kebutuhan komunitas (agregat anonim) bagi distributor/produsen besar (misal: "Analisis konsumsi beras di wilayah X"). Ini adalah nilai jual premium saat Anda sudah memiliki banyak komunitas/RT.

## **III. Skalabilitas Entitas (Solo \-\> Entity)**

Bagaimana cara URUN beradaptasi dengan perubahan legalitas Anda:

| Aspek | Perseorangan (Solo) | Yayasan \+ PT (Entity) |
| ----- | ----- | ----- |
| **Pengelolaan Data** | Dikelola secara mandiri | Dikelola oleh "Sovereign Core" (Yayasan) |
| **Arus Kas** | Langsung ke rekening pribadi/bisnis | Unit bisnis PT menyetor ke Yayasan/Operasional |
| **Akuntabilitas** | Kepercayaan personal | Kepercayaan hukum/audited |
| **Monetisasi** | Eksperimental (Fokus pada SaaS) | Formal (Sponsorship, DaaS, Fee) |

*Catatan untuk AI:* AI tidak perlu mengubah kode *ledger* saat entitas berubah. AI cukup mengubah konfigurasi `revenue_destination_account` di dalam fungsi RPC database.

## **IV. Mandat untuk AI Coder**

AI wajib memastikan kode tetap mematuhi prinsip **"Legal-Agnostic"**:

1. **Fee Configuration:** Bangun fungsi `get_revenue_settings()` yang mengambil konfigurasi dari database. Jangan pernah melakukan *hardcode* ke mana uang masuk. `System` harus bisa diarahkan apakah uang masuk ke rekening pribadi (perseorangan), rekening unit bisnis (PT), atau rekening yayasan.  
2. **Transparent Audit:** "Setiap sen yang masuk dari *sponsorship* atau *service fee* wajib tercatat di `ledger` dengan `entry_type = 'platform_revenue'`. AI harus memastikan kolom ini tidak bisa di-edit oleh pengurus (immutable)".  
3. **Adaptive UI:** Jika fitur *Sponsorship* diaktifkan (melalui admin panel), dasbor harus otomatis menampilkan *slot* iklan. Jika dimatikan (misal untuk komunitas yang ingin 100% non-profit/yayasan murni), UI harus otomatis bersih (tanpa iklan).  
4. **Data Stewardship:** Meskipun Anda berubah menjadi PT, AI dilarang menjual data individu. AI hanya boleh memproses *data agregat* untuk model pendapatan *Data-as-a-Service*.

### **Strategi Eksekusi untuk Anda:**

1. **Fase Perseorangan:** Fokus pada *SaaS Flat-Fee* dan *Collective Procurement*. Ini memberikan Anda bukti konsep (Proof of Concept) tanpa perlu badan hukum yang rumit.  
2. **Fase Entitas:** Saat Anda sudah memiliki banyak komunitas/RT, daftarkan **Yayasan** untuk memegang protokol (melindungi data warga) dan **PT** untuk mengelola *Revenue* (iklan & fee).

# 03\_design\_system

# **03\_design\_system.md**

**Status:** *UI/UX Standards & Interaction Blueprint* | **Audience:** *AI Coder, UI/UX Designer, Front-End Developer*

## **I. Filosofi Desain: "Utility-First, Human-Centric"**

URUN adalah infrastruktur publik digital. Desain sistem ini disusun untuk memastikan antarmuka yang bersih, fungsional, dan **inklusif**. Estetika nomor dua; fungsionalitas dan keterpercayaan (*trustworthiness*) adalah prioritas utama. URUN bukan platform media sosial yang bertujuan menciptakan adiksi, melainkan alat bantu (utility) untuk memperkuat ekonomi komunitas.

## **II. Prinsip Utama (The URUN Design Guidelines)**

1. **The "Mother-Test" (Accessibility):** Antarmuka wajib dapat digunakan oleh pengguna dengan literasi digital rendah.  
   * **Aturan:** Ukuran font minimum 16px, kontras tinggi (WCAG AAA compliant), dan target sentuh minimal 44x44px.  
2. **WhatsApp-First Logic:** Setiap antarmuka web adalah *mirror* dari interaksi pesan. Jika aksi bisa diselesaikan di WhatsApp (Chatbot), maka antarmuka web harus menyederhanakan alur tersebut ke dalam tampilan yang lebih kaya data.  
3. **Visual Trust (Minimalism):** Tidak boleh ada elemen dekoratif yang tidak memiliki fungsi. Setiap warna, garis, dan ikon harus memiliki alasan fungsional untuk membangun kepercayaan (karena berurusan dengan uang komunitas).  
4. **Adaptive Density:** Antarmuka harus menyesuaikan tingkat kepadatan informasi berdasarkan peran:  
   * *Warga:* Tampilan minimalis, fokus pada *Quick Action*.  
   * *Pengurus:* Tampilan *Data-Rich*, fokus pada *Financial Reporting*.

   ## **III. Panduan Visual (Core Foundation)**

| Komponen | Spesifikasi | Rasional |
| :---- | :---- | :---- |
| **Warna Utama** | Trust Blue (\#0056b3), Success Green (\#28a745) | Biru melambangkan integritas/Sovereign Core, Hijau melambangkan pertumbuhan ekonomi/efisiensi. |
| **Warna Aksen** | Neutral Gray (\#6c757d) | Menjaga perhatian tetap pada data, bukan pada dekorasi. |
| **Tipografi** | Inter atau system-ui sans-serif | Maksimal keterbacaan di layar ponsel (mobile-first). |
| **Iconography** | Lucide / Phosphor Icons (Outline) | Ringan, konsisten, dan netral secara visual. |

   ## **IV. Interaction Patterns (Interaction Rules)**

   ### **1\. Zero-Friction Flow**

* Setiap proses krusial (pembayaran, tender, approval) wajib diselesaikan dalam **maksimal 3 klik**.  
* Sistem wajib memberikan *feedback* instan (loading state, toast notification) setiap kali ada data yang dikirim ke ledger agar pengguna merasa aman bahwa transaksi tercatat.

  ### **2\. Status Transparency**

* Setiap item yang masuk ke workflow\_processes wajib memiliki indikator status visual yang jelas (misal: *Requested* \- Kuning, *Procuring* \- Biru, *Completed* \- Hijau).  
* Sistem tidak boleh menampilkan data finansial yang ambigu. Setiap angka harus memiliki label status (misal: "Dana Terkumpul", "Dana Keluar").

  ### **3\. Responsive Web & Embeddability**

* Antarmuka harus bersifat *fluid* (tidak kaku), mendukung perangkat kelas bawah (low-end smartphone) yang sering digunakan warga di tingkat lokal.  
* Komponen wajib bersifat *modular* agar dapat di-*embed* sebagai widget di situs luar komunitas sesuai protokol.

  ## **V. Mandat untuk AI Coder & UI Designer**

1. **No Invasive Patterns:** Dilarang keras menggunakan *dark patterns* (seperti *hidden fees*, *misleading buttons*, atau *forced navigation*) untuk memaksa interaksi. Transparansi adalah kunci *E-E-A-T*.  
2. **A11y (Accessibility) First:** AI wajib melakukan pengujian *screen-reader* pada setiap komponen baru. Jika sebuah elemen tidak bisa dibaca oleh *screen-reader*, maka elemen tersebut ditolak.  
3. **Stateful Feedback:** AI Coder wajib menerapkan *optimistic UI* untuk transaksi, di mana *interface* memberikan respons instan kepada warga seolah transaksi berhasil, sementara di latar belakang sistem melakukan validasi ke ledger. Jika validasi gagal, AI wajib mengembalikan status dan memberikan notifikasi perbaikan.  
4. **SEO/GEO Optimized Layout:** Setiap detail catalog\_item wajib memiliki hierarki visual yang jelas untuk mesin pencari:  
   * H1: Nama Item (Tender/Produk).  
   * Sub-headline: Nama Komunitas (GEO context).  
   * Meta-data Section: Harga/Status (untuk JSON-LD).  
   * Action Section: Tombol partisipasi yang menonjol.

**Panduan ini merupakan kontrak kerja bagi setiap pengembang yang bekerja pada ekosistem URUN.** Desain sistem ini memastikan bahwa URUN bukan hanya sekadar aplikasi, melainkan platform yang memberikan rasa aman, transparansi, dan kemudahan bagi warga dalam mengelola aset komunitas mereka.

# **`component_library.md`**

**Status:** *UI Component Specification & Design System* | **Audience:** *AI Coder, UI/UX Designer, Front-End Developer*

## **I. Filosofi Komponen: "Functional Sovereignty"**

Komponen URUN dibangun dengan pendekatan **Atomic Design** yang memprioritaskan fungsi di atas estetika. Komponen tidak dibuat untuk "tampak cantik", tetapi untuk **mempercepat partisipasi warga** dan **membangun kepercayaan**. Setiap komponen wajib bersifat *accessible* (WCAG AAA), *responsive*, dan *SEO-friendly*.

## **II. Stack Teknologi & Standar**

* **Framework:** React / Next.js (App Router).  
* **Styling:** Tailwind CSS (Utility-First).  
* **Accessibility:** Headless UI atau Radix UI (untuk primitives).  
* **Icons:** Lucide-React (untuk konsistensi visual).

## **III. Library Taxonomy**

### **1\. Primitive Atoms (Dasar)**

* **`Button`**: Mendukung varian (Primary, Secondary, Ghost, Destructive). Wajib memiliki status `loading` bawaan.  
* **`InputCurrency`**: Input khusus dengan validasi angka otomatis untuk `ledger`. Mencegah input karakter non-numerik.  
* **`Badge`**: Untuk status (`Requested`, `Procuring`, `Completed`). Warna otomatis berubah sesuai state.  
* **`Card`**: *Container* dasar dengan *shadow* tipis.

### **2\. URUN-Specific Components (Molecules)**

* **`LedgerEntry`**:  
  * *Prop:* `{ amount, direction, type, timestamp }`  
  * *Logic:* Menampilkan ikon berbeda untuk `in` (kredit) dan `out` (debit). Wajib memiliki aksesibilitas *label* untuk pembaca layar.  
* **`WorkflowStatusBadge`**:  
  * *Prop:* `{ status }`  
  * *Logic:* Pemetaan status database (`workflow_processes`) ke warna visual (misal: `requested` \= yellow, `procuring` \= blue, `completed` \= green).  
* **`TenderProgressBar`**:  
  * *Prop:* `{ target, collected }`  
  * *Logic:* Komponen visual untuk mendorong viralitas tender kolektif.  
* **`CommunityLocationHeader`**:  
  * *Prop:* `{ geoContext }`  
  * *Logic:* Menampilkan lokasi komunitas untuk kebutuhan GEO (misal: "RT 05, Desa Jatiwangi").

### **3\. Data & SEO Components (Organisms)**

* **`SchemaMetadata`**:  
  * *Fungsi:* *Wrapper* komponen untuk menyuntikkan JSON-LD ke dalam tag `<head>` secara dinamis berdasarkan data `catalog_item`.  
  * *Mandat:* Wajib ada di setiap halaman detail katalog.  
* **`AccessibleTable`**:  
  * *Fungsi:* Menampilkan data `ledger` atau daftar katalog dengan dukungan `aria-label` yang lengkap untuk tunanetra.

## **IV. Mandat Desain & Aksesibilitas (The URUN Rules)**

1. **"Mother-Test" Compliance:** Semua *clickable element* wajib memiliki ukuran minimal **44x44px**. Font size dasar adalah **16px**.  
2. **State Management:**  
   * Setiap aksi *write* ke database wajib memiliki status: `idle`, `loading`, `success`, `error`.  
   * Komponen *loading* harus terlihat jelas (seperti *skeleton screen*) untuk menghindari *layout shift* yang buruk bagi SEO (Core Web Vitals).  
3. **SEO/AEO Injection:**  
   * Komponen tidak boleh melakukan *client-side data fetching* untuk konten utama katalog. Konten utama katalog wajib di-*fetch* di *server-side* (Server Components) agar *crawlers* bisa melihat konten dengan sempurna.  
4. **No-Third-Party Tracking:**  
   * Komponen dilarang memuat *script* dari pihak ketiga (seperti Facebook Pixel atau Google Analytics) yang mengirimkan data pengguna secara tersembunyi. Pelacakan hanya dilakukan melalui `interaction_log` internal.

## **V. Template Komponen (Contoh: WorkflowStatusBadge)**

AI Coder wajib mengikuti pola ini untuk memastikan konsistensi:

TypeScript  
// Komponen standar untuk status alur kerja  
export const WorkflowStatusBadge \= ({ status }: { status: string }) \=\> {  
  const styles \= {  
    requested: "bg-yellow-100 text-yellow-800",  
    procuring: "bg-blue-100 text-blue-800",  
    completed: "bg-green-100 text-green-800",  
  };

  return (  
    \<span className={\`px-2 py-1 rounded text-xs font-medium ${styles\[status\] || "bg-gray-100"}\`}\>  
      {status.toUpperCase()}  
    \</span\>  
  );  
};

## **VI. Roadmap Pengembangan Komponen**

1. **Fase 1 (Core):** Bangun `Button`, `Input`, `Badge`, dan `LedgerEntry`.  
2. **Fase 2 (Workflow):** Bangun `TenderProgressBar` dan `WorkflowStatusBadge`.  
3. **Fase 3 (Data & SEO):** Bangun `SchemaMetadata` dan integrasikan ke *Layout* utama.

*Instruksi untuk AI:* "Sebelum membangun komponen baru, periksa apakah fungsionalitas tersebut sudah ada di `Primitive Atoms`. Jika belum, bangun dengan pendekatan *headless* (fokus pada fungsi) sebelum menambahkan *styling*. Semua komponen **wajib** memiliki *Prop Types* atau *TypeScript Interface* yang lengkap."

# 04\_ux\_personas

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

# 10\_system\_architecture

# **`10_system_architecture.md`**

**Status:** *Advanced System Design Blueprint* | **Audience:** *AI Coder & System Architect*

## **I. High-Level Architecture**

URUN mengadopsi arsitektur **Event-Driven Serverless** yang dipadukan dengan **Resilient Edge Intelligence**. Sistem tidak mengandalkan server tradisional yang berjalan terus-menerus, melainkan merespons *event* secara otonom untuk mencapai efisiensi biaya dan ketahanan operasional.

### **Komponen Utama:**

* **Frontend (The Interface):** Next.js (App Router) yang di-deploy di Vercel. Fokus pada performa *client-side* dan *static generation*.  
* **Backend & Auth (The Source of Truth):** Supabase (PostgreSQL). Implementasi **Row-Level Security (RLS)** adalah mekanisme utama untuk isolasi data antar-komunitas.  
* **Communication Layer (The Lobby):** API WhatsApp yang dihubungkan ke *Webhook Handler* sebagai gerbang interaksi natural warga.  
* **Compute & Automation (The Engine):** \* Vercel Edge Functions untuk logika bisnis *real-time*.  
  * GitHub Actions / Cron Jobs untuk tugas administratif otonom.

## **II. Advanced Resilience & Intelligence Layer**

Sistem mengintegrasikan lapisan tambahan untuk memastikan ketahanan (*resilience*) dan kecerdasan yang menjaga privasi.

* **Offline-First Resilience (CRDTs):** Menggunakan **CRDTs (Conflict-free Replicated Data Types)** untuk sinkronisasi data *local-first*. Input warga/pengurus tetap berjalan saat koneksi internet terputus dan melakukan sinkronisasi otomatis saat terhubung kembali tanpa konflik data.  
* **Federated Intelligence:** Analisis kebutuhan (tren harga/kebutuhan) dilakukan melalui *Federated Learning*. AI melatih model secara lokal di *edge*, hanya mengirimkan bobot model ke server pusat untuk menjaga privasi transaksi mentah warga.  
* **Financial Multi-Sig Governance:** Keamanan transaksi bernilai besar (di atas ambang batas) wajib melalui persetujuan multi-tanda tangan (*multi-sig approval*) dari pengurus RT via bot WhatsApp sebelum eksekusi `ledger`.  
* **Decentralized Identity (DID):** Implementasi identitas berbasis DID untuk memastikan warga memiliki kedaulatan penuh atas ID mereka, memungkinkan portabilitas reputasi lintas komunitas tanpa bergantung pada *cloud provider*.

## **III. Data Flow & Communication**

1. **Input Layer:** Warga berinteraksi via Web UI, WhatsApp, atau *Sync Engine* (saat offline).  
2. **Logic Layer:** *Edge Functions* memvalidasi *request*, memeriksa RLS, dan memproses logika bisnis, termasuk validasi *Multi-Sig* untuk transaksi.  
3. **Storage Layer:** Data disimpan di Supabase, dipisahkan berdasarkan `community_id`.  
4. **External Integration:** AI melakukan *parsing* otomatis terhadap data eksternal (marketplace/tender lokal) melalui *scraper* otonom.

### **Component Diagram (Logical View)**

Cuplikan kode

graph TD

    User\[Warga/Pengurus\] \--\>|Request| WA\[WhatsApp API\]

    User \--\>|Request| UI\[Next.js Frontend\]

    User \--\>|Offline Input| Sync\[Sync Engine / CRDTs\]

      

    WA \--\>|Webhook| Edge\[Edge Functions\]

    UI \--\>|API Request| Edge

    Sync \--\>|Sync| Edge

      

    Edge \--\>|Read/Write| DB\[(Supabase \- PostgreSQL)\]

    Edge \--\>|Trigger| Automation\[GitHub Actions / Cron\]

    Edge \--\>|Multi-Sig| Approval\[Approval Bot\]

      

    Automation \--\>|Maintenance| DB

## **IV. Public Rendering & SEO/AEO Pipeline**

Pemisahan *pipeline* untuk optimalisasi performa dan pencarian:

* **Public Catalog Pipeline (SEO/AEO):**  
  * Halaman katalog publik menggunakan **ISR/SSR**.  
  * *Edge Functions* menyuntikkan JSON-LD (Schema Markup) secara dinamis ke dalam HTML untuk mendukung GEO/AEO.  
* **Authenticated Transaction Pipeline:**  
  * Interaksi `ledger` atau profil pengguna menggunakan *client-side rendering* terotentikasi (JWT).  
  * Crawler dibatasi (via `robots.txt` dan `noindex`) untuk menjaga privasi finansial.

## **V. Design Constraints for AI (Architectural Logic)**

AI Coder wajib mematuhi aturan berikut saat merancang sub-sistem:

1. **Isolasi Komunitas:** Setiap tabel **WAJIB** memiliki kolom `community_id`. Setiap *query* (SELECT/INSERT/UPDATE) **WAJIB** menyertakan filter `community_id` yang divalidasi oleh kebijakan RLS.  
2. **Stateless Logic:** *Edge Functions* harus bersifat *stateless*. Semua status harus ditarik dari basis data.  
3. **Graceful Degradation:** Jika API pihak ketiga tidak tersedia, sistem tetap berjalan dengan "Mode Manual".  
4. **Minimalist Payload:** Penggunaan *caching* (SWR/React Query) pada Frontend adalah kewajiban untuk merespons jaringan seluler yang lambat.

## **VI. Scalability & Global Readiness**

* **Horizontal Partitioning:** Basis data dapat di-*shard* berdasarkan `community_id` jika jumlah komunitas mencapai ribuan tanpa mengubah arsitektur inti.  
* **Protocol-First Development:** Setiap modul (Ledger, Stok, Tender) wajib dibangun sebagai *Service* independen yang dapat dipanggil oleh SDK pihak ketiga atau Bot, memastikan interoperabilitas protokol.

*Instruksi untuk AI Coder:* "Pastikan setiap fungsi basis data mencantumkan validasi `community_id`. Gunakan RLS Supabase sebagai pertahanan utama. Hindari penyimpanan sesi yang berat; gunakan token JWT dari Supabase Auth yang terintegrasi native".

# 11\_data\_schema

# **`11_data_schema.md`**

**Status:** *Master Database Specification* | **Audience:** *AI Coder, System Architect, Stakeholders*

## **I. Relational Architecture (The Sovereign Data Model)**

URUN menggunakan model **Multi-Tenant** berbasis PostgreSQL. Seluruh data diisolasi per komunitas (`community_id`) dan dijalankan dengan prinsip **Append-Only** (untuk transaksi) dan **Polymorphic** (untuk katalog objek) guna memastikan fleksibilitas operasional bagi entitas hukum apa pun (Yayasan maupun PT).

### **1\. Tabel Utama (Core Tables)**

* **`communities`**: Tabel root yang mendefinisikan batas administratif tiap komunitas, lokasi geografis (untuk GEO), dan konfigurasi bisnis.  
* **`profiles`**: Pemetaan pengguna ke komunitas dengan fitur reputasi sosial dan otorisasi.  
* **`catalog_items`**: Entitas universal untuk produk, jasa, dan aset. Menggunakan kolom `metadata` (JSONB) untuk fleksibilitas objek, optimasi SEO/AEO, dan polymorphism.  
* **`ledger`**: Buku besar yang bersifat *append-only*. Data tidak boleh di-`UPDATE` atau di-`DELETE`. Koreksi dilakukan melalui entri pembalik (*reversal*).  
* **`workflow_processes`**: *State machine* yang mengelola siklus hidup transaksi (misal: *requested* \-\> *procuring* \-\> *completed*).

## **II. Spesifikasi DDL (Data Definition Language)**

SQL  
\-- 1\. Tabel Utama Komunitas (Root Tenant)  
CREATE TABLE communities (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  slug TEXT UNIQUE NOT NULL,  
  name TEXT NOT NULL,  
  geo\_context JSONB DEFAULT '{"province": null, "regency": null, "district": null, "village": null, "coordinates": {"lat": null, "lng": null}}'::jsonb,  
  settings JSONB DEFAULT '{}'::jsonb, \-- Konfigurasi Fee, Branding, Revenue Account  
  created\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- 2\. Tabel Profil Pengguna  
CREATE TABLE profiles (  
  id UUID PRIMARY KEY,  
  community\_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,  
  role TEXT NOT NULL DEFAULT 'warga',  
  name TEXT NOT NULL,  
  reputation\_score INT DEFAULT 10,  
  contact\_info JSONB,  
  created\_at TIMESTAMPTZ DEFAULT NOW(),  
  CONSTRAINT role\_check CHECK (role IN ('warga', 'pengurus', 'admin'))  
);

\-- 3\. Katalog Polimorfik (Produk, Jasa, Aset) \- SEO/AEO/GEO Ready  
CREATE TABLE catalog\_items (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  community\_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,  
  slug TEXT UNIQUE NOT NULL, \-- Penting untuk SEO  
  title TEXT NOT NULL,  
  description TEXT,  
  item\_type TEXT NOT NULL,  
  status TEXT NOT NULL DEFAULT 'active', \-- 'public', 'private', 'active'  
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb, \-- Schema.org data for SEO/AEO  
  created\_at TIMESTAMPTZ DEFAULT NOW(),  
  CONSTRAINT item\_type\_check CHECK (item\_type IN ('product', 'service', 'asset'))  
);

\-- 4\. Ledger (Append-Only)  
CREATE TABLE ledger (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  community\_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,  
  item\_id UUID REFERENCES catalog\_items(id) ON DELETE SET NULL,  
  actor\_id UUID NOT NULL REFERENCES profiles(id),  
  amount DECIMAL(15,2) NOT NULL,  
  direction TEXT NOT NULL,  
  entry\_type TEXT NOT NULL, \-- 'tender\_contribution', 'platform\_revenue', 'correction'  
  ref\_id UUID,  
  created\_at TIMESTAMPTZ DEFAULT NOW(),  
  CONSTRAINT direction\_check CHECK (direction IN ('in', 'out'))  
);

\-- 5\. Workflow (State Machine)  
CREATE TABLE workflow\_processes (  
  id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
  community\_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,  
  item\_id UUID NOT NULL REFERENCES catalog\_items(id) ON DELETE CASCADE,  
  current\_state TEXT NOT NULL DEFAULT 'requested',  
  context JSONB NOT NULL DEFAULT '{}'::jsonb,  
  last\_updated TIMESTAMPTZ DEFAULT NOW()  
);

## **III. SEO/AEO/GEO Implementation (JSON-LD)**

Untuk visibilitas di mesin pencari dan pemahaman oleh AI Search Engine, setiap `catalog_item` publik wajib dirender dengan skema JSON-LD berikut.

### **1\. Template Universal (Polimorfik)**

JSON  
\<script type="application/ld+json"\>  
{  
  "@context": "https://schema.org",  
  "@type": "{{type}}",   
  "name": "{{title}}",  
  "description": "{{description}}",  
  "url": "https://urun.id/{{community\_slug}}/catalog/{{slug}}",  
  "provider": {  
    "@type": "Organization",  
    "name": "{{community\_name}}"  
  },  
  "offers": {  
    "@type": "Offer",  
    "priceCurrency": "IDR",  
    "price": "{{metadata.price}}",  
    "availability": "{{metadata.stock \> 0 ? 'InStock' : 'OutOfStock'}}"  
  }  
}  
\</script\>

### **2\. Logika Pemetaan & Helper**

TypeScript  
function generateJsonLd(item: CatalogItem, communityName: string) {  
  const schemaType \= item.item\_type \=== 'product' ? 'Product' :   
                     item.item\_type \=== 'service' ? 'Service' : 'Thing';

  return {  
    "@context": "https://schema.org",  
    "@type": schemaType,  
    "name": item.title,  
    "description": item.description,  
    "metadata": item.metadata,  
    // AI harus memetakan kunci JSONB ke properti Schema.org yang relevan  
  };  
}

## **IV. Keamanan, Integritas, & Mandat Pengembang**

1. **Row-Level Security (RLS):**  
   * **Isolasi Tenant:** Ledger dan tabel sensitif wajib menggunakan kebijakan RLS berbasis `community_id`.  
   * **Public Access:** Tabel `catalog_items` dengan status `'public'` wajib dapat dibaca oleh *crawler* mesin pencari.  
2. **Fungsi Atomik (RPC):** Perubahan data wajib melalui fungsi RPC. Contoh untuk kontribusi kolektif:  
3. SQL

CREATE OR REPLACE FUNCTION process\_collective\_contribution(...) RETURNS VOID AS $$ ... $$;

4. **SEO/GEO Mandates:**  
   * **Dynamic Mapping:** Larangan keras melakukan *hardcode* nilai JSON-LD. Nilai harus ditarik dinamis dari `metadata` (JSONB).  
   * **GEO Context:** Wajib menyertakan `geo_context` dari `communities` ke dalam `JSON-LD` agar mesin pencari mengenali lokasi fisik komunitas.  
   * **No-Index for Private:** Halaman katalog dengan status `private` wajib menyertakan meta tag `noindex`.  
5. **Audit-First:** Setiap pendapatan platform wajib ditag dengan `platform_revenue` di `ledger`.  
6. **Schema Evolution:** Gunakan kolom `metadata` (JSONB) daripada menambah kolom fisik untuk fitur baru.

# 12\_protocol\_spec

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

# 13\_external\_services

# **`13_external_services.md`**

**Status:** *Integration & Dependency Blueprint* | **Audience:** *AI Coder, System Architect, Stakeholders*

## **I. Filosofi Integrasi: "Pluggable Sovereignty"**

URUN dirancang dengan prinsip **Minimal Dependency**. Setiap layanan eksternal yang diintegrasikan bersifat *pluggable* (dapat dicabut-pasang) untuk menghindari *vendor lock-in*. Jika suatu layanan eksternal menaikkan biaya secara eksploitatif atau melanggar etika kedaulatan data komunitas, sistem harus mampu beralih ke penyedia lain atau kembali ke mode manual tanpa menghentikan operasi inti.

## **II. Service Categorization**

### **A. Core Infrastructure (Critical)**

Layanan ini membentuk pondasi eksekusi URUN.

* **Vercel (Hosting & Edge Computing):** Hosting Next.js dan *Edge Functions*.  
* **Supabase (Database & Auth):** Basis data PostgreSQL dan *authentication layer*.  
* **WhatsApp API (Communication):** Gerbang utama interaksi warga. Penggunaan *provider* (seperti Twilio, WABA, atau *self-hosted* Baileys) harus diisolasi melalui *adapter pattern* agar bisa diganti kapan saja.

### **B. Operational Services (Adaptable Perimeter)**

Layanan ini mendukung fungsionalitas tambahan untuk skalabilitas.

* **Payment Gateways (Midtrans/Xendit):** Untuk otomatisasi pembayaran iuran/tender. *Catatan:* Ledger internal tetap menjadi catatan utama (*source of truth*), payment gateway hanya sebagai fasilitator transaksi.  
* **Geo-Location Services (OpenStreetMap/Google Maps):** Untuk mendukung `geo_context`. *Prioritas:* Menggunakan OpenStreetMap untuk menjaga kedaulatan data wilayah, Google Maps hanya jika akurasi *commercial-grade* diperlukan.  
* **LLM/AI APIs (OpenAI/Gemini):** Untuk *parsing* teks WhatsApp, klasifikasi kategori item, atau ringkasan laporan kas. *Catatan:* Data pribadi warga (PII) dilarang dikirimkan ke model AI eksternal.

## **III. Policy for External Dependencies**

AI Coder dan Pengembang wajib mematuhi aturan berikut saat mengintegrasikan layanan baru:

1. **Adapter Pattern Enforcement:** Dilarang memanggil API pihak ketiga secara langsung di dalam kode logika bisnis (misal: memanggil SDK Midtrans langsung di komponen React). Wajib melalui *Service Adapter* atau *Serverless Function* yang terpisah.  
2. **Circuit Breaker Logic:** Jika layanan pihak ketiga (misal: Payment Gateway) mengalami gangguan, sistem wajib beralih ke *Graceful Degradation* (Mode Manual) secara otomatis. Transaksi tidak boleh *hang* hanya karena API luar *down*.  
3. **Data Masking Policy:** Sebelum data dikirim ke API eksternal (terutama AI atau Analytics), wajib dilakukan proses *anonymization* atau *masking* terhadap informasi identitas pribadi (PII). Hanya data yang diperlukan (misal: *item\_type* atau *amount*) yang boleh dikirim.

## **IV. Management & Cost Control**

* **Cost Monitoring:** Setiap pemanggilan API yang berbayar (seperti AI token atau SMS Gateway) wajib dipantau melalui *dashboard* operasional.  
* **Regional Sovereignty:** Prioritaskan layanan yang memiliki *data center* lokal atau mematuhi regulasi perlindungan data pribadi (UU PDP Indonesia) untuk menjaga kedaulatan data warga.

## **V. Integrasi Workflow (For AI Coder)**

Cuplikan kode  
graph LR  
    System\[URUN System\] \--\>|Abstraction Layer| Adapter\[API Adapter / Service\]  
    Adapter \--\>|Request| Vendor\[External Vendor\]  
      
    style Adapter fill:\#f9f,stroke:\#333,stroke-width:2px

*Instruksi untuk AI Coder:* "Saat Anda perlu mengintegrasikan layanan baru (misal: pengiriman email, notifikasi, atau payment), buatlah interface abstrak terlebih dahulu. Jangan pernah melakukan *hardcode* SDK spesifik vendor ke dalam logika bisnis utama. Jika vendor berubah, hanya `Adapter` yang perlu diubah, bukan keseluruhan `Ledger` atau `Catalog` engine".

Dengan dokumentasi ini, URUN mempertahankan fleksibilitas untuk berevolusi. Jika di masa depan Anda memutuskan untuk membangun *server* sendiri (Self-hosting) atau berpindah ke teknologi lain, infrastruktur URUN sudah siap untuk di-migrasi tanpa mengorbankan integritas data komunitas.

# 20\_rules\_for\_ai

# **`20_rules_for_ai.md`**

**Status:** *Operational Governance & Code of Conduct* | **Audience:** *AI Coder, Developer, Stakeholder*

## **I. The URUN Constitution (Mandat Inti)**

Setiap baris kode, arsitektur, atau keputusan strategis yang diambil dalam pengembangan URUN wajib mematuhi 20 aturan berikut tanpa pengecualian.

### **A. Filosofi & Etika (Core Sovereignty)**

1. **Community-First:** Setiap fitur wajib memberikan manfaat nyata bagi komunitas (RT/RW/afinitas). Jika fitur tidak membantu warga mengelola aset atau ekonomi mereka, **jangan dibangun**.  
2. **Anti-Ekstraktif:** Dilarang mengumpulkan data warga untuk dijual ke pihak ketiga. Privasi adalah aset komunitas yang tidak bisa diperjualbelikan.  
3. **Legal-Agnostic Design:** URUN harus dapat dijalankan sebagai Yayasan (non-profit), PT (profit), maupun perorangan. Jangan pernah melakukan *hardcode* logika kepemilikan entitas ke dalam kode inti.  
4. **No Walled Garden:** URUN adalah infrastruktur publik digital. Semua data harus dapat diekspor oleh komunitas kapan saja. Tidak ada *vendor lock-in*.

### **B. Arsitektur & Keamanan Data (Data Stewardship)**

5. **Strict Multi-Tenant Isolation:** Setiap tabel **WAJIB** memiliki kolom `community_id`. Setiap query SQL wajib menyertakan filter `community_id` yang divalidasi oleh kebijakan RLS (Row-Level Security) Supabase.  
6. **Ledger-First Principle:** Semua perubahan status keuangan wajib tercatat di tabel `ledger` dengan tipe data `DECIMAL` (bukan float). Kode tidak boleh melakukan update saldo secara manual di tabel profil.  
7. **Stateless Logic:** *Edge Functions* tidak boleh menyimpan status di memori. Semua status harus ditarik dari basis data (source of truth).  
8. **Graceful Degradation:** Sistem wajib berfungsi dalam "Mode Manual" jika layanan pihak ketiga (Payment Gateway/AI API) mengalami gangguan. Transaksi komunitas tidak boleh berhenti.  
9. **Audit-First:** Tidak ada aksi sistematis yang tidak tercatat. Setiap interaksi kunci harus memiliki *audit trail* di `interaction_log` atau `ledger`.

### **C. SEO, AEO, & GEO (Growth Engineering)**

10. **Public-by-Default (Catalog):** Katalog barang/jasa harus terbuka bagi *crawler* mesin pencari. Gunakan kebijakan RLS untuk memisahkan data publik dan privat.  
11. **JSON-LD Schema Markup:** Setiap `catalog_item` wajib memiliki implementasi JSON-LD (Schema.org) yang dinamis, ditarik langsung dari kolom `metadata` (JSONB).  
12. **Geo-Context Integrity:** Gunakan kolom `geo_context` di tabel `communities` untuk mendukung *Local Search* (GEO). Setiap konten publik wajib menyematkan konteks lokasi untuk kepentingan SEO lokal.  
13. **Anti-Invasive Tracking:** Dilarang menyuntikkan script pelacak pihak ketiga yang memanen data individu (GA/Meta Pixel). Gunakan analitik *first-party* (internal SQL logs) untuk melacak pertumbuhan.

### **D. Coding Standards & Scalability**

14. **Polymorphic Data:** Gunakan kolom `metadata` (JSONB) pada `catalog_items` atau `workflow_processes` untuk menyimpan atribut unik. Dilarang menambah kolom tabel secara fisik untuk fitur-fitur yang tidak universal.  
15. **Adapter Pattern:** Integrasi dengan pihak ketiga (Payment, WA API) wajib menggunakan *Service Adapter*. Dilarang keras melakukan *hardcode* SDK spesifik di dalam komponen UI atau logika inti.  
16. **Minimalist Payload:** API wajib mengembalikan respons JSON yang minimal. Gunakan *caching* (SWR/React Query) di frontend untuk mereduksi *traffic* pada jaringan seluler yang lambat.  
17. **Idempotency:** Setiap transaksi `POST` ke `ledger` wajib menggunakan `idempotency_key` untuk mencegah duplikasi data saat terjadi kegagalan jaringan.

### **E. User Interaction & Resilience**

18. **WhatsApp-First UX:** Setiap fitur yang kompleks wajib memiliki *mirror* fungsional di WhatsApp. Jangan memaksa warga membuka web jika aksi bisa diselesaikan dengan teks sederhana.  
19. **Accessibility (A11y):** Setiap komponen UI wajib lolos pengujian *screen-reader* dan memiliki rasio kontras yang sesuai standar WCAG AAA.  
20. **Documentation Sync:** Setiap kali arsitektur berubah, AI wajib memperbarui `10_system_architecture.md` atau `11_data_schema.md`. Dokumentasi adalah bagian dari kode; kode tanpa dokumentasi adalah hutang teknis.

## **II. Sanksi & Kepatuhan**

* **Zero Tolerance:** Pelanggaran terhadap aturan "Isolasi Tenant" (kebocoran data antar komunitas) adalah **pelanggaran fatal** yang mewajibkan *refactoring* segera.  
* **Mandatory Review:** Setiap PR (Pull Request) yang mengubah `ledger` atau `RLS Policies` wajib melalui *double-check* oleh pengembang senior atau *AI Audit Tool*.

*Instruksi untuk AI Coder:* "Sebelum menulis kode untuk fitur baru, periksa daftar ini. Jika fitur yang Anda rencanakan melanggar aturan di atas (misal: melakukan hardcode API key, atau melupakan filter `community_id`), Anda **wajib** mengubah pendekatan Anda sebelum memulai eksekusi."

# 21\_automation\_scripts

# **21\_automation\_scripts.md**

**Status:** *Operational Automation Blueprint* | **Audience:** *AI Coder, System Architect, Maintainers*

## **I. Filosofi Automasi: "The Autonomous Steward"**

Automasi dalam URUN berfungsi sebagai *steward* (penjaga aset digital) yang bertugas menjaga kesehatan data, integritas finansial, dan keterlibatan komunitas tanpa campur tangan manusia yang konstan. Script automasi **WAJIB** bersifat **Idempotent** (eksekusi berkali-kali memberikan hasil yang sama) dan **Non-Intrusif** (tidak mengganggu privasi warga).

## **II. Jenis Script & Eksekusi**

Automasi dijalankan melalui **Vercel Cron Jobs** atau **GitHub Actions** untuk memastikan *serverless execution* yang efisien.

| Kategori | Nama Script | Deskripsi | Frekuensi |
| :---- | :---- | :---- | :---- |
| **Financial** | reconcile\_ledger.js | Memvalidasi saldo total (ledger) vs workflow\_processes untuk mendeteksi anomali. | Harian (00:00) |
| **Engagement** | notify\_community\_digest.js | Merangkum aktivitas (tender/kontribusi) dan mengirim notifikasi via Webhook WhatsApp. | Mingguan |
| **SEO/GEO** | generate\_sitemap.js | Memindai catalog\_items publik dan memperbarui sitemap.xml untuk *search engine*. | Harian |
| **System** | cleanup\_garbage.js | Menghapus entri workflow\_processes yang kadaluarsa (gagal/dibatalkan). | Bulanan |
| **Engagement** | remind\_pending\_tender.js | Mengirim pengingat otomatis untuk tender yang mendekati batas waktu (due\_date). | Harian |

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

# 22\_algorithm\_spec

# **22\_algorithm\_spec.md**

**Status:** *Algorithmic Governance & Logic Specification* | **Audience:** *AI Coder, Data Scientist, System Architect*

## **I. Filosofi Algoritma: "Transparent Sovereignty"**

Algoritma URUN bukan "Black Box" yang memanipulasi perilaku pengguna untuk konsumsi. Sebaliknya, algoritma URUN bersifat **Deterministik**, **Transparan**, dan **Privasi-Preserving**. Setiap bobot (weighting) yang digunakan dalam perhitungan reputasi atau rekomendasi wajib terdokumentasi dan dapat diaudit oleh pengurus komunitas.

## **II. Reputation Engine (u\_score)**

Algoritma ini menghitung reputation\_score di tabel profiles. Tujuannya bukan untuk *gamification* yang memicu adiksi, melainkan untuk membangun *Trust Metrics* antar warga.

### **Formula Dasar:**

$$R\_{new} \= R\_{old} \+ (\\alpha \\cdot T\_{success}) \+ (\\beta \\cdot V\_{contrib}) \- (\\gamma \\cdot I\_{default})$$

* $R\_{old}$: Reputasi saat ini (Minimum 10).  
* $T\_{success}$: Nilai keberhasilan penyelesaian tender/tugas (1-5 pts).  
* $V\_{contrib}$: Volume kontribusi nyata (normalized, 0-1 pts).  
* $I\_{default}$: Indikator kegagalan/pelanggaran (discretionary penalty).  
* $\\alpha, \\beta, \\gamma$: Konstanta penyeimbang yang dapat diatur oleh *Governance Logic* komunitas.

**Mandat:** Perhitungan wajib dilakukan *asynchronous* via *Edge Function* setiap kali ada entri di ledger yang berstatus completed.

## **III. Federated Trend Analysis (Privacy-Preserving)**

Untuk menyediakan wawasan (misal: "Tren kebutuhan beras di RT X"), sistem tidak boleh memproses data transaksi mentah di server pusat.

1. **Local Aggregation:** *Edge Function* melakukan agregasi data di tingkat community\_id lokal (menghitung frekuensi item tanpa melihat actor\_id).  
2. **Differential Privacy:** Menambahkan "Noise" pada data agregat sebelum dikirim ke *Global Analytics Node* untuk memastikan individu tidak bisa diidentifikasi kembali.  
3. **Result:** Komunitas hanya mendapatkan *insight* berupa tren (misal: "Kebutuhan meningkat 20%"), bukan daftar siapa yang membeli apa.

## **IV. Multi-Sig Financial Guardrail**

Algoritma ini menentukan apakah transaksi memerlukan persetujuan manual (Multi-Sig) atau otomatis.

* **Logic:**  
* Python

def check\_transaction\_risk(amount, community\_settings):  
    threshold \= community\_settings.get('multisig\_threshold', 5000000\)  
    if amount \>= threshold:  
        return "REQUIRES\_MULTISIG"  
    return "AUTO\_APPROVE"

*   
*   
* **Workflow:** Jika REQUIRES\_MULTISIG, sistem secara otomatis mengunci workflow\_processes ke status pending\_approval dan mengirimkan *notifikasi push* ke setidaknya 2 dari 3 alamat *wallet* (atau profil admin) yang terdaftar.

## **V. Matching & Recommendation Engine**

Rekomendasi catalog\_items kepada warga tidak didasarkan pada *click-bait*, melainkan pada **Hyper-Local Context**.

* **Relevance Score ($S$):**  
  $$S \= (W\_1 \\cdot K\_{match}) \+ (W\_2 \\cdot Geo\_{prox}) \+ (W\_3 \\cdot Trust\_{avg})$$  
  * $K\_{match}$: Kecocokan keyword/kategori dengan riwayat kebutuhan warga.  
  * $Geo\_{prox}$: Kedekatan (hanya item dalam satu community\_id atau radius geo\_context yang dihitung).  
  * $Trust\_{avg}$: Rata-rata reputasi penyedia item (Pak Budi, Supplier).

## **VI. Viral Loop Algorithm (Reward logic)**

Algoritma untuk mendukung viralitas tanpa manipulasi.

* **Logic:** Pemberian reputasi bonus untuk "Social Multiplier".  
* **Syarat:** Jika actor\_id membagikan link tender dan dari link tersebut muncul ledger\_entry baru (transaksi sukses), maka actor\_id mendapatkan bonus\_score.  
* **Fraud Prevention:** bonus\_score dibatasi maksimal per hari dan hanya berlaku untuk transaksi unik (mencegah *self-dealing*).

## **VII. Mandat untuk AI Coder**

1. **Transparency:** AI wajib menyediakan *endpoint* GET /v1/algorithm/explain?feature={feature\_name} yang menjelaskan mengapa suatu item direkomendasikan atau mengapa reputasi seseorang bernilai X.  
2. **Determinism:** Tidak boleh ada unsur *randomness* dalam perhitungan finansial atau reputasi. Jika input sama, output harus sama.  
3. **Auditability:** Setiap perubahan konstanta algoritma (seperti $\\alpha, \\beta, \\gamma$) wajib dicatat dalam system\_audit\_log dengan timestamp dan actor\_id yang mengubahnya.  
4. **No Black Box:** AI dilarang menggunakan *Neural Network* yang tidak bisa dijelaskan (*unexplainable AI*) untuk pengambilan keputusan finansial. Gunakan model berbasis aturan (*rule-based*) atau *Linear Regression* yang transparan.

Algoritma ini adalah "otak" yang menjaga URUN tetap objektif dan berpihak pada keadilan komunitas. Jika ada perubahan pada algoritma, perubahan tersebut wajib diumumkan secara transparan di dasbor warga sebagai bagian dari prinsip keterbukaan.

# 30\_maintenance\_manual

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

# 31\_compliance\_log

# **31\_compliance\_log.md**

**Status:** *Governance & Audit Ledger* | **Audience:** *Maintainers, AI Auditor, Stakeholders, Regulatory Bodies*

## **I. Filosofi Kepatuhan: "Radical Transparency & Sovereign Compliance"**

URUN adalah infrastruktur publik digital. Kepercayaan komunitas adalah aset tertinggi. Dokumen ini berfungsi sebagai **Buku Audit Publik** untuk mencatat kepatuhan sistem terhadap regulasi (seperti UU PDP di Indonesia), etika data, dan standar teknis yang telah ditetapkan dalam 01\_manifesto.md. Kepatuhan di URUN bersifat proaktif, bukan reaktif.

## **II. Compliance Matrix**

| Domain | Standar/Regulasi | Mekanisme Kepatuhan |
| :---- | :---- | :---- |
| **Data Privacy** | UU PDP (Indonesia) | RLS per community\_id, enkripsi data, hak akses (PII Protection) |
| **Financial** | Transparansi & Integritas | *Append-only Ledger*, audit log, rekonsiliasi otomatis |
| **Algorithmic** | Transparansi AI | Dokumentasi di 22\_algorithm\_spec.md, deterministik (non-blackbox) |
| **Security** | ISO/IEC 27001 (Principles) | *Principle of Least Privilege*, Multi-Sig, Audit Logs |

## **III. Compliance Audit Log**

Dokumen ini wajib diperbarui setiap kali dilakukan audit sistem atau perubahan kebijakan yang berdampak pada privasi/finansial warga.

| Tanggal (YYYY-MM-DD) | Domain | Deskripsi Audit / Perubahan | Status | Auditor/Agent |
| :---- | :---- | :---- | :---- | :---- |
| 2026-05-21 | Security | Audit kebijakan RLS di tabel ledger | Passed | System\_Core\_AI |
| 2026-05-21 | Privacy | Pengecekan *Public Access Policy* (SEO) | Passed | Compliance\_Bot |
| 2026-06-XX | Financial | Rekonsiliasi bulanan *Efficiency Fee* | Pending | Admin\_Manual |

## **IV. Algorithmic Transparency Log**

Sesuai mandat 22\_algorithm\_spec.md, setiap modifikasi pada parameter algoritma (seperti pembobotan reputasi atau batas Multi-Sig) wajib dicatat di sini untuk memastikan komunitas mengetahui dasar pengambilan keputusan sistem.

* **Algoritma:** Reputation\_Engine  
* **Perubahan:** Penyesuaian bobot $\\alpha$ (tender success) dari 0.5 ke 0.6.  
* **Alasan:** Meningkatkan apresiasi terhadap warga yang berkontribusi aktif pada tender kolektif.  
* **Timestamp:** 2026-05-21 12:00 WIB  
* **Actor:** Governance\_AI\_Agent

## **V. Mandat untuk AI Auditor & Maintainer**

Untuk menjaga integritas kepatuhan, AI wajib mematuhi aturan berikut:

1. **Immutability of Audit Logs:** Log kepatuhan dilarang diubah setelah dicatat. Jika ada kesalahan, buat entri baru untuk mengoreksi ("Correction Entry") dengan referensi log yang salah.  
2. **Privacy-First Verification:** AI Auditor dilarang mengekspor atau menampilkan *Personal Identifiable Information* (PII) warga dalam log kepatuhan. Gunakan *ID Anonim* atau *Hash ID* untuk keperluan audit.  
3. **Regulatory Sync:** Jika terjadi perubahan regulasi (misalnya pembaruan UU PDP), AI Maintainer wajib melakukan *Gap Analysis* antara aturan baru dengan 20\_rules\_for\_ai.md dalam waktu 7x24 jam.  
4. **Transparency Requirement:** Setiap kali ada audit kepatuhan, ringkasan eksekutif (berupa status: "Aman", "Butuh Perbaikan", atau "Kritikal") wajib dipublikasikan ke dasbor pengurus agar komunitas mengetahui sistem mereka sedang diaudit.

## **VI. Declaration of Sovereign Compliance**

"Dengan ini, URUN menyatakan bahwa seluruh proses data, finansial, dan algoritma yang berjalan di atas protokol ini dikelola dengan standar integritas tertinggi. Data adalah milik warga, sistem adalah milik komunitas, dan transparansi adalah kewajiban kami."

*Instruksi untuk AI:* "Setiap kali Anda menjalankan skrip automasi (seperti reconcile\_ledger.js atau generate\_sitemap.js), Anda wajib membuat entri singkat di Compliance Audit Log pada tabel ini sebagai bentuk pertanggungjawaban sistematis."

# 32\_legal\_compliance

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

# 40\_code\_style\_guide

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

# 50\_growth\_engine

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

# 51\_marketplace\_parser\_handbook

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

