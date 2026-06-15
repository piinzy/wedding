'use client';

import { VendorLayout } from '@/components/dashboard/VendorLayout';
import Link from 'next/link';

/* ── Mock data ── */
const STATS = [
  { icon: '👁️', label: 'مشاهدات هذا الشهر', value: '١٬٢٤٣',   delta: '+١٨٪',   up: true,  accent: 'bg-blue-50' },
  { icon: '💬', label: 'استفسارات جديدة',     value: '٣',        delta: '+٢',      up: true,  accent: 'bg-yellow-50' },
  { icon: '⭐', label: 'متوسط التقييم',       value: '٤.٩',      delta: '+٠.١',    up: true,  accent: 'bg-brand-blush' },
  { icon: '💰', label: 'إيرادات مقدّرة',      value: '٤٨٬٠٠٠ ر.س', delta: 'هذا الشهر', up: true, accent: 'bg-green-50' },
];

const INQUIRIES = [
  {
    id: 1,
    name: 'مريم العتيبي',
    avatar: 'م',
    date: 'الزفاف: ٢٥ ديسمبر ٢٠٢٥',
    msg: 'أودّ الاستفسار عن توفر القاعة في هذا التاريخ والأسعار المتاحة...',
    time: 'منذ ٢٠ دقيقة',
    status: 'جديد',
  },
  {
    id: 2,
    name: 'سارة المطيري',
    avatar: 'س',
    date: 'الزفاف: ١٠ يناير ٢٠٢٦',
    msg: 'هل تتوفر باقة شاملة للديكور والضيافة معاً؟',
    time: 'منذ ساعتين',
    status: 'جديد',
  },
  {
    id: 3,
    name: 'نورة الدوسري',
    avatar: 'ن',
    date: 'الزفاف: ٥ مارس ٢٠٢٦',
    msg: 'شكراً على الرد السريع، هل يمكن تحديد موعد زيارة للقاعة؟',
    time: 'أمس',
    status: 'قيد الرد',
  },
];

const REVIEWS = [
  { id: 1, name: 'منى الشمري',   rating: 5, comment: 'قاعة رائعة وخدمة ممتازة، الطاقم محترف جداً وكل شيء كان مثالياً.', date: 'منذ أسبوع' },
  { id: 2, name: 'لجين العمري', rating: 5, comment: 'تجربة لا تُنسى، القاعة فاخرة والديكور خيالي. أنصح به بشدة.', date: 'منذ أسبوعين' },
  { id: 3, name: 'هند القحطاني', rating: 4, comment: 'ممتاز بشكل عام، فقط الموقف كان يحتاج لتنظيم أفضل.', date: 'منذ شهر' },
];

const CHART_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
const CHART_VIEWS  = [320, 480, 390, 650, 820, 1243];
const MAX_VAL      = Math.max(...CHART_VIEWS);

const PORTFOLIO = [
  { id: 1, label: 'القاعة الرئيسية', emoji: '🏛️', cover: true },
  { id: 2, label: 'حديقة الاستقبال', emoji: '🌿', cover: false },
  { id: 3, label: 'الديكور الداخلي', emoji: '✨', cover: false },
  { id: 4, label: 'إضاءة مسرح',      emoji: '💡', cover: false },
];

