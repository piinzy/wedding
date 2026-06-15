'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import Link from 'next/link';

/* ── Mock data (replace with Supabase queries) ── */
const WEDDING_DATE = new Date('2025-12-25');
const TOTAL_BUDGET = 120000;
const SPENT_BUDGET = 54500;

const TASKS = [
  { id: 1, text: 'حجز قاعة الأفراح',        done: true,  dueDate: 'مكتمل',        category: 'قاعة' },
  { id: 2, text: 'اختيار المصور الفوتوغرافي', done: true,  dueDate: 'مكتمل',        category: 'تصوير' },
  { id: 3, text: 'تصميم دعوات الزفاف',       done: false, dueDate: 'خلال أسبوعين', category: 'دعوات' },
  { id: 4, text: 'اختيار فستان الزفاف',      done: false, dueDate: 'الشهر القادم',  category: 'أزياء' },
  { id: 5, text: 'تحديد قائمة الطعام',       done: false, dueDate: '٣ أشهر',        category: 'ضيافة' },
  { id: 6, text: 'حجز فريق الموسيقى',       done: false, dueDate: '٣ أشهر',        category: 'ترفيه' },
];

const VENDORS = [
  { id: 1, name: 'قصر النور',           type: 'قاعة',     status: 'محجوز',   rating: 4.9, image: '🏛️',  price: 35000 },
  { id: 2, name: 'استوديو لحظات',      type: 'تصوير',    status: 'محجوز',   rating: 4.8, image: '📸',  price: 12000 },
  { id: 3, name: 'ورد وفل للديكور',   type: 'ديكور',    status: 'قيد النقاش', rating: 4.7, image: '💐', price: 8000  },
];

const BUDGET_ITEMS = [
  { label: 'القاعة',    spent: 35000, color: 'bg-brand-gold' },
  { label: 'التصوير',  spent: 12000, color: 'bg-brand-rose' },
  { label: 'الديكور',  spent: 4500,  color: 'bg-purple-400' },
  { label: 'أخرى',     spent: 3000,  color: 'bg-gray-300' },
];

/* ── Helpers ── */
function daysUntil(date: Date) {
  return Math.ceil((date.getTime() - Date.now()) / 86400000);
}

function formatSAR(n: number) {
  return n.toLocaleString('ar-SA') + ' ر.س';
}

