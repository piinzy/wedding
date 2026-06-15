'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

/* ══════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════ */
type ServiceType = 'all' | 'hall' | 'photographer' | 'catering' | 'decoration' | 'entertainment' | 'makeup' | 'invitation';
type SortKey     = 'top_rated' | 'most_reviewed' | 'price_asc' | 'price_desc';
type City        = 'all' | 'الرياض' | 'جدة' | 'الدمام' | 'مكة' | 'المدينة';

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const SERVICE_TYPES: { value: ServiceType; label: string; emoji: string }[] = [
  { value: 'all',           label: 'الكل',           emoji: '✦'  },
  { value: 'hall',          label: 'قاعات',           emoji: '🏛️' },
  { value: 'photographer',  label: 'تصوير',           emoji: '📸' },
  { value: 'catering',      label: 'ضيافة',           emoji: '🍽️' },
  { value: 'decoration',    label: 'ديكور',           emoji: '💐' },
  { value: 'entertainment', label: 'ترفيه',           emoji: '🎵' },
  { value: 'makeup',        label: 'ميك أب',          emoji: '💄' },
  { value: 'invitation',    label: 'دعوات',           emoji: '💌' },
];

const CITIES: { value: City; label: string }[] = [
  { value: 'all',     label: 'كل المدن'   },
  { value: 'الرياض', label: 'الرياض'     },
  { value: 'جدة',    label: 'جدة'        },
  { value: 'الدمام', label: 'الدمام'     },
  { value: 'مكة',    label: 'مكة المكرمة' },
  { value: 'المدينة',label: 'المدينة المنورة' },
];

interface Vendor {
  id: number;
  name: string;
  type: ServiceType;
  city: City;
  rating: number;
  reviews: number;
  price: number;
  priceLabel: string;
  emoji: string;
  badge?: 'موصى به' | 'الأكثر طلباً' | 'جديد';
  tags: string[];
  desc: string;
  events: string[];
}

