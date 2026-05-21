import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  // Fetch admin member data
  const { data: adminMember, error: adminErr } = await supabaseAdmin
    .from('community_members')
    .select('role, community_id, communities(name)')
    .eq('profile_id', session.profileId)
    .eq('community_id', session.communityId)
    .single();

  if (adminErr || !adminMember || !['pengurus', 'admin'].includes(adminMember.role)) {
    redirect('/dashboard');
  }

  // Fetch all members in this community
  const { data: members, error: membersErr } = await supabaseAdmin
    .from('community_members')
    .select(`
      id,
      role,
      status,
      reputation_score,
      joined_at,
      profiles (
        full_name,
        phone
      )
    `)
    .eq('community_id', adminMember.community_id)
    .order('joined_at', { ascending: false });

  const communityName = (adminMember.communities as any)?.name;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-hidden">
      {/* Radial Background Glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[128px] pointer-events-none -z-10"></div>

      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-xl font-bold text-zinc-950">U</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">Admin Panel</span>
                <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">Pengurus</span>
              </div>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Manajemen Komunitas</h1>
          <p className="text-zinc-400">Atur warga, kas, dan verifikasi anggota untuk <strong className="text-emerald-400">{communityName}</strong>.</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          
          {/* Members Table */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-800/60 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">Daftar Warga Komunitas</h2>
                <p className="text-xs text-zinc-500">Menampilkan seluruh anggota terdaftar.</p>
              </div>
              <button className="text-xs font-bold bg-emerald-500 text-zinc-950 px-4 py-2 rounded-lg hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
                + Tambah Warga
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nama / WhatsApp</th>
                    <th className="px-6 py-4 font-medium">Peran</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Reputasi</th>
                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {members?.map((m) => {
                    const profile = m.profiles as any;
                    return (
                      <tr key={m.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{profile.full_name}</div>
                          <div className="text-xs text-zinc-500 font-mono">{profile.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold border capitalize ${
                            m.role === 'pengurus' || m.role === 'admin' 
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                          }`}>
                            {m.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold border capitalize ${
                            m.status === 'verified'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-mono text-emerald-400">{m.reputation_score} pts</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-xs font-medium text-zinc-400 hover:text-white transition-colors underline underline-offset-2">
                            Kelola
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {(!members || members.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                        Belum ada data warga yang terdaftar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
