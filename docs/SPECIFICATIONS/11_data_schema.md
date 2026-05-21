# 11_data_schema

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

