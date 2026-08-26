import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { getOrganizerDashboardData } from '@/lib/actions/organizer';
import Link from 'next/link';

function daysUntil(dateStr: string | null) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function formatSAR(n: number) {
  return n.toLocaleString('ar-SA') + ' ر.س';
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: 'حفل زواج',
  home_party: 'حفلة منزلية',
  occasion: 'مناسبة',
  birthday: 'عيد ميلاد',
};

const EVENT_TYPE_ICONS: Record<string, string> = {
  wedding: '💍',
  home_party: '🏠',
  occasion: '🎉',
  birthday: '🎂',
};

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

export default async function DashboardPage() {
  const { user, profile, tasks, budgetItems } = await getOrganizerDashboardData();

  const eventType = profile?.event_type ?? 'wedding';
  const eventIcon = EVENT_TYPE_ICONS[eventType] ?? '🎉';
  const eventLabel = EVENT_TYPE_LABELS[eventType] ?? 'مناسبة';

  const days = daysUntil(profile?.event_date ?? null);
  const doneTasks = tasks.filter((t) => t.is_completed).length;
  const totalBudget = profile?.total_budget ?? 0;
  const spentBudget = budgetItems.reduce((sum, b) => sum + (b.actual_amount ?? 0), 0);
  const pct = totalBudget > 0 ? Math.round((spentBudget / totalBudget) * 100) : 0;

  const displayName = user?.user_metadata?.full_name ?? 'مرحباً';

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto animate-fade-up">

        {/* ── Hero Countdown Banner ── */}
        <div className="relative overflow-hidden rounded-sm bg-brand-charcoal text-white px-8 py-7">
          <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-brand-gold/10" />
          <div className="absolute -bottom-12 -left-4 w-36 h-36 rounded-full bg-brand-gold/8" />
          <div className="absolute top-4 left-4 text-brand-gold/20 text-8xl select-none">✦</div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{eventIcon}</span>
                <span className="text-white/60 text-xs font-medium tracking-widest uppercase">{eventLabel}</span>
              </div>
              <h2 className="text-2xl font-bold mb-1">أهلاً، {displayName} ✨</h2>
              <p className="text-white/70 text-sm">
                {profile?.event_date
                  ? `تبقّى على موعد مناسبتك ${new Date(profile.event_date).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
                  : 'أضف تاريخ مناسبتك لمتابعة العدّ التنازلي'}
              </p>
            </div>

            {days !== null && days > 0 && (
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
            )}
          </div>

          {tasks.length > 0 && (
            <div className="relative z-10 mt-5">
              <div className="flex justify-between text-xs text-white/50 mb-1.5">
                <span>تقدم التخطيط</span>
                <span>{Math.round((doneTasks / tasks.length) * 100)}٪</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-gradient rounded-full transition-all duration-700"
                  style={{ width: `${(doneTasks / tasks.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon="📅"
            label="أيام متبقية"
            value={days !== null && days > 0 ? `${days} يوم` : '—'}
            sub={profile?.event_date ? 'حتى موعد مناسبتك' : 'لم يُحدَّد بعد'}
          />
          <StatCard
            icon="✅"
            label="المهام المنجزة"
            value={`${doneTasks}/${tasks.length}`}
            sub={`${tasks.length - doneTasks} مهمة متبقية`}
            accent="bg-green-50"
          />
          <StatCard
            icon="💰"
            label="الميزانية المتبقية"
            value={totalBudget > 0 ? formatSAR(totalBudget - spentBudget) : '—'}
            sub={totalBudget > 0 ? `من ${formatSAR(totalBudget)}` : 'لم تُحدَّد بعد'}
            accent="bg-yellow-50"
          />
          <StatCard
            icon="📍"
            label="المدينة"
            value={profile?.city ?? '—'}
            sub={`${profile?.guest_count ?? '—'} ضيف`}
            accent="bg-purple-50"
          />
        </div>

        {/* ── Middle Grid: Tasks + Budget ── */}
        <div className="grid lg:grid-cols-5 gap-5">

          {/* Tasks */}
          <div className="lg:col-span-3 bg-white rounded-sm p-6 shadow-card border border-gray-100">
            <SectionHeader title="قائمة المهام" action="عرض الكل" href="/dashboard/tasks" />
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-3xl mb-2">📋</p>
                <p className="text-sm">لا توجد مهام بعد</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {tasks.slice(0, 6).map((task) => (
                  <div key={task.id} className={`flex items-center gap-3 p-3 rounded-sm border transition-colors ${
                    task.is_completed ? 'border-green-100 bg-green-50/40' : 'border-gray-100 hover:bg-gray-50'
                  }`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      task.is_completed ? 'border-green-400 bg-green-400' : 'border-gray-300'
                    }`}>
                      {task.is_completed && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                    </div>
                    <span className={`flex-1 text-sm ${task.is_completed ? 'line-through text-gray-400' : 'text-brand-charcoal'}`}>
                      {task.title}
                    </span>
                    {task.category && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{task.category}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/dashboard/tasks"
              className="mt-4 block w-full border-2 border-dashed border-gray-200 text-gray-400 hover:border-brand-gold hover:text-brand-gold text-sm py-2.5 rounded-sm transition-colors text-center"
            >
              + إضافة مهمة جديدة
            </Link>
          </div>

          {/* Budget */}
          <div className="lg:col-span-2 bg-white rounded-sm p-6 shadow-card border border-gray-100">
            <SectionHeader title="الميزانية" action="تفاصيل" href="/dashboard/budget" />

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

            {totalBudget > 0 ? (
              <>
                <div className="flex justify-between text-sm mb-4 pb-4 border-b border-gray-100">
                  <div className="text-center">
                    <p className="font-bold text-brand-charcoal">{formatSAR(spentBudget)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">مُنفَق</p>
                  </div>
                  <div className="h-8 w-px bg-gray-100 self-center" />
                  <div className="text-center">
                    <p className="font-bold text-green-600">{formatSAR(totalBudget - spentBudget)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">متبقي</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {budgetItems.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-gold flex-shrink-0" />
                      <span className="text-sm text-gray-600 flex-1">{item.category}</span>
                      <span className="text-sm font-semibold text-brand-charcoal">
                        {formatSAR(item.actual_amount ?? item.estimated_amount ?? 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-gray-400">
                <p className="text-sm">لم تُحدَّد الميزانية بعد</p>
                <Link href="/dashboard/budget" className="text-xs text-brand-gold hover:underline mt-1 block">
                  أضف ميزانيتك ←
                </Link>
              </div>
            )}
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
              <h3 className="text-xl font-bold mb-1">مساعدك الذكي لتخطيط مناسبتك</h3>
              <p className="text-white/70 text-sm max-w-md">
                احصل على توصيات مخصصة، خطط تفصيلية، وأفكار إبداعية في ثوانٍ
              </p>
            </div>
            <Link
              href="/dashboard/ai"
              className="flex-shrink-0 bg-white text-indigo-700 font-bold px-7 py-3 rounded-sm text-sm hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              ابدأ الآن ←
            </Link>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