/* ── Helpers ── */
function StatCard({ icon, label, value, delta, up, accent }: {
  icon: string; label: string; value: string; delta: string; up: boolean; accent: string;
}) {
  return (
    <div className="bg-white rounded-sm p-5 shadow-card border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-sm flex items-center justify-center text-xl ${accent}`}>{icon}</div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${up ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
          {delta}
        </span>
      </div>
      <p className="text-2xl font-bold text-brand-charcoal">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function SectionHeader({ title, action, href }: { title: string; action?: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-bold text-brand-charcoal">{title}</h2>
      {action && href && (
        <Link href={href} className="text-xs text-brand-gold hover:underline font-medium">{action} ←</Link>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════ */
export default function VendorDashboardPage() {
  return (
    <VendorLayout>
      <div className="space-y-6 max-w-6xl mx-auto animate-fade-up">

        {/* ── Welcome Banner ── */}
        <div className="relative overflow-hidden rounded-sm bg-brand-charcoal text-white px-8 py-6">
          <div className="absolute -top-8 -left-8 w-44 h-44 rounded-full bg-brand-gold/10" />
          <div className="absolute -bottom-10 left-20 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute top-3 left-3 text-brand-gold/20 text-7xl select-none">✦</div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-white/50 text-xs tracking-widest uppercase mb-2">لوحة المورد</p>
              <h2 className="text-xl font-bold mb-1">أهلاً، أحمد 👋</h2>
              <p className="text-white/60 text-sm">لديك <span className="text-brand-gold font-bold">٣ استفسارات</span> جديدة تنتظر ردك</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link href="/vendor/inquiries" className="bg-brand-gold text-white text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-brand-gold-dark transition-colors">
                عرض الاستفسارات
              </Link>
              <Link href="/vendor/profile" className="border border-white/20 text-white/80 text-sm px-4 py-2.5 rounded-sm hover:bg-white/10 transition-colors">
                تعديل الملف
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* ── Middle: Chart + Inquiries ── */}
        <div className="grid lg:grid-cols-5 gap-5">

          {/* Views Chart — 3 cols */}
          <div className="lg:col-span-3 bg-white rounded-sm p-6 shadow-card border border-gray-100">
            <SectionHeader title="المشاهدات — آخر ٦ أشهر" action="تقرير كامل" href="/vendor/analytics" />

            {/* Bar chart */}
            <div className="flex items-end gap-2 h-40 mb-3">
              {CHART_MONTHS.map((m, i) => {
                const h = Math.round((CHART_VIEWS[i] / MAX_VAL) * 100);
                const isLast = i === CHART_MONTHS.length - 1;
                return (
                  <div key={m} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
                    <div className="relative w-full flex items-end justify-center" style={{ height: '148px' }}>
                      {/* Tooltip */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-brand-charcoal text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {CHART_VIEWS[i].toLocaleString('ar-SA')}
                      </div>
                      <div
                        className={`w-full rounded-t-sm transition-all duration-500 ${isLast ? 'bg-brand-gold' : 'bg-gray-200 group-hover:bg-brand-gold-light'}`}
                        style={{ height: `${h}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{m}</span>
                  </div>
                );
              })}
            </div>

            {/* Summary row */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-400">إجمالي المشاهدات</p>
                <p className="font-bold text-brand-charcoal">٣٬٩٠٣</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">معدل التحويل</p>
                <p className="font-bold text-green-600">٢.٤٪</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">أعلى شهر</p>
                <p className="font-bold text-brand-charcoal">يونيو</p>
              </div>
            </div>
          </div>

          {/* Inquiries — 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-sm p-6 shadow-card border border-gray-100">
            <SectionHeader title="أحدث الاستفسارات" action="الكل" href="/vendor/inquiries" />
            <div className="space-y-3">
              {INQUIRIES.map(inq => (
                <div key={inq.id} className="flex gap-3 p-3 rounded-sm border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="w-9 h-9 rounded-full bg-brand-blush flex items-center justify-center text-brand-rose font-bold text-sm flex-shrink-0">
                    {inq.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-0.5">
                      <p className="font-semibold text-brand-charcoal text-sm truncate">{inq.name}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                        inq.status === 'جديد' ? 'bg-brand-gold/15 text-brand-gold-dark' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-xs text-brand-gold mb-1">{inq.date}</p>
                    <p className="text-xs text-gray-400 truncate">{inq.msg}</p>
                    <p className="text-xs text-gray-300 mt-1">{inq.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/vendor/inquiries" className="mt-4 block text-center text-sm text-brand-gold hover:underline font-medium py-2">
              عرض جميع الاستفسارات ←
            </Link>
          </div>
        </div>

        {/* ── Bottom: Portfolio + Reviews ── */}
        <div className="grid lg:grid-cols-2 gap-5">

          {/* Portfolio */}
          <div className="bg-white rounded-sm p-6 shadow-card border border-gray-100">
            <SectionHeader title="معرض الأعمال" action="إدارة الصور" href="/vendor/portfolio" />
            <div className="grid grid-cols-2 gap-3">
              {PORTFOLIO.map(p => (
                <div key={p.id} className={`relative group rounded-sm overflow-hidden border-2 transition-all cursor-pointer ${
                  p.cover ? 'border-brand-gold' : 'border-gray-100 hover:border-brand-gold-light'
                }`}>
                  <div className="bg-brand-cream h-28 flex items-center justify-center">
                    <span className="text-5xl opacity-60 group-hover:scale-110 transition-transform duration-200">{p.emoji}</span>
                  </div>
                  <div className="px-3 py-2 border-t border-gray-100">
                    <p className="text-xs font-medium text-brand-charcoal truncate">{p.label}</p>
                    {p.cover && <span className="text-[10px] text-brand-gold font-bold">صورة الغلاف</span>}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 w-full border-2 border-dashed border-gray-200 text-gray-400 hover:border-brand-gold hover:text-brand-gold text-sm py-2.5 rounded-sm transition-colors">
              + رفع صور جديدة
            </button>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-sm p-6 shadow-card border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-brand-charcoal">التقييمات</h2>
              <div className="flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/20 rounded-sm px-3 py-1.5">
                <span className="text-brand-gold text-sm font-bold">★</span>
                <span className="text-brand-gold-dark font-bold text-sm">٤.٩</span>
                <span className="text-gray-400 text-xs">/ ٥</span>
              </div>
            </div>

            {/* Rating bars */}
            <div className="space-y-2 mb-5 pb-5 border-b border-gray-100">
              {[5, 4, 3, 2, 1].map(star => {
                const pct = star === 5 ? 80 : star === 4 ? 15 : star === 3 ? 5 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-3">{star}</span>
                    <span className="text-brand-gold text-xs">★</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-gold rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-8">{pct}٪</span>
                  </div>
                );
              })}
            </div>

            {/* Reviews list */}
            <div className="space-y-4 max-h-52 overflow-y-auto">
              {REVIEWS.map(r => (
                <div key={r.id} className="pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-1.5">
                    <p className="font-semibold text-brand-charcoal text-sm">{r.name}</p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xs ${i < r.rating ? 'text-brand-gold' : 'text-gray-200'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{r.comment}</p>
                  <p className="text-xs text-gray-300 mt-1.5">{r.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Subscription Upgrade CTA ── */}
        <div className="relative overflow-hidden rounded-sm border border-brand-gold/30 bg-gradient-to-l from-brand-gold/5 to-brand-cream p-6">
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-2 left-4 text-8xl text-brand-gold select-none">✦</div>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-brand-gold font-bold text-lg">★</span>
                <span className="font-bold text-brand-charcoal">ترقية إلى Premium</span>
              </div>
              <p className="text-sm text-gray-500 max-w-sm">
                احصل على ظهور مميز في نتائج البحث، شارة "موصى به"، وتقارير تحليلية متقدمة
              </p>
            </div>
            <Link
              href="/vendor/subscription"
              className="flex-shrink-0 bg-brand-charcoal text-white font-bold px-7 py-3 rounded-sm text-sm hover:bg-brand-charcoal-light transition-colors whitespace-nowrap"
            >
              اكتشف المزايا ←
            </Link>
          </div>

          {/* Features */}
          <div className="relative z-10 mt-5 flex flex-wrap gap-4">
            {['ظهور في Top ٣', 'شارة موصى به', 'تقارير تفصيلية', 'دعم أولوية'].map(f => (
              <div key={f} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="text-brand-gold">✦</span>
                {f}
              </div>
            ))}
          </div>
        </div>

      </div>
    </VendorLayout>
  );
}
