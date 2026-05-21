import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const explanation = {
    platform: "URUN Sovereign Micro-Community OS",
    version: "1.0.0",
    framework: "Deterministic Rule-Based Trust Protocol",
    description: "Algoritma reputasi dan alokasi dana kolektif di URUN dirancang 100% deterministik, dijalankan langsung oleh database-level triggers (PostgreSQL Engine), bebas dari kecerdasan buatan probabilistik atau manipulasi bias eksternal.",
    reputation_engine: {
      math_model: "R_member = R_floor + sum(C_action)",
      constants: {
        reputation_floor: 10,
        explanation: "Setiap warga yang terdaftar otomatis mendapatkan basis nilai awal (reputation floor) sebesar 10 poin."
      },
      points_system: {
        referral_success: {
          points: 2,
          formula: "R_referrer = R_referrer + 2",
          description: "Warga A membagikan tautan rujukan proyek pengadaan ke Warga B. Saat Warga B sukses ikut serta dalam program, reputasi Warga A meningkat."
        },
        tender_subscription: {
          points: 5,
          formula: "R_member = R_member + 5",
          description: "Warga secara aktif berkomitmen ikut mendanai tender warga (pengadaan bersama) secara tepat waktu."
        },
        multisig_approval: {
          points: 10,
          formula: "R_witness = R_witness + 10",
          description: "Pengurus/Witness memvalidasi dan membubuhkan tanda tangan digital pada transaksi Multi-Sig di atas ambang batas (Rp 5.000.000)."
        },
        penalization_delay: {
          points: -5,
          formula: "R_member = R_member - 5",
          description: "Keterlambatan penyelesaian pembayaran atau pembiaran tender yang melewati batas waktu kritis (Grace Period)."
        }
      },
      trust_levels: [
        { threshold: 10, title: "Warga Baru 🌟", description: "Anggota komunitas yang baru terverifikasi oleh pengurus." },
        { threshold: 10, title: "Warga Aktif ⭐", description: "Rutin berpartisipasi dan menjaga integritas finansial." },
        { threshold: 30, title: "Warga Teladan 🎖️", description: "Banyak berkontribusi memberikan rujukan dan memfasilitasi musyawarah." },
        { threshold: 100, title: "Warga Inspiratif 🏆", description: "Tingkat dedikasi tertinggi dengan rekam jejak transparansi absolut." }
      ]
    },
    matching_engine: {
      math_model: {
        allocation_ratio: "70/30",
        description: "Setiap penggalangan dana URUN warga dialokasikan secara transparan dengan rasio 70% untuk pembiayaan riil proyek (outflow supplier) dan 30% untuk kas simpanan/cadangan darurat komunitas serta pemeliharaan node operasional.",
        quadratic_factor: "F_match = (sum(sqrt(c_i)))^2",
        quadratic_explanation: "Di masa mendatang, prioritas proyek dapat dihitung menggunakan Quadratic Funding untuk memastikan proyek dengan jumlah kontributor terbanyak (dukungan terluas) mendapat prioritas pencairan di atas proyek yang didominasi oleh segelintir penyumbang besar."
      },
      multisig_rule: {
        threshold: 5000000,
        currency: "IDR",
        required_signatures: 2,
        description: "Setiap pengeluaran kas atau pemindahan dana di atas Rp 5.000.000 wajib dikunci (status PENDING) oleh RPC process_ledger_entry dan hanya dapat dicarikan setelah memperoleh minimal 2 persetujuan digital dari pengurus berwenang."
      }
    },
    auditability: {
      ledger_policy: "IMMUTABLE APPEND-ONLY",
      technical_stack: "PostgreSQL Row-Level Security (RLS) + deterministic database triggers.",
      verification_endpoints: [
        { path: "/api/leaderboard", method: "GET", purpose: "Audit publik peringkat dedikasi warga" },
        { path: "/api/analytics/trends", method: "GET", purpose: "Analisis tren kontribusi terproteksi privasi warga" }
      ]
    }
  };

  return NextResponse.json(explanation, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=1800',
      'Content-Type': 'application/json'
    }
  });
}
