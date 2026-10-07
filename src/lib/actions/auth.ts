'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// ─── Validation helpers ─────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = ['organizer', 'vendor'] as const;
const VALID_EVENT_TYPES = ['wedding', 'home_party', 'occasion', 'birthday'] as const;

type RegisterResult =
  | { success: true }
  | { success: false; error: string; field?: string };

export async function registerUser(formData: {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: string;
  event_type?: string;
}): Promise<RegisterResult> {

  // ── Server-side validation (cannot be bypassed by client) ──

  const name = formData.full_name?.trim() ?? '';
  if (!name || name.length < 2) {
    return { success: false, error: 'الرجاء إدخال اسمك الكامل (حرفان على الأقل)', field: 'full_name' };
  }
  if (name.length > 100) {
    return { success: false, error: 'الاسم طويل جداً', field: 'full_name' };
  }

  const email = formData.email?.trim().toLowerCase() ?? '';
  if (!EMAIL_RE.test(email)) {
    return { success: false, error: 'البريد الإلكتروني غير صحيح', field: 'email' };
  }

  const password = formData.password ?? '';
  if (password.length < 8) {
    return { success: false, error: 'كلمة المرور يجب أن تكون ٨ أحرف على الأقل', field: 'password' };
  }
  if (password.length > 128) {
    return { success: false, error: 'كلمة المرور طويلة جداً', field: 'password' };
  }
  // Basic strength: at least one letter and one number
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { success: false, error: 'كلمة المرور يجب أن تحتوي على أحرف وأرقام', field: 'password' };
  }
  if (password !== formData.confirm_password) {
    return { success: false, error: 'كلمة المرور غير متطابقة', field: 'confirm_password' };
  }

  const role = formData.role;
  if (!VALID_ROLES.includes(role as typeof VALID_ROLES[number])) {
    return { success: false, error: 'نوع الحساب غير صحيح', field: 'role' };
  }

  const eventType = formData.event_type;
  if (role === 'organizer') {
    if (!eventType || !VALID_EVENT_TYPES.includes(eventType as typeof VALID_EVENT_TYPES[number])) {
      return { success: false, error: 'الرجاء اختيار نوع المناسبة', field: 'event_type' };
    }
  }

  // ── Supabase signup ──────────────────────────────────────────
  const supabase = await createClient();

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        role,
        event_type: role === 'organizer' ? eventType : undefined,
      },
    },
  });

  if (signUpError) {
    if (signUpError.message.includes('already registered') || signUpError.message.includes('already been registered')) {
      return { success: false, error: 'هذا البريد الإلكتروني مسجل مسبقاً', field: 'email' };
    }
    if (signUpError.message.includes('rate limit')) {
      return { success: false, error: 'محاولات كثيرة، انتظر دقيقة وحاول مجدداً' };
    }
    return { success: false, error: 'حدث خطأ أثناء التسجيل، حاول مرة أخرى' };
  }

  return { success: true };
}

// ─── Vendor profile creation (called after email verification) ──
export async function createVendorProfile(data: {
  business_name: string;
  service_type: string;
  city: string;
  description: string;
  price_range_min?: number;
  price_range_max?: number;
}): Promise<RegisterResult> {

  const VALID_SERVICE_TYPES = ['hall', 'photographer', 'catering', 'decoration', 'entertainment', 'other'];

  const name = data.business_name?.trim() ?? '';
  if (!name || name.length < 2) {
    return { success: false, error: 'الرجاء إدخال اسم العمل التجاري', field: 'business_name' };
  }
  if (name.length > 200) {
    return { success: false, error: 'اسم العمل طويل جداً', field: 'business_name' };
  }
  if (!VALID_SERVICE_TYPES.includes(data.service_type)) {
    return { success: false, error: 'نوع الخدمة غير صحيح', field: 'service_type' };
  }

  const city = data.city?.trim() ?? '';
  if (!city || city.length < 2) {
    return { success: false, error: 'الرجاء إدخال المدينة', field: 'city' };
  }

  const description = data.description?.trim() ?? '';
  if (!description || description.length < 20) {
    return { success: false, error: 'الوصف قصير جداً (٢٠ حرف على الأقل)', field: 'description' };
  }
  if (description.length > 2000) {
    return { success: false, error: 'الوصف طويل جداً', field: 'description' };
  }

  const min = data.price_range_min;
  const max = data.price_range_max;
  if (min !== undefined && (isNaN(min) || min < 0)) {
    return { success: false, error: 'الحد الأدنى للسعر غير صحيح', field: 'price_range_min' };
  }
  if (max !== undefined && (isNaN(max) || max < 0)) {
    return { success: false, error: 'الحد الأقصى للسعر غير صحيح', field: 'price_range_max' };
  }
  if (min !== undefined && max !== undefined && min > max) {
    return { success: false, error: 'الحد الأدنى للسعر يجب أن يكون أقل من الحد الأقصى', field: 'price_range_min' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Verify user has vendor role
  const { data: userRecord } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!userRecord || userRecord.role !== 'vendor') {
    return { success: false, error: 'غير مصرح لك بإنشاء ملف مورد' };
  }

  const { error } = await supabase.from('vendor_profiles').upsert({
    user_id: user.id,
    business_name: name,
    service_type: data.service_type,
    city,
    description,
    price_range_min: min ?? null,
    price_range_max: max ?? null,
    is_approved: false,
  }, { onConflict: 'user_id' });

  if (error) {
    return { success: false, error: 'حدث خطأ أثناء حفظ البيانات، حاول مرة أخرى' };
  }

  return { success: true };
}
