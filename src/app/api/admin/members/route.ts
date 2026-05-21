import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Guard: verify that the requester is indeed an admin or pengurus
async function verifyAdminAccess(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return { error: 'UNAUTHORIZED: Silakan login terlebih dahulu.', status: 401 };
  }
  if (session.role !== 'admin' && session.role !== 'pengurus') {
    return { error: 'FORBIDDEN: Hanya Admin atau Pengurus yang memiliki akses.', status: 403 };
  }
  return { session };
}

// GET: List all members in the community
export async function GET(req: NextRequest) {
  try {
    const authCheck = await verifyAdminAccess(req);
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const { communityId } = authCheck.session!;

    const { data: members, error } = await supabaseAdmin
      .from('community_members')
      .select(`
        id,
        role,
        reputation_score,
        permissions,
        joined_at,
        profiles!community_members_profile_id_fkey (
          id,
          full_name,
          phone,
          avatar_url
        )
      `)
      .eq('community_id', communityId)
      .order('joined_at', { ascending: false });

    if (error) {
      console.error('❌ Failed to fetch community members:', error);
      return NextResponse.json({ error: 'Gagal mengambil data anggota komunitas' }, { status: 500 });
    }

    return NextResponse.json({ status: true, members });
  } catch (err: any) {
    console.error('💥 Members GET critical error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Add a new citizen/member to the community
export async function POST(req: NextRequest) {
  try {
    const authCheck = await verifyAdminAccess(req);
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const { communityId, profileId: adminProfileId } = authCheck.session!;
    const body = await req.json().catch(() => ({}));
    const { name, phone, role } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Nama lengkap dan nomor WhatsApp wajib diisi.' }, { status: 400 });
    }

    const targetRole = role || 'warga';
    if (!['warga', 'pengurus', 'admin'].includes(targetRole)) {
      return NextResponse.json({ error: 'Role tidak valid.' }, { status: 400 });
    }

    // Format phone to standard
    let formattedPhone = phone.trim();
    if (formattedPhone.startsWith('08')) {
      formattedPhone = '628' + formattedPhone.slice(2);
    } else if (formattedPhone.startsWith('+628')) {
      formattedPhone = '628' + formattedPhone.slice(4);
    }

    // 1. Check if profile with phone already exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name')
      .eq('phone', formattedPhone)
      .limit(1);

    let profileId = '';
    
    if (existingProfile && existingProfile.length > 0) {
      profileId = existingProfile[0].id;
      
      // Check if already a member of this community
      const { data: existingMember } = await supabaseAdmin
        .from('community_members')
        .select('id')
        .eq('community_id', communityId)
        .eq('profile_id', profileId)
        .limit(1);

      if (existingMember && existingMember.length > 0) {
        return NextResponse.json({ error: 'Nomor WhatsApp ini sudah terdaftar sebagai warga di komunitas ini.' }, { status: 400 });
      }
    } else {
      // Create a synthetic UUID for the new user profile (since Supabase Auth requires a user first, we can generate a temporary random UUID and associate it with a synthetic auth account or just create profiles record first)
      // Actually, profiles references auth.users(id) ON DELETE CASCADE!
      // This means we MUST create the auth user FIRST before the profile!
      const syntheticEmail = `${formattedPhone}@wa.urun.id`;
      const tempPassword = `WargaUrun2026Password-TEMP-${crypto.randomUUID().slice(0, 8)}`;

      console.log(`👤 Creating auth user for new citizen: ${syntheticEmail}`);
      const { data: authUser, error: authErr } = await supabaseAdmin.auth.admin.createUser({
        email: syntheticEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { full_name: name }
      });

      if (authErr || !authUser.user) {
        console.error('❌ Failed to create auth user for new citizen:', authErr);
        return NextResponse.json({ error: `Gagal mendaftarkan akun autentikasi: ${authErr?.message}` }, { status: 500 });
      }

      profileId = authUser.user.id;

      // Create profile record (it might be automatically created by a trigger, or we insert it manually)
      // Wait, let's upsert it to be secure
      const { error: profErr } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: profileId,
          full_name: name,
          phone: formattedPhone,
          consent_version: 'v1.0',
          consent_timestamp: new Date().toISOString()
        });

      if (profErr) {
        console.error('❌ Failed to insert profile:', profErr);
        // Clean up auth user
        await supabaseAdmin.auth.admin.deleteUser(profileId);
        return NextResponse.json({ error: 'Gagal membuat profil warga.' }, { status: 500 });
      }
    }

    // 2. Add community member relation
    const defaultPermissions = {
      can_create_tender: targetRole !== 'warga',
      can_approve_multisig: targetRole === 'pengurus' || targetRole === 'admin',
      is_treasurer: false,
      is_witness: targetRole === 'pengurus',
      can_manage_catalog: targetRole !== 'warga',
      can_export_data: true
    };

    const { data: member, error: memberErr } = await supabaseAdmin
      .from('community_members')
      .insert({
        community_id: communityId,
        profile_id: profileId,
        role: targetRole,
        permissions: defaultPermissions,
        reputation_score: 10 // Start with default reputation floor
      })
      .select()
      .single();

    if (memberErr) {
      console.error('❌ Failed to add community member:', memberErr);
      return NextResponse.json({ error: 'Gagal mengasosiasikan warga ke komunitas.' }, { status: 500 });
    }

    // 3. Log sensitive action to audit_log
    await supabaseAdmin
      .from('audit_log')
      .insert({
        community_id: communityId,
        actor_id: adminProfileId,
        action: 'member_added',
        table_affected: 'community_members',
        reason: `Pengurus mendaftarkan warga baru: ${name} (${formattedPhone}) dengan role ${targetRole}.`,
        new_value: { profile_id: profileId, role: targetRole }
      });

    return NextResponse.json({
      status: true,
      message: 'Warga baru berhasil didaftarkan.',
      member
    });

  } catch (err: any) {
    console.error('💥 Members POST critical error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Update member role / shifting status
export async function PATCH(req: NextRequest) {
  try {
    const authCheck = await verifyAdminAccess(req);
    if (authCheck.error) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const { communityId, profileId: adminProfileId } = authCheck.session!;
    const body = await req.json().catch(() => ({}));
    const { memberId, role, permissions } = body;

    if (!memberId || !role) {
      return NextResponse.json({ error: 'memberId and role are required.' }, { status: 400 });
    }

    if (!['warga', 'pengurus', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Role tidak valid.' }, { status: 400 });
    }

    // Fetch member details
    const { data: member, error: fetchErr } = await supabaseAdmin
      .from('community_members')
      .select('*, profiles(full_name)')
      .eq('id', memberId)
      .eq('community_id', communityId)
      .single();

    if (fetchErr || !member) {
      return NextResponse.json({ error: 'Warga tidak ditemukan.' }, { status: 404 });
    }

    const updatedPermissions = permissions || {
      can_create_tender: role !== 'warga',
      can_approve_multisig: role === 'pengurus' || role === 'admin',
      is_treasurer: member.permissions?.is_treasurer || false,
      is_witness: role === 'pengurus',
      can_manage_catalog: role !== 'warga',
      can_export_data: true
    };

    // Update member role
    const { error: updateErr } = await supabaseAdmin
      .from('community_members')
      .update({
        role,
        permissions: updatedPermissions
      })
      .eq('id', memberId);

    if (updateErr) {
      console.error('❌ Failed to update member role:', updateErr);
      return NextResponse.json({ error: 'Gagal memperbarui role warga.' }, { status: 500 });
    }

    // Log action to audit_log
    const citizenName = (member.profiles as any)?.full_name || 'Warga';
    await supabaseAdmin
      .from('audit_log')
      .insert({
        community_id: communityId,
        actor_id: adminProfileId,
        action: 'role_changed',
        table_affected: 'community_members',
        reason: `Pengurus mengubah role ${citizenName} dari ${member.role} menjadi ${role}.`,
        new_value: { member_id: memberId, old_role: member.role, new_role: role, permissions: updatedPermissions }
      });

    return NextResponse.json({
      status: true,
      message: `Role ${citizenName} berhasil diubah menjadi ${role}.`
    });

  } catch (err: any) {
    console.error('💥 Members PATCH critical error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
