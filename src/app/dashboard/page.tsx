import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  // Fetch user data securely on server-side
  const { data: member, error } = await supabaseAdmin
    .from('community_members')
    .select(`
      id,
      role,
      reputation_score,
      profiles!community_members_profile_id_fkey (
        id,
        full_name,
        phone
      ),
      communities (
        id,
        name,
        geo_context
      )
    `)
    .eq('profile_id', session.profileId)
    .eq('community_id', session.communityId)
    .single();

  if (error || !member) {
    // Session is invalid or member deleted
    redirect('/login');
  }

  const profile = member.profiles as any;
  const community = member.communities as any;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-hidden">
      {/* Radial Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none -z-10"></div>

      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-xl font-bold text-zinc-950">U</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">URUN</span>
                <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">Warga</span>
              </div>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <form action="/api/auth/logout" method="POST">
              <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Keluar</button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Selamat Datang, {profile.full_name.split(' ')[0]}</h1>
            <p className="text-zinc-400">Pusat Data Warga untuk Komunitas <strong className="text-emerald-400">{community.name}</strong></p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center gap-4">
            <div>
              <div className="text-xs text-zinc-500 font-medium">Reputasi Sosial</div>
              <div className="text-xl font-black text-emerald-400">{member.reputation_score} pts</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              ✦
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions / Kedaulatan Data */}
            <section className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-white mb-6">Hak Kedaulatan Data (PDP)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href="/api/profile/export" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-5 rounded-xl border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    ↓
                  </div>
                  <h3 className="font-bold text-white mb-1">Unduh Portabilitas</h3>
                  <p className="text-xs text-zinc-400">Unduh seluruh riwayat urunan, suara persetujuan, dan jejak transaksi Anda dalam format JSON terstandar.</p>
                </a>
                
                <form action="/api/profile/delete" method="POST" className="p-5 rounded-xl border border-red-900/50 bg-red-950/20 hover:bg-red-950/40 transition-colors group flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      ✕
                    </div>
                    <h3 className="font-bold text-white mb-1">Hapus Data Permanen</h3>
                    <p className="text-xs text-zinc-400 mb-4">Minta penghapusan data dari sistem URUN. Identitas akan dianomisasi (Sesuai regulasi PDP).</p>
                  </div>
                  <button type="submit" className="text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-lg self-start transition-colors">
                    Hapus Akun & Data
                  </button>
                </form>
              </div>
            </section>

            {/* Role Specific Actions */}
            {(member.role === 'pengurus' || member.role === 'admin') && (
              <section className="p-6 rounded-2xl border border-emerald-900/50 bg-emerald-950/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    👑
                  </div>
                  <h2 className="text-lg font-bold text-white">Menu Khusus Pengurus</h2>
                </div>
                <p className="text-sm text-zinc-400 mb-6">Anda memiliki akses verifikasi Multi-Sig untuk {community.name}.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="/admin" className="block p-4 rounded-xl border border-emerald-800 bg-emerald-900/20 hover:bg-emerald-900/40 transition-colors group">
                    <h3 className="font-bold text-emerald-400 mb-1">Manajemen Komunitas</h3>
                    <p className="text-xs text-zinc-500">Atur warga, kas, dan verifikasi anggota.</p>
                  </Link>
                  <Link href="/multisig" className="block p-4 rounded-xl border border-emerald-800 bg-emerald-900/20 hover:bg-emerald-900/40 transition-colors group">
                    <h3 className="font-bold text-emerald-400 mb-1">Multi-Sig Panel</h3>
                    <p className="text-xs text-zinc-500">Setujui pengadaan logistik atau pencairan kas.</p>
                  </Link>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Profil Anda</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-zinc-500 mb-1">Nama Lengkap</div>
                  <div className="font-semibold text-white">{profile.full_name}</div>
                </div>
                <div>
                  <div className="text-zinc-500 mb-1">Nomor WhatsApp</div>
                  <div className="font-semibold text-zinc-300 font-mono">{profile.phone}</div>
                </div>
                <div>
                  <div className="text-zinc-500 mb-1">Peran</div>
                  <div className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700 capitalize">
                    {member.role}
                  </div>
                </div>
                <div>
                  <div className="text-zinc-500 mb-1">Status Verifikasi</div>
                  <div className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                    Aktif
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Status Komunitas</h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800/60">
                  <span className="text-zinc-500">Provinsi</span>
                  <span className="text-white">{community.geo_context?.province || 'DKI Jakarta'}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800/60">
                  <span className="text-zinc-500">Kota/Kabupaten</span>
                  <span className="text-white">{community.geo_context?.regency || 'Jakarta Timur'}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-zinc-500">Kecamatan</span>
                  <span className="text-white">{community.geo_context?.district || 'Pasar Rebo'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
