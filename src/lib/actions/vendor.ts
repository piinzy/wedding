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

export async function getVendors(filters?: {
  serviceType?: string;
  city?: string;
  maxPrice?: number;
  minRating?: number;
  search?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from('vendor_profiles')
    .select('*, users!inner(email)')
    .eq('is_approved', true);

  if (filters?.serviceType && filters.serviceType !== 'all') {
    query = query.eq('service_type', filters.serviceType);
  }
  if (filters?.city) {
    query = query.eq('city', filters.city);
  }
  if (filters?.maxPrice) {
    query = query.lte('price_per_event', filters.maxPrice);
  }
  if (filters?.minRating) {
    query = query.gte('average_rating', filters.minRating);
  }
  if (filters?.search) {
    query = query.ilike('business_name', `%${filters.search}%`);
  }

  const { data, error } = await query.order('average_rating', { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getVendorById(vendorId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vendor_profiles')
    .select('*, reviews(*), inquiry_messages(count)')
    .eq('id', vendorId)
    .single();
  if (error) return null;
  return data;
}

export async function createInquiry(input: {
  vendorId: string;
  message: string;
  eventDate?: string;
  eventType?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'يجب تسجيل الدخول أولاً' };

  if (!input.message || input.message.trim().length < 10) {
    return { error: 'الرسالة قصيرة جداً (١٠ أحرف على الأقل)' };
  }

  const { error } = await supabase
    .from('inquiries')
    .insert({
      vendor_id: input.vendorId,
      organizer_id: user.id,
      message: input.message.trim(),
      event_date: input.eventDate || null,
      event_type: input.eventType || null,
      status: 'pending',
    });

  if (error) return { error: 'فشل إرسال الاستفسار. حاول مجدداً.' };
  return { success: true };
}
