'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const STATS = [
  { icon: '👥', label: 'إجمالي المستخدمين',    value: '٢٬٨٤١',  delta: '+١٢٪',  up: true,  accent: 'bg-blue-50 text-blue-600'     },
  { icon: '🏢', label: 'موردون معتمدون',        value: '٥٣٢',    delta: '+٨٪',   up: true,  accent: 'bg-green-50 text-green-600'   },
  { icon: '🎪', label: 'مناسبات نشطة',          value: '١٬٢٣٤',  delta: '+٢١٪',  up: true,  accent: 'bg-purple-50 text-purple-600' },
  { icon: '💰', label: 'إيرادات الشهر',         value: '٨٤٬٥٠٠ ر.س', delta: '+١٥٪', up: true, accent: 'bg-brand-blush text-brand-rose' },
];

const PENDING_VENDORS = [
  { id: 1, name: 'لمة الأحبة للضيافة',  type: 'ضيافة',    city: 'الرياض', submitted: 'منذ يومين',   docs: true  },
  { id: 2, name: 'ألق للتصوير',          type: 'تصوير',    city: 'جدة',    submitted: 'منذ ٣ أيام',  docs: true  },
  { id: 3, name: 'نخيل للديكور',        type: 'ديكور',    city: 'الدمام', submitted: 'منذ ٥ أيام',  docs: false },
  { id: 4, name: 'دار السعد للأفراح',   type: 'قاعة',     city: 'مكة',    submitted: 'منذ أسبوع',   docs: true  },
];

const RECENT_EVENTS = [
  { id: 1, organizer: 'مريم العتيبي',  type: '💍 زواج',        date: '٢٥ ديسمبر ٢٠٢٥', city: 'الرياض', vendors: 4, status: 'نشط'    },
  { id: 2, organizer: 'سلطان الغامدي', type: '🎂 عيد ميلاد',   date: '١٠ يوليو ٢٠٢٥',  city: 'جدة',    vendors: 2, status: 'نشط'    },
  { id: 3, organizer: 'نورة المطيري',  type: '🎉 مناسبة',       date: '١٥ أغسطس ٢٠٢٥', city: 'الدمام', vendors: 3, status: 'مكتمل'  },
  { id: 4, organizer: 'فهد الدوسري',   type: '🏠 حفلة منزل',   date: '٢٠ يونيو ٢٠٢٥',  city: 'الرياض', vendors: 1, status: 'مكتمل'  },
  { id: 5, organizer: 'ريم الشمري',    type: '💍 زواج',         date: '٥ نوفمبر ٢٠٢٥',  city: 'مكة',    vendors: 5, status: 'نشط'    },
];

const REVENUE_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
const REVENUE_DATA   = [42000, 58000, 51000, 73000, 68000, 84500];
const MAX_REV        = Math.max(...REVENUE_DATA);

const EVENT_BREAKDOWN = [
  { type: 'زواج',       pct: 52, color: 'bg-brand-gold',   emoji: '💍' },
  { type: 'مناسبة',    pct: 22, color: 'bg-purple-400',   emoji: '🎉' },
  { type: 'عيد ميلاد', pct: 16, color: 'bg-brand-rose',   emoji: '🎂' },
  { type: 'حفلة منزل', pct: 10, color: 'bg-blue-400',     emoji: '🏠' },
];

const RECENT_USERS = [
  { name: 'مريم العتيبي',  role: 'منشئ فعالية', joined: 'منذ ساعة',    avatar: 'م', color: 'bg-pink-100 text-pink-600'    },
  { name: 'أحمد العنزي',   role: 'مزود خدمات',  joined: 'منذ ٣ ساعات', avatar: 'أ', color: 'bg-blue-100 text-blue-600'    },
  { name: 'سارة القحطاني', role: 'منشئ فعالية', joined: 'منذ ٥ ساعات', avatar: 'س', color: 'bg-purple-100 text-purple-600' },
  { name: 'خالد الزهراني', role: 'مزود خدمات',  joined: 'أمس',          avatar: 'خ', color: 'bg-green-100 text-green-600'  },
];

