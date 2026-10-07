import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { VendorProfileForm } from '@/components/vendor/VendorProfileForm';
import { VendorLayout } from '@/components/dashboard/VendorLayout';
import Link from 'next/link';

export default async function VendorProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('vendor_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!profile) redirect('/vendor/setup');

  return (
    <VendorLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-brand-charcoal">تعديل الملف التجاري</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              الحالة:{' '}
              <span className={profile.is_approved ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                {profile.is_approved ? '✓ معتمد ومنشور' : '⏳ قيد المراجعة'}
              </span>
            </p>
          </div>
          <Link href="/vendor" className="text-sm text-brand-gold hover:underline">
            ← العودة للوحة
          </Link>
        </div>

        <div className="bg-white rounded-sm shadow-card border border-gray-100 p-6">
          <VendorProfileForm profile={profile} />
        </div>
      </div>
    </VendorLayout>
  );
}
