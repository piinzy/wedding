'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: record } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!record || record.role !== 'admin') redirect('/dashboard');
  return supabase;
}

export async function getAdminDashboardData() {
  const supabase = await requireAdmin();

  const [usersRes, pendingVendorsRes, organizersRes] = await Promise.all([
    supabase
      .from('users')
      .select('id, full_name, email, role, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('vendor_profiles')
      .select('*, users(full_name, email)')
      .eq('is_approved', false)
      .order('created_at', { ascending: false }),
    supabase
      .from('event_organizer_profiles')
      .select('id, event_type, city, created_at, users(full_name)')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  return {
    recentUsers: usersRes.data ?? [],
    pendingVendors: pendingVendorsRes.data ?? [],
    recentEvents: organizersRes.data ?? [],
    counts: {
      pendingVendors: pendingVendorsRes.data?.length ?? 0,
      recentUsers: usersRes.data?.length ?? 0,
    },
  };
}

export async function approveVendor(vendorId: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from('vendor_profiles')
    .update({ is_approved: true })
    .eq('id', vendorId);

  if (error) throw new Error(error.message);
}

export async function rejectVendor(vendorId: string) {
  const supabase = await requireAdmin();

  // Delete vendor profile (user stays in system but without vendor profile)
  const { error } = await supabase
    .from('vendor_profiles')
    .delete()
    .eq('id', vendorId);

  if (error) throw new Error(error.message);
}
