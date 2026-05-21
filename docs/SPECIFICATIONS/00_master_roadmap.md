# 00_master_roadmap

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

> [!NOTE]
> Rencana detail implementasi teknis untuk penyelesaian sisa Peta Jalan (Fase 4: Sovereign Autonomy) dapat diakses secara langsung pada [Master Implementation Plan](file:///Users/mac/Downloads/URUN/docs/master_implementation_plan.md).
