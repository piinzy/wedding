'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createVendorProfile } from '@/lib/actions/auth';

const SERVICE_TYPES = [
  { value: 'hall',          label: 'قاعة أفراح',        emoji: '🏛️' },
  { value: 'photographer',  label: 'تصوير',              emoji: '📸' },
  { value: 'catering',      label: 'ضيافة وبوفيه',       emoji: '🍽️' },
  { value: 'decoration',    label: 'ديكور وتنسيق زهور',  emoji: '💐' },
  { value: 'entertainment', label: 'ترفيه وفعاليات',     emoji: '🎵' },
  { value: 'other',         label: 'خدمة أخرى',          emoji: '✨' },
];

const CITIES = ['الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الطائف', 'أبها', 'تبوك', 'القصيم'];

export default function VendorSetupPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    business_name: '',
    service_type: '',
    city: '',
    description: '',
    price_range_min: '',
    price_range_max: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [done, setDone] = useState(false);

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setGlobalError('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError('');

    startTransition(async () => {
      const result = await createVendorProfile({
        business_name: form.business_name,
        service_type: form.service_type,
        city: form.city,
        description: form.description,
        price_range_min: form.price_range_min ? Number(form.price_range_min) : undefined,
        price_range_max: form.price_range_max ? Number(form.price_range_max) : undefined,
      });

      if (!result.success) {
        if (result.field) {
          setErrors(prev => ({ ...prev, [result.field!]: result.error }));
        } else {
          setGlobalError(result.error);
        }
        return;
      }

      setDone(true);
    });
  }

  if (done) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6">
        <div className="bg-white rounded-sm shadow-brand p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-brand-blush flex items-center justify-center text-3xl mx-auto mb-4">⏳</div>
          <h2 className="text-xl font-bold text-brand-charcoal mb-2">طلبك قيد المراجعة</h2>
          <p className="text-gray-500 text-sm mb-6">
            شكراً لتسجيلك! سيراجع فريقنا ملفك ويُبلغك بالقرار خلال ٢٤ ساعة.
          </p>
          <button
            onClick={() => router.push('/vendor')}
            className="btn-primary"
          >
            الذهاب للوحة التحكم
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-3">
        <span className="text-xl font-bold text-brand-charcoal">رباط</span>
        <span className="text-brand-gold">✦</span>
        <span className="text-sm text-gray-400">/ إنشاء ملف المورد</span>
      </header>

      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-white rounded-sm shadow-card p-8">
          <h1 className="text-2xl font-bold text-brand-charcoal mb-1">أنشئ ملفك التجاري</h1>
          <p className="text-gray-400 text-sm mb-8">سيُراجَع ملفك من قِبل الفريق قبل النشر على المنصة</p>

          {globalError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm text-red-600 text-sm">
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* Business name */}
            <div>
              <label className="input-label">اسم العمل التجاري *</label>
              <input
                type="text"
                value={form.business_name}
                onChange={e => set('business_name', e.target.value)}
                placeholder="مثال: قصر النور للأفراح"
                maxLength={200}
                className={`input-field ${errors.business_name ? 'border-red-300 focus:border-red-400' : ''}`}
              />
              {errors.business_name && <p className="text-xs text-red-500 mt-1">{errors.business_name}</p>}
            </div>

            {/* Service type */}
            <div>
              <label className="input-label">نوع الخدمة *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SERVICE_TYPES.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => set('service_type', t.value)}
                    className={`flex items-center gap-2 p-3 rounded-sm border text-sm transition-all ${
                      form.service_type === t.value
                        ? 'border-brand-gold bg-brand-gold/5 text-brand-charcoal font-semibold'
                        : 'border-gray-200 text-gray-600 hover:border-brand-gold/50'
                    }`}
                  >
                    <span>{t.emoji}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
              {errors.service_type && <p className="text-xs text-red-500 mt-1">{errors.service_type}</p>}
            </div>

            {/* City */}
            <div>
              <label className="input-label">المدينة *</label>
              <select
                value={form.city}
                onChange={e => set('city', e.target.value)}
                className={`input-field ${errors.city ? 'border-red-300' : ''}`}
              >
                <option value="">اختر مدينتك</option>
                {CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="input-label">وصف خدمتك *</label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="اكتب وصفاً تفصيلياً لخدمتك، خبرتك، وما يميزك عن غيرك..."
                rows={4}
                maxLength={2000}
                className={`input-field resize-none ${errors.description ? 'border-red-300' : ''}`}
              />
              <div className="flex justify-between mt-1">
                {errors.description
                  ? <p className="text-xs text-red-500">{errors.description}</p>
                  : <p className="text-xs text-gray-400">٢٠ حرف على الأقل</p>
                }
                <p className="text-xs text-gray-400">{form.description.length}/2000</p>
              </div>
            </div>

            {/* Price range */}
            <div>
              <label className="input-label">نطاق السعر (ريال سعودي) — اختياري</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    value={form.price_range_min}
                    onChange={e => set('price_range_min', e.target.value)}
                    placeholder="من: 5000"
                    min={0}
                    className={`input-field ${errors.price_range_min ? 'border-red-300' : ''}`}
                  />
                  {errors.price_range_min && <p className="text-xs text-red-500 mt-1">{errors.price_range_min}</p>}
                </div>
                <div>
                  <input
                    type="number"
                    value={form.price_range_max}
                    onChange={e => set('price_range_max', e.target.value)}
                    placeholder="إلى: 30000"
                    min={0}
                    className={`input-field ${errors.price_range_max ? 'border-red-300' : ''}`}
                  />
                  {errors.price_range_max && <p className="text-xs text-red-500 mt-1">{errors.price_range_max}</p>}
                </div>
              </div>
            </div>

            {/* Notice */}
            <div className="p-4 bg-brand-cream rounded-sm border border-brand-gold/20 text-sm text-gray-600">
              <p className="font-semibold text-brand-charcoal mb-1">📋 ملاحظة قبل الإرسال</p>
              <p>بعد الإرسال، سيراجع فريق رباط ملفك ويتواصل معك لاستكمال التحقق. ملفك لن يظهر للمستخدمين قبل الموافقة.</p>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جارٍ الحفظ...
                </span>
              ) : 'إرسال الطلب للمراجعة'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
