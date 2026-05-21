# 22_algorithm_spec

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

