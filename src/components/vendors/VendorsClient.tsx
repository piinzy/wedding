'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const SERVICE_TYPES = [
  { key: 'all',           label: 'الكل',        icon: '✦' },
  { key: 'photography',   label: 'تصوير',       icon: '📸' },
  { key: 'venue',         label: 'قاعة',        icon: '🏛️' },
  { key: 'catering',      label: 'ضيافة',       icon: '🍽️' },
  { key: 'decoration',    label: 'ديكور',       icon: '🌸' },
  { key: 'music',         label: 'موسيقى',      icon: '🎵' },
  { key: 'makeup',        label: 'ميك أب',      icon: '💄' },
  { key: 'flowers',       label: 'زهور',        icon: '💐' },
  { key: 'invitation',    label: 'دعوات',       icon: '💌' },
];

const CITIES = ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة', 'أبها'];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

type Vendor = {
  id: string;
  business_name: string;
  service_type: string;
  city: string;
  description?: string;
  price_per_event?: number;
  average_rating?: number;
  review_count?: number;
  cover_image_url?: string;
  is_approved: boolean;
};

// Fallback mock vendors shown when DB has no data yet
const MOCK_VENDORS: Vendor[] = [
  { id: 'm1', business_name: 'استوديو لحظات', service_type: 'photography', city: 'الرياض', description: 'تخصص في تصوير حفلات الزفاف والمناسبات الفاخرة بأسلوب عصري وراقٍ', price_per_event: 8000, average_rating: 4.9, review_count: 48, is_approved: true },
  { id: 'm2', business_name: 'قاعة النخبة', service_type: 'venue', city: 'جدة', description: 'قاعة أفراح فاخرة تستوعب ٥٠٠ ضيف مع كامل التجهيزات والتكييف', price_per_event: 25000, average_rating: 4.8, review_count: 32, is_approved: true },
  { id: 'm3', business_name: 'ضيافة الملكة', service_type: 'catering', city: 'الرياض', description: 'تقديم أشهى المأكولات العربية والشرقية لجميع المناسبات', price_per_event: 15000, average_rating: 4.7, review_count: 61, is_approved: true },
  { id: 'm4', business_name: 'زهور الربيع', service_type: 'flowers', city: 'الدمام', description: 'تنسيق زهور احترافي للحفلات والمناسبات بأجمل الورود الطازجة', price_per_event: 4500, average_rating: 4.8, review_count: 27, is_approved: true },
  { id: 'm5', business_name: 'ديكور الأحلام', service_type: 'decoration', city: 'الرياض', description: 'تصميم وتنفيذ ديكورات متكاملة للحفلات بأسلوب عصري وكلاسيكي', price_per_event: 12000, average_rating: 4.6, review_count: 19, is_approved: true },
  { id: 'm6', business_name: 'ميك أب ستار', service_type: 'makeup', city: 'جدة', description: 'مكياج عرائس احترافي مع تسريحة وعناية بالبشرة ليوم لا يُنسى', price_per_event: 2500, average_rating: 4.9, review_count: 83, is_approved: true },
];

export default function VendorsClient({ initialVendors }: { initialVendors: Vendor[] }) {
  const vendors = initialVendors.length > 0 ? initialVendors : MOCK_VENDORS;

  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [city, setCity] = useState('');
  const [maxPrice, setMaxPrice] = useState(0);
  const [minRating, setMinRating] = useState(0);

  const filtered = useMemo(() => {
    return vendors.filter(v => {
      if (activeType !== 'all' && v.service_type !== activeType) return false;
      if (city && v.city !== city) return false;
      if (maxPrice > 0 && (v.price_per_event ?? 0) > maxPrice) return false;
      if (minRating > 0 && (v.average_rating ?? 0) < minRating) return false;
      if (search && !v.business_name.includes(search) && !v.description?.includes(search)) return false;
      return true;
    });
  }, [vendors, activeType, city, maxPrice, minRating, search]);

  const serviceLabel = (type: string) => SERVICE_TYPES.find(s => s.key === type)?.label ?? type;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Search */}
      <div className="mb-6 relative max-w-xl">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث عن مورد..."
          className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-brand-gold bg-white"
        />
        <svg className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      </div>

      {/* Service type tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {SERVICE_TYPES.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveType(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeType === t.key
                ? 'bg-brand-charcoal text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-gold'
            }`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-white rounded-sm border border-gray-100 p-5 sticky top-24">
            <h3 className="font-bold text-brand-charcoal text-sm mb-5">تصفية النتائج</h3>

            <div className="mb-5">
              <p className="text-xs text-gray-400 mb-2 font-medium">المدينة</p>
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-sm px-3 py-2 focus:outline-none focus:border-brand-gold"
              >
                <option value="">كل المدن</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="mb-5">
              <p className="text-xs text-gray-400 mb-2 font-medium">الحد الأقصى للسعر</p>
              <select
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full text-sm border border-gray-200 rounded-sm px-3 py-2 focus:outline-none focus:border-brand-gold"
              >
                <option value={0}>بدون حد</option>
                <option value={5000}>حتى ٥٠٠٠ ر.س</option>
                <option value={10000}>حتى ١٠٠٠٠ ر.س</option>
                <option value={20000}>حتى ٢٠٠٠٠ ر.س</option>
                <option value={50000}>حتى ٥٠٠٠٠ ر.س</option>
              </select>
            </div>

            <div className="mb-5">
              <p className="text-xs text-gray-400 mb-2 font-medium">أدنى تقييم</p>
              <div className="flex gap-2">
                {[0, 4, 4.5].map(r => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`text-xs px-2.5 py-1.5 rounded-sm border transition-all ${
                      minRating === r ? 'bg-brand-charcoal text-white border-brand-charcoal' : 'border-gray-200 text-gray-600 hover:border-brand-gold'
                    }`}
                  >
                    {r === 0 ? 'الكل' : r === 4 ? '+٤★' : '+٤.٥★'}
                  </button>
                ))}
              </div>
            </div>

            {(city || maxPrice > 0 || minRating > 0) && (
              <button
                onClick={() => { setCity(''); setMaxPrice(0); setMinRating(0); }}
                className="text-xs text-brand-gold hover:underline"
              >
                مسح الفلاتر
              </button>
            )}
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-4">{filtered.length} مورد</p>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-medium">لا توجد نتائج مطابقة</p>
              <p className="text-xs mt-1">جرّب تغيير الفلاتر أو البحث</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(v => (
                <Link
                  key={v.id}
                  href={`/vendors/${v.id}`}
                  className="bg-white rounded-sm border border-gray-100 shadow-card hover:shadow-brand hover:-translate-y-1 transition-all duration-200 overflow-hidden group"
                >
                  {/* Cover */}
                  <div className="h-36 bg-gradient-to-br from-brand-blush to-brand-gold/20 flex items-center justify-center text-5xl">
                    {SERVICE_TYPES.find(s => s.key === v.service_type)?.icon ?? '✦'}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-brand-charcoal text-sm group-hover:text-brand-gold transition-colors">{v.business_name}</h3>
                        <p className="text-xs text-gray-400">{serviceLabel(v.service_type)} · {v.city}</p>
                      </div>
                      <span className="text-xs bg-brand-gold/10 text-brand-gold font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">معتمد</span>
                    </div>

                    {v.description && (
                      <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{v.description}</p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={v.average_rating ?? 0} />
                        <span className="text-xs text-gray-400">({v.review_count ?? 0})</span>
                      </div>
                      {v.price_per_event && (
                        <span className="text-xs font-bold text-brand-charcoal">
                          {v.price_per_event.toLocaleString('ar-SA')} ر.س
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
