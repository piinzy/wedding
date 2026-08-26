'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getVendorDashboardData() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('vendor_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!profile) return { user, profile: null, inquiries: [], reviews: [], photos: [] };

  const [inquiriesRes, reviewsRes, photosRes] = await Promise.all([
    supabase
      .from('vendor_inquiries')
      .select('*, event_organizer_profiles(user_id, users(full_name))')
      .eq('vendor_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('reviews')
      .select('*')
      .eq('vendor_id', profile.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('vendor_photos')
      .select('*')
      .eq('vendor_id', profile.id)
      .order('display_order', { ascending: true }),
  ]);

  return {
    user,
    profile,
    inquiries: inquiriesRes.data ?? [],
    reviews: reviewsRes.data ?? [],
    photos: photosRes.data ?? [],
  };
}

export async function updateVendorProfile(data: {
  business_name?: string;
  city?: string;
  description?: string;
  price_range_min?: number;
  price_range_max?: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { error } = await supabase
    .from('vendor_profiles')
    .update(data)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);
}

export async function replyToInquiry(inquiryId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { error } = await supabase
    .from('vendor_inquiries')
    .update({ status: 'replied' })
    .eq('id', inquiryId);

  if (error) throw new Error(error.message);
}
