'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getOrganizerDashboardData() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [profileRes, tasksRes, budgetRes] = await Promise.all([
    supabase
      .from('event_organizer_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true }),
    supabase
      .from('budget_items')
      .select('*'),
  ]);

  // tasks and budget_items need organizer profile id — join via profile
  const profile = profileRes.data;
  if (!profile) return { profile: null, tasks: [], budgetItems: [], user };

  const [tasksData, budgetData] = await Promise.all([
    supabase
      .from('tasks')
      .select('*')
      .eq('organizer_id', profile.id)
      .order('due_date', { ascending: true }),
    supabase
      .from('budget_items')
      .select('*, vendor_profiles(business_name)')
      .eq('organizer_id', profile.id),
  ]);

  return {
    user,
    profile,
    tasks: tasksData.data ?? [],
    budgetItems: budgetData.data ?? [],
  };
}

export async function updateOrganizerProfile(data: {
  event_date?: string;
  event_type?: string;
  city?: string;
  total_budget?: number;
  guest_count?: number;
  partner_name?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { error } = await supabase
    .from('event_organizer_profiles')
    .update(data)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);
}

export async function createTask(data: {
  title: string;
  description?: string;
  due_date?: string;
  category?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('event_organizer_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) throw new Error('Profile not found');

  const { error } = await supabase.from('tasks').insert({
    ...data,
    organizer_id: profile.id,
    created_by: 'user',
  });

  if (error) throw new Error(error.message);
}

export async function toggleTask(taskId: string, isCompleted: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { error } = await supabase
    .from('tasks')
    .update({ is_completed: isCompleted })
    .eq('id', taskId);

  if (error) throw new Error(error.message);
}
