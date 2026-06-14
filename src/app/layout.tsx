// /app/layout.tsx - Root layout with RTL support, Tajawal font, and Supabase session provider

import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';
import { SupabaseSessionProvider } from '@/components/providers/SupabaseSessionProvider';

const tajawal = Tajawal({
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  subsets: ['arabic', 'latin'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: 'Wedding AI Planner - مخطط الزفاف الذكي',
  description: 'منصة عربية شاملة لتخطيط الزفاف بمساعدة الذكاء الاصطناعي - Arabic wedding planning platform powered by AI',
  keywords: ['wedding', 'planning', 'Arabic', 'زفاف', 'تخطيط', 'AI', 'الذكاء الاصطناعي'],
  authors: [{ name: 'Wedding AI Planner' }],
  openGraph: {
    title: 'Wedding AI Planner - مخطط الزفاف الذكي',
    description: 'منصة عربية شاملة لتخطيط الزفاف بمساعدة الذكاء الاصطناعي',
    locale: 'ar_AR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} font-sans antialiased`}>
        <SupabaseSessionProvider>
          {children}
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