/* ── Stat Card ── */
function StatCard({ icon, label, value, sub, accent }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; accent?: string;
}) {
  return (
    <div className="bg-white rounded-sm p-5 shadow-card border border-gray-100 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-sm flex items-center justify-center text-xl flex-shrink-0 ${accent ?? 'bg-brand-blush'}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
        <p className="text-xl font-bold text-brand-charcoal leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ title, action, href }: { title: string; action?: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-bold text-brand-charcoal">{title}</h2>
      {action && href && (
        <Link href={href} className="text-xs text-brand-gold hover:underline font-medium">
          {action} ←
        </Link>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════ */
export default function DashboardPage() {
  const days        = daysUntil(WEDDING_DATE);
  const doneTasks   = TASKS.filter(t => t.done).length;
  const pct         = Math.round((SPENT_BUDGET / TOTAL_BUDGET) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto animate-fade-up">

        {/* ── Hero Countdown Banner ── */}
        <div className="relative overflow-hidden rounded-sm bg-brand-charcoal text-white px-8 py-7">
          {/* decorative circles */}
          <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-brand-gold/10" />
          <div className="absolute -bottom-12 -left-4 w-36 h-36 rounded-full bg-brand-gold/8" />
          <div className="absolute top-4 left-4 text-brand-gold/20 text-8xl select-none">✦</div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-white/60 text-xs font-medium tracking-widest uppercase mb-2">يوم زفافك</p>
              <h2 className="text-2xl font-bold mb-1">أهلاً، مريم ✨</h2>
              <p className="text-white/70 text-sm">
                تبقّى على يوم زفافك الجمعة، ٢٥ ديسمبر ٢٠٢٥
              </p>
            </div>

            {/* Countdown */}
            <div className="flex gap-3 flex-shrink-0">
              {[
                { n: Math.floor(days / 30), label: 'شهر' },
                { n: days % 30, label: 'يوم' },
              ].map(({ n, label }) => (
                <div key={label} className="text-center bg-white/10 border border-white/15 rounded-sm px-5 py-3 min-w-[72px]">
                  <p className="text-3xl font-bold text-brand-gold">{n}</p>
                  <p className="text-white/60 text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="relative z-10 mt-5">
            <div className="flex justify-between text-xs text-white/50 mb-1.5">
              <span>تقدم التخطيط</span>
              <span>{Math.round((doneTasks / TASKS.length) * 100)}٪</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-gradient rounded-full transition-all duration-700"
                style={{ width: `${(doneTasks / TASKS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="📅" label="أيام متبقية"  value={`${days} يوم`}              sub="حتى يوم زفافك" />
          <StatCard icon="✅" label="المهام المنجزة" value={`${doneTasks}/${TASKS.length}`} sub={`${TASKS.length - doneTasks} مهمة متبقية`} accent="bg-green-50" />
          <StatCard icon="💰" label="الميزانية المتبقية" value={formatSAR(TOTAL_BUDGET - SPENT_BUDGET)} sub={`من ${formatSAR(TOTAL_BUDGET)}`} accent="bg-yellow-50" />
          <StatCard icon="🏢" label="الموردون"     value={`${VENDORS.filter(v => v.status === 'محجوز').length} محجوز`} sub={`من ${VENDORS.length} موردين`} accent="bg-purple-50" />
        </div>

        {/* ── Middle Grid: Tasks + Budget ── */}
        <div className="grid lg:grid-cols-5 gap-5">

          {/* Tasks — 3 cols */}
          <div className="lg:col-span-3 bg-white rounded-sm p-6 shadow-card border border-gray-100">
            <SectionHeader title="قائمة المهام" action="عرض الكل" href="/dashboard/tasks" />
            <div className="space-y-2.5">
              {TASKS.map((task) => (
                <div key={task.id} className={`flex items-center gap-3 p-3 rounded-sm border transition-colors ${
                  task.done ? 'border-green-100 bg-green-50/40' : 'border-gray-100 hover:bg-gray-50'
                }`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    task.done ? 'border-green-400 bg-green-400' : 'border-gray-300'
                  }`}>
                    {task.done && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                      </svg>
                    )}
                  </div>
                  <span className={`flex-1 text-sm ${task.done ? 'line-through text-gray-400' : 'text-brand-charcoal'}`}>
                    {task.text}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{task.category}</span>
                    {!task.done && (
                      <span className="text-xs text-brand-gold-dark">{task.dueDate}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full border-2 border-dashed border-gray-200 text-gray-400 hover:border-brand-gold hover:text-brand-gold text-sm py-2.5 rounded-sm transition-colors">
              + إضافة مهمة جديدة
            </button>
          </div>

          {/* Budget — 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-sm p-6 shadow-card border border-gray-100">
            <SectionHeader title="الميزانية" action="تفاصيل" href="/dashboard/budget" />

            {/* Donut-style ring */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#F0EDE8" strokeWidth="3.5" />
                  <circle
                    cx="18" cy="18" r="15.9155" fill="none"
                    stroke="url(#goldGrad)" strokeWidth="3.5"
                    strokeDasharray={`${pct} ${100 - pct}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#C9A96E" />
                      <stop offset="100%" stopColor="#E8D5B0" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xl font-bold text-brand-charcoal">{pct}٪</p>
                  <p className="text-xs text-gray-400">مُنفَق</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between text-sm mb-4 pb-4 border-b border-gray-100">
              <div className="text-center">
                <p className="font-bold text-brand-charcoal">{formatSAR(SPENT_BUDGET)}</p>
                <p className="text-xs text-gray-400 mt-0.5">مُنفَق</p>
              </div>
              <div className="h-8 w-px bg-gray-100 self-center" />
              <div className="text-center">
                <p className="font-bold text-green-600">{formatSAR(TOTAL_BUDGET - SPENT_BUDGET)}</p>
                <p className="text-xs text-gray-400 mt-0.5">متبقي</p>
              </div>
            </div>

            {/* Items breakdown */}
            <div className="space-y-3">
              {BUDGET_ITEMS.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.color}`} />
                  <span className="text-sm text-gray-600 flex-1">{item.label}</span>
                  <span className="text-sm font-semibold text-brand-charcoal">{formatSAR(item.spent)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Vendors ── */}
        <div className="bg-white rounded-sm p-6 shadow-card border border-gray-100">
          <SectionHeader title="موردوني" action="استعرض الكل" href="/vendors" />
          <div className="grid sm:grid-cols-3 gap-4">
            {VENDORS.map((v) => (
              <div key={v.id} className="border border-gray-100 rounded-sm p-4 hover:shadow-card transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-sm bg-brand-cream flex items-center justify-center text-2xl">
                    {v.image}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    v.status === 'محجوز'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {v.status}
                  </span>
                </div>
                <p className="font-bold text-brand-charcoal text-sm">{v.name}</p>
                <p className="text-gray-400 text-xs mt-0.5 mb-2">{v.type}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="text-brand-gold">★</span>
                    <span>{v.rating}</span>
                  </div>
                  <span className="text-xs font-semibold text-brand-charcoal">{formatSAR(v.price)}</span>
                </div>
              </div>
            ))}

            {/* Add vendor CTA */}
            <Link
              href="/vendors"
              className="border-2 border-dashed border-gray-200 rounded-sm p-4 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-brand-gold hover:text-brand-gold transition-colors min-h-[120px] group"
            >
              <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-lg group-hover:border-brand-gold transition-colors">+</span>
              <span className="text-xs font-medium">إضافة مورد</span>
            </Link>
          </div>
        </div>

        {/* ── AI Assistant CTA ── */}
        <div className="relative overflow-hidden rounded-sm bg-gradient-to-l from-purple-600 to-indigo-700 text-white p-7">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-xs font-medium mb-3">
                <span>✨</span> مدعوم بالذكاء الاصطناعي
              </div>
              <h3 className="text-xl font-bold mb-1">مساعدك الذكي لتخطيط الزفاف</h3>
              <p className="text-white/70 text-sm max-w-md">
                احصلي على توصيات مخصصة، خطط تفصيلية، وأفكار إبداعية لزفافك في ثوانٍ
              </p>
            </div>
            <Link
              href="/dashboard/ai"
              className="flex-shrink-0 bg-white text-indigo-700 font-bold px-7 py-3 rounded-sm text-sm hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              ابدأي الآن ←
            </Link>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