const VENDORS: Vendor[] = [
  {
    id: 1,
    name: 'قصر النور للأفراح',
    type: 'hall', city: 'الرياض',
    rating: 4.9, reviews: 142, price: 25000, priceLabel: 'يبدأ من ٢٥٬٠٠٠ ر.س',
    emoji: '🏛️', badge: 'الأكثر طلباً',
    tags: ['٥٠٠ شخص', 'مكيف', 'باركينج', 'كاتيرينج'],
    desc: 'قاعة فاخرة في قلب الرياض بتصميم عصري وخدمة راقية على مدار ٢٠ عاماً من التميز.',
    events: ['💍', '🎉', '🎂'],
  },
  {
    id: 2,
    name: 'استوديو لحظات',
    type: 'photographer', city: 'الرياض',
    rating: 4.8, reviews: 98, price: 8000, priceLabel: 'يبدأ من ٨٬٠٠٠ ر.س',
    emoji: '📸', badge: 'موصى به',
    tags: ['فيديو ٤K', 'درون', 'ألبوم فاخر', 'جلسة تصوير'],
    desc: 'نلتقط أجمل اللحظات بعدسة احترافية وأسلوب فني مميز يخلّد ذكرياتك للأبد.',
    events: ['💍', '🎉', '🎂', '🏠'],
  },
  {
    id: 3,
    name: 'ورد وفل للديكور',
    type: 'decoration', city: 'جدة',
    rating: 4.7, reviews: 76, price: 5000, priceLabel: 'يبدأ من ٥٬٠٠٠ ر.س',
    emoji: '💐', badge: 'موصى به',
    tags: ['باقات طازجة', 'تصميم مخصص', 'إعداد وتنظيف', 'استشارة مجانية'],
    desc: 'نحوّل أحلامك لواقع مزهر. تشكيلات فريدة من الزهور الطازجة والديكورات المبتكرة.',
    events: ['💍', '🎉', '🎂', '🏠'],
  },
  {
    id: 4,
    name: 'مائدة الأصالة',
    type: 'catering', city: 'الرياض',
    rating: 4.6, reviews: 210, price: 12000, priceLabel: 'يبدأ من ١٢٬٠٠٠ ر.س',
    emoji: '🍽️', badge: undefined,
    tags: ['مطبخ عربي', 'بوفيه مفتوح', 'شيف خاص', 'خدمة طاولات'],
    desc: 'ضيافة بمستوى الفنادق الخمس نجوم. أصناف لا حصر لها من المطبخ العربي والعالمي.',
    events: ['💍', '🎉', '🏠'],
  },
  {
    id: 5,
    name: 'نغم للفرق الموسيقية',
    type: 'entertainment', city: 'جدة',
    rating: 4.9, reviews: 55, price: 6000, priceLabel: 'يبدأ من ٦٬٠٠٠ ر.س',
    emoji: '🎵', badge: 'جديد',
    tags: ['فرقة موسيقية', 'منشد', 'DJ', 'إضاءة'],
    desc: 'فرقة موسيقية متكاملة تضفي على مناسبتك أجواء احتفالية لا تُنسى بأسلوب عصري وأصيل.',
    events: ['💍', '🎉', '🎂'],
  },
  {
    id: 6,
    name: 'لمسة جمال — ميك أب',
    type: 'makeup', city: 'الرياض',
    rating: 4.8, reviews: 189, price: 1500, priceLabel: 'يبدأ من ١٬٥٠٠ ر.س',
    emoji: '💄', badge: 'موصى به',
    tags: ['هيرستايل', 'عروس', 'بخار الوجه', 'منزل أو استوديو'],
    desc: 'خبرة ١٢ عاماً في تحضير العرائس والضيفات لمناسباتهن بأحدث صيحات الميك أب.',
    events: ['💍', '🎉', '🎂'],
  },
  {
    id: 7,
    name: 'فن الدعوة',
    type: 'invitation', city: 'الدمام',
    rating: 4.5, reviews: 63, price: 500, priceLabel: 'يبدأ من ٥٠٠ ر.س',
    emoji: '💌', badge: undefined,
    tags: ['تصميم رقمي', 'طباعة فاخرة', 'توصيل', 'بطاقات هدايا'],
    desc: 'بطاقات دعوة مصممة بذوق رفيع تعكس أناقة مناسبتك من أول وهلة.',
    events: ['💍', '🎉', '🎂', '🏠'],
  },
  {
    id: 8,
    name: 'قاعة الأمسيات — جدة',
    type: 'hall', city: 'جدة',
    rating: 4.7, reviews: 88, price: 18000, priceLabel: 'يبدأ من ١٨٬٠٠٠ ر.س',
    emoji: '🏛️', badge: undefined,
    tags: ['٣٠٠ شخص', 'مطل على البحر', 'كاتيرينج', 'غرفة عقد'],
    desc: 'قاعة ساحلية بإطلالة خليج جدة المذهلة. تجمع بين الفخامة والطابع المائي الفريد.',
    events: ['💍', '🎉'],
  },
  {
    id: 9,
    name: 'عالم الحلويات',
    type: 'catering', city: 'مكة',
    rating: 4.6, reviews: 44, price: 2000, priceLabel: 'يبدأ من ٢٬٠٠٠ ر.س',
    emoji: '🎂', badge: 'جديد',
    tags: ['كيك مخصص', 'حلويات شرقية', 'تزيين', 'توصيل'],
    desc: 'تورتات وحلويات فاخرة مصنوعة بأيدي حلوانيين محترفين لتضيف لمسة حلوة لمناسبتك.',
    events: ['🎂', '💍', '🎉'],
  },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'top_rated',    label: 'الأعلى تقييماً' },
  { value: 'most_reviewed',label: 'الأكثر تقييماً' },
  { value: 'price_asc',   label: 'السعر: الأقل أولاً' },
  { value: 'price_desc',  label: 'السعر: الأعلى أولاً' },
];

