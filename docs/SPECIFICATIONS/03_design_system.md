# 03_design_system

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

