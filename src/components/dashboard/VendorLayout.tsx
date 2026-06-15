'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const NAV = [
  {
    label: 'نظرة عامة',
    href: '/vendor',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
  },
  {
    label: 'الاستفسارات',
    href: '/vendor/inquiries',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    badge: '٣',
  },
  {
    label: 'معرض الأعمال',
    href: '/vendor/portfolio',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'التقييمات',
    href: '/vendor/reviews',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    label: 'الإحصائيات',
    href: '/vendor/analytics',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: 'الاشتراك',
    href: '/vendor/subscription',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    label: 'الملف الشخصي',
    href: '/vendor/profile',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();
  const [sideOpen, setSideOpen] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex">

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 right-0 z-40 w-64 bg-white border-l border-gray-100 flex flex-col shadow-card
        transform transition-transform duration-300 ease-in-out
        ${sideOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex
      `}>

        {/* Logo + close */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-brand-charcoal text-lg font-bold">رباط</span>
            <span className="text-brand-gold text-xl">✦</span>
          </Link>
          <button onClick={() => setSideOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Business card */}
        <div className="mx-4 mt-5 mb-4">
          <div className="relative overflow-hidden rounded-sm bg-brand-charcoal text-white p-4">
            <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-brand-gold/15" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-sm bg-brand-gold flex items-center justify-center text-white font-bold text-lg mb-3">
                ق
              </div>
              <p className="font-bold text-sm">قصر النور للأفراح</p>
              <p className="text-white/50 text-xs mt-0.5">قاعة أفراح · الرياض</p>
              <div className="mt-3 flex items-center gap-1.5">
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-gradient rounded-full" style={{ width: '75%' }} />
                </div>
                <span className="text-brand-gold text-xs font-bold">75٪</span>
              </div>
              <p className="text-white/40 text-xs mt-1">اكتمال الملف الشخصي</p>
            </div>
          </div>

          {/* Plan badge */}
          <div className="mt-2 flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/20 rounded-sm px-3 py-2">
            <span className="text-brand-gold text-sm">★</span>
            <span className="text-xs font-semibold text-brand-gold-dark">خطة Professional</span>
            <Link href="/vendor/subscription" className="mr-auto text-xs text-brand-gold hover:underline">ترقية</Link>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-4">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSideOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all duration-150 group ${
                  active
                    ? 'bg-brand-gold/10 text-brand-gold-dark border border-brand-gold/20'
                    : 'text-gray-500 hover:text-brand-charcoal hover:bg-gray-50'
                }`}
              >
                <span className={active ? 'text-brand-gold' : 'text-gray-400 group-hover:text-gray-600'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="mr-auto text-[10px] font-bold bg-brand-rose text-white px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-blush flex items-center justify-center text-brand-rose font-bold text-sm">أ</div>
            <div className="flex-1 min-w-0">
              <p className="text-brand-charcoal text-sm font-medium truncate">أحمد العنزي</p>
              <p className="text-gray-400 text-xs truncate">مورد خدمات</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-brand-charcoal hover:bg-gray-50 rounded-sm text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {sideOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSideOpen(false)} />}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSideOpen(true)} className="lg:hidden text-brand-charcoal">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs text-gray-400 bg-green-50 border border-green-200 text-green-600 px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              معتمد ومنشور
            </span>
          </div>

          <div className="flex items-center gap-3 mr-auto lg:mr-0">
            {/* Quick link to public profile */}
            <Link href="/vendors/qasr-alnour" className="hidden sm:flex items-center gap-1.5 text-xs text-brand-gold border border-brand-gold/30 px-3 py-1.5 rounded-sm hover:bg-brand-gold/5 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              عرض صفحتي
            </Link>

            {/* Notifications */}
            <button className="relative w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-brand-charcoal hover:bg-brand-blush transition-colors">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-rose rounded-full" />
            </button>

            <div className="w-9 h-9 rounded-full bg-brand-blush flex items-center justify-center text-brand-rose font-bold text-sm cursor-pointer">أ</div>
          </div>
        </header>

        <main className="flex-1 p-6 pb-24 lg:pb-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