const BADGE_STYLE: Record<string, string> = {
  'موصى به':     'bg-brand-gold/15 text-brand-gold-dark border border-brand-gold/30',
  'الأكثر طلباً': 'bg-purple-50 text-purple-700 border border-purple-200',
  'جديد':         'bg-green-50 text-green-700 border border-green-200',
};

/* ══════════════════════════════════════════════
   COMPONENTS
══════════════════════════════════════════════ */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-brand-gold' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

function VendorCard({ v }: { v: Vendor }) {
  return (
    <Link href={`/vendors/${v.id}`} className="group bg-white rounded-sm shadow-card border border-gray-100 overflow-hidden hover:shadow-brand hover:-translate-y-0.5 transition-all duration-200 flex flex-col">

      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-brand-cream to-brand-blush flex items-center justify-center overflow-hidden">
        <span className="text-7xl opacity-30 group-hover:scale-110 transition-transform duration-300">{v.emoji}</span>

        {/* Badge */}
        {v.badge && (
          <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_STYLE[v.badge]}`}>
            {v.badge}
          </span>
        )}

        {/* Event type pills */}
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {v.events.map(e => (
            <span key={e} className="text-sm bg-white/90 backdrop-blur-sm w-7 h-7 rounded-full flex items-center justify-center shadow-sm">
              {e}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-brand-charcoal text-sm leading-tight group-hover:text-brand-gold transition-colors">
            {v.name}
          </h3>
        </div>

        {/* City */}
        <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          {v.city}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={v.rating} />
          <span className="text-xs font-bold text-brand-charcoal">{v.rating}</span>
          <span className="text-xs text-gray-400">({v.reviews} تقييم)</span>
        </div>

        {/* Desc */}
        <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1 line-clamp-2">{v.desc}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {v.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
          {v.tags.length > 3 && (
            <span className="text-xs text-gray-400 px-1">+{v.tags.length - 3}</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400">السعر</p>
            <p className="text-sm font-bold text-brand-charcoal">{v.priceLabel}</p>
          </div>
          <span className="text-xs bg-brand-charcoal text-white px-3 py-1.5 rounded-sm group-hover:bg-brand-gold transition-colors font-medium">
            تواصل الآن
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function VendorsPage() {
  const [search,      setSearch]      = useState('');
  const [activeType,  setActiveType]  = useState<ServiceType>('all');
  const [activeCity,  setActiveCity]  = useState<City>('all');
  const [sortKey,     setSortKey]     = useState<SortKey>('top_rated');
  const [maxPrice,    setMaxPrice]    = useState(50000);
  const [minRating,   setMinRating]   = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...VENDORS];

    if (search)              list = list.filter(v => v.name.includes(search) || v.desc.includes(search) || v.tags.some(t => t.includes(search)));
    if (activeType !== 'all') list = list.filter(v => v.type === activeType);
    if (activeCity !== 'all') list = list.filter(v => v.city === activeCity);
    list = list.filter(v => v.price <= maxPrice && v.rating >= minRating);

    switch (sortKey) {
      case 'top_rated':    return list.sort((a,b) => b.rating - a.rating);
      case 'most_reviewed':return list.sort((a,b) => b.reviews - a.reviews);
      case 'price_asc':    return list.sort((a,b) => a.price - b.price);
      case 'price_desc':   return list.sort((a,b) => b.price - a.price);
    }
  }, [search, activeType, activeCity, sortKey, maxPrice, minRating]);

  function resetFilters() {
    setSearch(''); setActiveType('all'); setActiveCity('all');
    setSortKey('top_rated'); setMaxPrice(50000); setMinRating(0);
  }

  const hasFilters = activeType !== 'all' || activeCity !== 'all' || maxPrice < 50000 || minRating > 0 || search;

  return (
    <div className="min-h-screen bg-[#F7F5F2]">

      {/* ══ NAVBAR ══ */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-brand-charcoal text-lg font-bold">رباط</span>
            <span className="text-brand-gold text-xl">✦</span>
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-500">
            <Link href="/vendors" className="text-brand-gold font-semibold">الموردون</Link>
            <Link href="/dashboard" className="hover:text-brand-charcoal transition-colors">لوحتي</Link>
          </div>
          <Link href="/login" className="text-sm font-semibold bg-brand-charcoal text-white px-4 py-2 rounded-sm hover:bg-brand-charcoal-light transition-colors">
            تسجيل الدخول
          </Link>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <div className="relative overflow-hidden bg-brand-charcoal text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #C9A96E 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C9A96E 0%, transparent 50%)' }} />
        <div className="absolute top-4 left-8 text-brand-gold/20 text-9xl select-none font-bold">✦</div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-xs font-medium mb-5">
            <span className="text-brand-gold">✦</span>
            +{VENDORS.length} مزود خدمات معتمد
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
            اكتشف أفضل مزودي خدمات المناسبات
          </h1>
          <p className="text-white/60 text-base mb-8">
            قاعات، تصوير، ضيافة، ديكور وأكثر — كل ما تحتاجه لمناسبة لا تُنسى
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-sm shadow-brand overflow-hidden">
              <div className="flex items-center pr-4 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث عن قاعة، مصور، ديكور..."
                className="flex-1 px-3 py-4 text-brand-charcoal text-sm focus:outline-none placeholder-gray-400"
              />
              <button className="bg-brand-gold text-white px-6 py-4 text-sm font-semibold hover:bg-brand-gold-dark transition-colors whitespace-nowrap">
                بحث
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══ SERVICE TYPE TABS ══ */}
      <div className="bg-white border-b border-gray-100 sticky top-[65px] z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {SERVICE_TYPES.map(s => (
              <button
                key={s.value}
                onClick={() => setActiveType(s.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium whitespace-nowrap transition-all duration-150 flex-shrink-0 ${
                  activeType === s.value
                    ? 'bg-brand-charcoal text-white'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-brand-charcoal'
                }`}
              >
                <span>{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6">

          {/* ── Sidebar filters ── */}
          <>
            {/* Mobile overlay */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            <aside className={`
              fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-xl overflow-y-auto p-6
              transform transition-transform duration-300
              ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
              lg:relative lg:translate-x-0 lg:w-64 lg:shadow-none lg:rounded-sm lg:border lg:border-gray-100 lg:h-fit lg:sticky lg:top-36
            `}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-brand-charcoal">تصفية النتائج</h2>
                <div className="flex items-center gap-2">
                  {hasFilters && (
                    <button onClick={resetFilters} className="text-xs text-brand-gold hover:underline">مسح الكل</button>
                  )}
                  <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>

              {/* City */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">المدينة</h3>
                <div className="space-y-2">
                  {CITIES.map(c => (
                    <label key={c.value} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                        activeCity === c.value ? 'bg-brand-gold border-brand-gold' : 'border-gray-300 group-hover:border-brand-gold-light'
                      }`} onClick={() => setActiveCity(c.value)}>
                        {activeCity === c.value && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12"><path d="M10 3L5 8.5 2 5.5"/></svg>}
                      </div>
                      <span className={`text-sm ${activeCity === c.value ? 'text-brand-charcoal font-semibold' : 'text-gray-500'}`}>
                        {c.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Price */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">الحد الأقصى للسعر</h3>
                  <span className="text-xs font-bold text-brand-gold">{maxPrice.toLocaleString('ar-SA')} ر.س</span>
                </div>
                <input
                  type="range" min={500} max={50000} step={500}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-gold"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>٥٠٠</span>
                  <span>٥٠٬٠٠٠</span>
                </div>
              </div>

              {/* Min Rating */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">الحد الأدنى للتقييم</h3>
                <div className="space-y-2">
                  {[0, 4, 4.5, 4.8].map(r => (
                    <label key={r} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        minRating === r ? 'bg-brand-gold border-brand-gold' : 'border-gray-300 group-hover:border-brand-gold-light'
                      }`} onClick={() => setMinRating(r)}>
                        {minRating === r && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {r === 0
                          ? <span className="text-sm text-gray-500">الكل</span>
                          : <>
                              <StarRating rating={r} />
                              <span className="text-sm text-gray-500">+{r}</span>
                            </>
                        }
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={() => setSidebarOpen(false)} className="lg:hidden btn-primary mt-2">
                عرض النتائج ({filtered.length})
              </button>
            </aside>
          </>

          {/* ── Results ── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-sm border border-gray-200 bg-white px-3 py-2 rounded-sm hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
                  </svg>
                  تصفية
                  {hasFilters && <span className="w-2 h-2 rounded-full bg-brand-gold" />}
                </button>

                <p className="text-sm text-gray-500">
                  <span className="font-bold text-brand-charcoal">{filtered.length}</span> مزود خدمات
                  {activeType !== 'all' && <span className="text-brand-gold"> · {SERVICE_TYPES.find(s => s.value === activeType)?.label}</span>}
                </p>
              </div>

              {/* Sort */}
              <select
                value={sortKey}
                onChange={e => setSortKey(e.target.value as SortKey)}
                className="text-sm border border-gray-200 bg-white rounded-sm px-3 py-2 text-brand-charcoal focus:outline-none focus:border-brand-gold"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {search && (
                  <span className="flex items-center gap-1.5 text-xs bg-brand-charcoal text-white px-3 py-1.5 rounded-full">
                    "{search}"
                    <button onClick={() => setSearch('')} className="hover:text-gray-300">×</button>
                  </span>
                )}
                {activeType !== 'all' && (
                  <span className="flex items-center gap-1.5 text-xs bg-brand-gold text-white px-3 py-1.5 rounded-full">
                    {SERVICE_TYPES.find(s => s.value === activeType)?.label}
                    <button onClick={() => setActiveType('all')} className="hover:text-gray-200">×</button>
                  </span>
                )}
                {activeCity !== 'all' && (
                  <span className="flex items-center gap-1.5 text-xs bg-gray-700 text-white px-3 py-1.5 rounded-full">
                    {activeCity}
                    <button onClick={() => setActiveCity('all')} className="hover:text-gray-300">×</button>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(v => <VendorCard key={v.id} v={v} />)}
              </div>
            ) : (
              <div className="text-center py-20">
                <span className="text-6xl block mb-4">🔍</span>
                <h3 className="font-bold text-brand-charcoal text-lg mb-2">لا توجد نتائج</h3>
                <p className="text-gray-400 text-sm mb-5">جرب تغيير معايير البحث أو التصفية</p>
                <button onClick={resetFilters} className="btn-primary w-auto px-8 inline-block">مسح الفلاتر</button>
              </div>
            )}

            {/* CTA banner */}
            {filtered.length > 0 && (
              <div className="mt-10 relative overflow-hidden rounded-sm bg-brand-charcoal text-white p-6 text-center">
                <div className="absolute top-2 right-4 text-brand-gold/15 text-7xl select-none">✦</div>
                <div className="relative z-10">
                  <p className="font-bold text-lg mb-1">هل أنت مزود خدمات؟</p>
                  <p className="text-white/60 text-sm mb-4">انضم إلى منصة رباط واوصل لآلاف العملاء يومياً</p>
                  <Link href="/register" className="inline-block bg-brand-gold text-white font-bold px-7 py-2.5 rounded-sm hover:bg-brand-gold-dark transition-colors text-sm">
                    سجّل نشاطك مجاناً ←
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