/* ══════════════════════════════════════════════
   LAYOUT
══════════════════════════════════════════════ */
function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const NAV = [
    { href: '/admin',              label: 'نظرة عامة',    icon: '⊞' },
    { href: '/admin/vendors',      label: 'الموردون',      icon: '🏢' },
    { href: '/admin/users',        label: 'المستخدمون',    icon: '👥' },
    { href: '/admin/events',       label: 'المناسبات',     icon: '🎪' },
    { href: '/admin/revenue',      label: 'الإيرادات',     icon: '💰' },
    { href: '/admin/reports',      label: 'التقارير',      icon: '📊' },
    { href: '/admin/settings',     label: 'الإعدادات',     icon: '⚙️' },
  ];

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} />}
      <aside className={`
        fixed inset-y-0 right-0 z-40 w-60 flex flex-col
        bg-[#0F172A] transform transition-transform duration-300
        ${open ? 'translate-x-0' : 'translate-x-full'}
        lg:relative lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">رباط</span>
            <span className="text-brand-gold">✦</span>
          </div>
          <span className="text-[10px] font-bold bg-brand-rose text-white px-2 py-0.5 rounded-full">ADMIN</span>
          <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white ml-2">✕</button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-4 space-y-0.5">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all ${
                i === 0
                  ? 'bg-brand-gold/20 text-brand-gold font-semibold'
                  : 'text-white/50 hover:text-white hover:bg-white/8'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Admin user */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-rose flex items-center justify-center text-white text-sm font-bold">م</div>
            <div>
              <p className="text-white text-xs font-medium">مدير النظام</p>
              <p className="text-white/40 text-xs">admin@rabat.sa</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ══════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
export default function AdminPage() {
  const [sideOpen, setSideOpen] = useState(false);
  const [tab,      setTab]      = useState<'pending' | 'events'>('pending');

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex">
      <AdminSidebar open={sideOpen} onClose={() => setSideOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSideOpen(true)} className="lg:hidden text-brand-charcoal">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <div>
              <h1 className="font-bold text-brand-charcoal text-base">لوحة الإدارة</h1>
              <p className="text-gray-400 text-xs">الإثنين، ١٦ يونيو ٢٠٢٦</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs bg-green-50 border border-green-200 text-green-600 px-3 py-1.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
              النظام يعمل
            </span>
            <button className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-brand-charcoal hover:bg-brand-blush transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-rose rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full bg-brand-rose flex items-center justify-center text-white text-sm font-bold">م</div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto space-y-6 max-w-7xl mx-auto w-full">

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="bg-white rounded-sm p-5 shadow-card border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-sm flex items-center justify-center text-xl ${s.accent.split(' ')[0]}`}>
                    {s.icon}
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                    {s.delta}
                  </span>
                </div>
                <p className="text-xl font-bold text-brand-charcoal">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* ── Revenue Chart + Breakdown ── */}
          <div className="grid lg:grid-cols-3 gap-5">

            {/* Chart — 2 cols */}
            <div className="lg:col-span-2 bg-white rounded-sm p-6 shadow-card border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-brand-charcoal text-base">الإيرادات الشهرية</h2>
                  <p className="text-xs text-gray-400 mt-0.5">آخر ٦ أشهر</p>
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold text-brand-charcoal">٨٤٬٥٠٠ ر.س</p>
                  <p className="text-xs text-green-600 font-medium">+١٥٪ عن الشهر الماضي</p>
                </div>
              </div>

              {/* Bar chart */}
              <div className="flex items-end gap-3 h-44 mb-3">
                {REVENUE_MONTHS.map((m, i) => {
                  const h    = Math.round((REVENUE_DATA[i] / MAX_REV) * 100);
                  const last = i === REVENUE_MONTHS.length - 1;
                  return (
                    <div key={m} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="relative w-full flex items-end justify-center" style={{ height: '160px' }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-brand-charcoal text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {REVENUE_DATA[i].toLocaleString('ar-SA')} ر.س
                        </div>
                        <div
                          className={`w-full rounded-t-sm transition-all duration-700 ${last ? 'bg-brand-gold' : 'bg-gray-200 group-hover:bg-brand-gold/60'}`}
                          style={{ height: `${h}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{m}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Event breakdown — 1 col */}
            <div className="bg-white rounded-sm p-6 shadow-card border border-gray-100">
              <h2 className="font-bold text-brand-charcoal text-base mb-5">توزيع المناسبات</h2>
              <div className="space-y-4">
                {EVENT_BREAKDOWN.map(e => (
                  <div key={e.type}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span>{e.emoji}</span>
                        <span className="text-sm text-gray-600">{e.type}</span>
                      </div>
                      <span className="text-sm font-bold text-brand-charcoal">{e.pct}٪</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${e.color}`} style={{ width: `${e.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-2 gap-3">
                <div className="text-center bg-gray-50 rounded-sm py-3">
                  <p className="text-lg font-bold text-brand-charcoal">٥٣٢</p>
                  <p className="text-xs text-gray-400">موردون</p>
                </div>
                <div className="text-center bg-gray-50 rounded-sm py-3">
                  <p className="text-lg font-bold text-brand-charcoal">١٬٢٣٤</p>
                  <p className="text-xs text-gray-400">مناسبة نشطة</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tabs: Pending Vendors + Recent Events ── */}
          <div className="bg-white rounded-sm shadow-card border border-gray-100">
            <div className="flex border-b border-gray-100">
              {[
                { key: 'pending', label: 'موردون ينتظرون الموافقة', count: PENDING_VENDORS.length },
                { key: 'events',  label: 'أحدث المناسبات',          count: RECENT_EVENTS.length  },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key as typeof tab)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    tab === t.key
                      ? 'border-brand-gold text-brand-charcoal'
                      : 'border-transparent text-gray-400 hover:text-brand-charcoal'
                  }`}
                >
                  {t.label}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    tab === t.key ? 'bg-brand-gold text-white' : 'bg-gray-100 text-gray-500'
                  }`}>{t.count}</span>
                </button>
              ))}
            </div>

            {/* Pending vendors */}
            {tab === 'pending' && (
              <div className="divide-y divide-gray-50">
                {PENDING_VENDORS.map(v => (
                  <div key={v.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-sm bg-brand-blush flex items-center justify-center text-brand-rose font-bold">
                      {v.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-brand-charcoal text-sm">{v.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-400">{v.type}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{v.city}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{v.submitted}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        v.docs ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                      }`}>
                        {v.docs ? '✓ الوثائق مكتملة' : '⚠ وثائق ناقصة'}
                      </span>
                      <button className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-sm hover:bg-green-700 transition-colors font-medium">
                        قبول
                      </button>
                      <button className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-sm hover:bg-red-50 transition-colors font-medium">
                        رفض
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent events */}
            {tab === 'events' && (
              <div className="divide-y divide-gray-50">
                {RECENT_EVENTS.map(e => (
                  <div key={e.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-sm bg-brand-cream flex items-center justify-center text-xl flex-shrink-0">
                      {e.type.split(' ')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-brand-charcoal text-sm">{e.organizer}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-brand-gold">{e.type}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{e.date}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{e.city}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">{e.vendors} موردين</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        e.status === 'نشط'
                          ? 'bg-green-50 text-green-600 border border-green-200'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {e.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Recent Users + Quick Actions ── */}
          <div className="grid lg:grid-cols-3 gap-5">

            {/* Recent users */}
            <div className="lg:col-span-2 bg-white rounded-sm p-6 shadow-card border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-brand-charcoal text-base">أحدث المسجلين</h2>
                <Link href="/admin/users" className="text-xs text-brand-gold hover:underline">عرض الكل ←</Link>
              </div>
              <div className="space-y-3">
                {RECENT_USERS.map(u => (
                  <div key={u.name} className="flex items-center gap-3 p-3 rounded-sm hover:bg-gray-50 transition-colors">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${u.color}`}>
                      {u.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-brand-charcoal text-sm">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.role}</p>
                    </div>
                    <p className="text-xs text-gray-400 flex-shrink-0">{u.joined}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-sm p-6 shadow-card border border-gray-100">
              <h2 className="font-bold text-brand-charcoal text-base mb-4">إجراءات سريعة</h2>
              <div className="space-y-2">
                {[
                  { label: 'مراجعة طلبات الموردين',  icon: '🏢', color: 'bg-green-50 text-green-700 hover:bg-green-100', count: '٤'  },
                  { label: 'تقرير الإيرادات',          icon: '📊', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100'   },
                  { label: 'إدارة الاشتراكات',        icon: '★',  color: 'bg-brand-blush text-brand-rose hover:bg-brand-blush'  },
                  { label: 'إعدادات النظام',           icon: '⚙️', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200'  },
                  { label: 'إرسال إشعار جماعي',      icon: '🔔', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
                ].map(a => (
                  <button key={a.label} className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${a.color}`}>
                    <span>{a.icon}</span>
                    <span>{a.label}</span>
                    {a.count && (
                      <span className="mr-auto text-xs bg-brand-rose text-white px-1.5 py-0.5 rounded-full font-bold">{a.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
