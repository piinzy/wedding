'use client';

import { useState, useTransition } from 'react';
import { updateVendorProfile } from '@/lib/actions/vendor';

const SERVICE_TYPES = [
  { value: 'hall',          label: 'قاعة أفراح'       },
  { value: 'photographer',  label: 'تصوير'             },
  { value: 'catering',      label: 'ضيافة وبوفيه'      },
  { value: 'decoration',    label: 'ديكور وتنسيق زهور' },
  { value: 'entertainment', label: 'ترفيه وفعاليات'    },
  { value: 'other',         label: 'خدمة أخرى'         },
];

const CITIES = ['الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الطائف', 'أبها', 'تبوك', 'القصيم'];

type Profile = {
  business_name: string;
  service_type: string;
  city: string | null;
  description: string | null;
  price_range_min: number | null;
  price_range_max: number | null;
  is_approved: boolean;
};

export function VendorProfileForm({ profile }: { profile: Profile }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    business_name: profile.business_name,
    city: profile.city ?? '',
    description: profile.description ?? '',
    price_range_min: profile.price_range_min?.toString() ?? '',
    price_range_max: profile.price_range_max?.toString() ?? '',
  });

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
    setError('');
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateVendorProfile({
          business_name: form.business_name,
          city: form.city || undefined,
          description: form.description || undefined,
          price_range_min: form.price_range_min ? Number(form.price_range_min) : undefined,
          price_range_max: form.price_range_max ? Number(form.price_range_max) : undefined,
        });
        setSaved(true);
      } catch {
        setError('حدث خطأ أثناء الحفظ، حاول مرة أخرى');
      }
    });
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {saved && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-sm text-green-700 text-sm">
          ✓ تم حفظ التغييرات بنجاح
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-red-600 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="input-label">اسم العمل التجاري *</label>
        <input
          type="text"
          value={form.business_name}
          onChange={e => set('business_name', e.target.value)}
          maxLength={200}
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="input-label">نوع الخدمة</label>
        <select disabled className="input-field opacity-60 cursor-not-allowed">
          {SERVICE_TYPES.map(t => (
            <option key={t.value} value={t.value} selected={t.value === profile.service_type}>
              {t.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-1">لتغيير نوع الخدمة تواصل مع الدعم</p>
      </div>

      <div>
        <label className="input-label">المدينة</label>
        <select
          value={form.city}
          onChange={e => set('city', e.target.value)}
          className="input-field"
        >
          <option value="">اختر المدينة</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="input-label">وصف الخدمة</label>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={5}
          maxLength={2000}
          className="input-field resize-none"
        />
        <p className="text-xs text-gray-400 mt-1 text-left">{form.description.length}/2000</p>
      </div>

      <div>
        <label className="input-label">نطاق السعر (ريال سعودي)</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={form.price_range_min}
            onChange={e => set('price_range_min', e.target.value)}
            placeholder="من"
            min={0}
            className="input-field"
          />
          <input
            type="number"
            value={form.price_range_max}
            onChange={e => set('price_range_max', e.target.value)}
            placeholder="إلى"
            min={0}
            className="input-field"
          />
        </div>
      </div>

      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            جارٍ الحفظ...
          </span>
        ) : 'حفظ التغييرات'}
      </button>
    </form>
  );
}
