import { getAdminDashboardData } from '@/lib/actions/admin';
import { AdminTabs } from '@/components/admin/AdminTabs';
import Link from 'next/link';

const NAV = [
  { href: '/admin',          label: 'نظرة عامة',  icon: '⊞' },
  { href: '/admin/vendors',  label: 'الموردون',    icon: '🏢' },
  { href: '/admin/users',    label: 'المستخدمون',  icon: '👥' },
  { href: '/admin/events',   label: 'المناسبات',   icon: '🎪' },
  { href: '/admin/revenue',  label: 'الإيرادات',   icon: '💰' },
  { href: '/admin/reports',  label: 'التقارير',    icon: '📊' },
  { href: '/admin/settings', label: 'الإعدادات',   icon: '⚙️' },
];

export default async function AdminPage() {
  const { recentUsers, pendingVendors, recentEvents, counts } = await getAdminDashboardData();

  const today = new Date().toLocaleDateString('ar-SA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex">

      {/* Sidebar — server-rendered, no toggle on server (client-side toggle handled via CSS) */}
      <aside className="hidden lg:flex w-60 flex-col bg-[#0F172A] fixed inset-y-0 right-0 z-40">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
          <span className="text-white font-bold">رباط</span>
          <span className="text-brand-gold">✦</span>
          <span className="mr-auto text-[10px] font-bold bg-brand-rose text-white px-2 py-0.5 rounded-full">ADMIN</span>
        </div>
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
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-rose flex items-center justify-center text-white text-sm font-bold">م</div>
            <div>
              <p className="text-white text-xs font-medium">مدير النظام</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:mr-60">

        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-brand-charcoal text-base">لوحة الإدارة</h1>
            <p className="text-gray-400 text-xs">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs bg-green-50 border border-green-200 text-green-600 px-3 py-1.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
              النظام يعمل
            </span>
            {counts.pendingVendors > 0 && (
              <span className="text-xs bg-brand-rose text-white px-2.5 py-1 rounded-full font-bold">
                {counts.pendingVendors} طلب معلق
              </span>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto space-y-6 max-w-7xl mx-auto w-full">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '👥', label: 'أحدث المسجلين',       value: recentUsers.length,   accent: 'bg-blue-50'   },
              { icon: '🏢', label: 'موردون معلقون',        value: pendingVendors.length, accent: 'bg-yellow-50' },
              { icon: '🎪', label: 'أحدث المناسبات',       value: recentEvents.length,  accent: 'bg-purple-50' },
              { icon: '✅', label: 'موردون معتمدون',       value: '—',                  accent: 'bg-green-50'  },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-sm p-5 shadow-card border border-gray-100">
                <div className={`w-10 h-10 rounded-sm flex items-center justify-center text-xl mb-3 ${s.accent}`}>
                  {s.icon}
                </div>
                <p className="text-xl font-bold text-brand-charcoal">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs + Recent Users — client component */}
          <AdminTabs
            pendingVendors={pendingVendors as Parameters<typeof AdminTabs>[0]['pendingVendors']}
            recentEvents={recentEvents as Parameters<typeof AdminTabs>[0]['recentEvents']}
            recentUsers={recentUsers as Parameters<typeof AdminTabs>[0]['recentUsers']}
          />

          {/* Quick Actions */}
          <div className="bg-white rounded-sm p-6 shadow-card border border-gray-100">
            <h2 className="font-bold text-brand-charcoal text-base mb-4">إجراءات سريعة</h2>
            <div className="grid sm:grid-cols-3 gap-2">
              {[
                { label: 'مراجعة طلبات الموردين', icon: '🏢', color: 'bg-green-50 text-green-700 hover:bg-green-100',   href: '/admin/vendors'  },
                { label: 'إدارة المستخدمين',       icon: '👥', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100',     href: '/admin/users'    },
                { label: 'إعدادات النظام',          icon: '⚙️', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200',   href: '/admin/settings' },
              ].map(a => (
                <Link
                  key={a.label}
                  href={a.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${a.color}`}
                >
                  <span>{a.icon}</span>
                  <span>{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
