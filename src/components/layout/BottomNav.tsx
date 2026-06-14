// /components/layout/BottomNav.tsx - Mobile bottom navigation bar with RTL support

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    href: '/',
    label: 'الرئيسية',
    labelEn: 'Home',
    icon: 'ti-home',
  },
  {
    href: '/dashboard',
    label: 'التخطيط',
    labelEn: 'Plan',
    icon: 'ti-calendar',
  },
  {
    href: '/vendors',
    label: 'الموردين',
    labelEn: 'Vendors',
    icon: 'ti-building-store',
  },
  {
    href: '/dashboard/profile',
    label: 'الملف الشخصي',
    labelEn: 'Profile',
    icon: 'ti-user',
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden safe-area-bottom">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {/* Using CSS classes for icons - assumes Tab Icons font is loaded */}
              <span className={`text-xl ${item.icon}`} aria-hidden="true" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
