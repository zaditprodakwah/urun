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

-- 4. Ledger (Append-Only)  
CREATE TABLE ledger (  
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,  
  catalog_item_id UUID REFERENCES catalog_items(id) ON DELETE SET NULL,  
  actor_id UUID NOT NULL REFERENCES profiles(id),  
  amount DECIMAL(15,2) NOT NULL,  
  direction TEXT NOT NULL,  
  entry_type TEXT NOT NULL, -- 'tender_contribution', 'platform_revenue', 'community_share', 'correction'  
  ref_id UUID REFERENCES ledger(id),  
  description TEXT,
  idempotency_key UUID UNIQUE,
  multisig_status TEXT NOT NULL DEFAULT 'not_required', -- 'not_required', 'pending', 'approved', 'rejected'
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb, -- Detail metadata e.g. source_tx_id, platform, breakdown
  created_at TIMESTAMPTZ DEFAULT NOW(),  
  CONSTRAINT direction_check CHECK (direction IN ('in', 'out')),
  CONSTRAINT multisig_status_check CHECK (multisig_status IN ('not_required', 'pending', 'approved', 'rejected'))
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
2. **Fungsi Atomik (RPC):** Perubahan data wajib melalui fungsi RPC.

#### **A. Kontribusi Kolektif**
```sql
CREATE OR REPLACE FUNCTION process_collective_contribution(...) RETURNS VOID AS $$ ... $$;
```

#### **B. Pembagian Komisi Afiliasi (Epic 4)**
```sql
CREATE OR REPLACE FUNCTION process_affiliate_commission(
  p_idempotency_key       UUID,
  p_community_id          UUID,
  p_actor_id              UUID,
  p_catalog_item_id       UUID,
  p_platform_fee          DECIMAL(15,2),
  p_community_share       DECIMAL(15,2),
  p_description           TEXT,
  p_metadata              JSONB
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_existing_status       INT;
  v_existing_body         JSONB;
  v_community_ledger_id   UUID;
  v_platform_ledger_id    UUID;
  v_platform_idem_key     UUID;
BEGIN
  -- 1. Idempotency Check & Lock
  INSERT INTO idempotency_keys (idempotency_key, community_id, request_path)
  VALUES (p_idempotency_key, p_community_id, '/api/v1/affiliate/callback')
  ON CONFLICT (idempotency_key) DO NOTHING;

  SELECT response_status, response_body
  INTO v_existing_status, v_existing_body
  FROM idempotency_keys
  WHERE idempotency_key = p_idempotency_key
  FOR UPDATE;

  IF v_existing_status IS NOT NULL THEN
    RETURN jsonb_build_object(
      'status', 'hit',
      'response_status', v_existing_status,
      'response_body', v_existing_body
    );
  END IF;

  -- 2. Derived Idempotency Key for Platform Fee Entry to maintain referential integrity
  v_platform_idem_key := CAST(md5(p_idempotency_key::text || '-platform') AS uuid);

  -- 3. Insert community_share (70% Inbound)
  INSERT INTO ledger (
    community_id, actor_id, catalog_item_id, amount, direction,
    entry_type, description, idempotency_key, multisig_status, metadata
  ) VALUES (
    p_community_id, p_actor_id, p_catalog_item_id, p_community_share, 'in',
    'community_share', p_description, p_idempotency_key, 'not_required', p_metadata
  ) RETURNING id INTO v_community_ledger_id;

  -- 4. Insert platform_revenue (30% Outbound)
  INSERT INTO ledger (
    community_id, actor_id, catalog_item_id, amount, direction,
    entry_type, ref_id, description, idempotency_key, multisig_status, metadata
  ) VALUES (
    p_community_id, p_actor_id, p_catalog_item_id, p_platform_fee, 'out',
    'platform_revenue', v_community_ledger_id,
    'Platform operational fee (30% split from affiliate link checkout)',
    v_platform_idem_key, 'not_required', p_metadata
  ) RETURNING id INTO v_platform_ledger_id;

  -- 5. Log to Audit Trail
  INSERT INTO audit_log (
    community_id, actor_id, action, table_affected, new_value, reason
  ) VALUES (
    p_community_id, p_actor_id, 'affiliate_revenue_split', 'ledger',
    jsonb_build_object(
      'community_ledger_id', v_community_ledger_id,
      'platform_ledger_id', v_platform_ledger_id,
      'community_share', p_community_share,
      'platform_fee', p_platform_fee,
      'source_tx_id', p_metadata->>'source_tx_id',
      'platform', p_metadata->>'platform'
    ),
    'Processed external affiliate commission with 70/30 split directly to ledger (bypassing multi-sig)'
  );

  RETURN jsonb_build_object(
    'status', 'success',
    'community_ledger_id', v_community_ledger_id,
    'platform_ledger_id', v_platform_ledger_id
  );
END;
$$;
```

3. **SEO/GEO Mandates:**  
   * **Dynamic Mapping:** Larangan keras melakukan *hardcode* nilai JSON-LD. Nilai harus ditarik dinamis dari `metadata` (JSONB).  
   * **GEO Context:** Wajib menyertakan `geo_context` dari `communities` ke dalam `JSON-LD` agar mesin pencari mengenali lokasi fisik komunitas.  
   * **No-Index for Private:** Halaman katalog dengan status `private` wajib menyertakan meta tag `noindex`.  
4. **Audit-First:** Setiap pendapatan platform wajib ditag dengan `platform_revenue` di `ledger`.  
5. **Schema Evolution:** Gunakan kolom `metadata` (JSONB) daripada menambah kolom fisik untuk fitur baru.

