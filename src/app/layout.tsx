import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';
import { SupabaseSessionProvider } from '@/components/providers/SupabaseSessionProvider';
import { BottomNav, BottomNavConditional } from '@/components/layout/BottomNav';

const tajawal = Tajawal({
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  subsets: ['arabic', 'latin'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: { default: 'رباط — منصة المناسبات العربية', template: '%s | رباط' },
  description: 'خطط لمناسبتك المثالية مع أفضل موردي الخدمات في المملكة — زفاف، مناسبات، أعياد ميلاد وأكثر',
  keywords: ['مناسبات', 'زفاف', 'تخطيط', 'موردون', 'السعودية', 'رباط'],
  openGraph: {
    title: 'رباط — منصة المناسبات العربية',
    description: 'خطط لمناسبتك المثالية مع أفضل موردي الخدمات في المملكة',
    locale: 'ar_AR',
    type: 'website',
  },
};

// Pages that should NOT show the mobile bottom nav
const NO_NAV_PATHS = ['/login', '/register', '/admin', '/forgot-password'];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} font-sans antialiased`}>
        <SupabaseSessionProvider>
          {children}
          <BottomNavWrapper />
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}

function BottomNavWrapper() {
  return <BottomNavConditional exclude={['/login', '/register', '/admin', '/forgot-password']} />;
}
