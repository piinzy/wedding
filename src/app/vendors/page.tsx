import { Suspense } from 'react';
import VendorsClient from '@/components/vendors/VendorsClient';
import { getVendors } from '@/lib/actions/vendor';
import Link from 'next/link';

export default async function VendorsPage() {
  // Fetch all approved vendors on the server
  const vendors = await getVendors();

  return (
    <div className="min-h-screen bg-brand-cream" dir="rtl">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-brand-charcoal text-xl font-bold">رباط</span>
            <span className="text-brand-gold text-2xl">✦</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-brand-charcoal hover:text-brand-gold transition-colors font-medium hidden sm:block">دخول</Link>
            <Link href="/register" className="text-sm bg-brand-charcoal text-white px-5 py-2.5 rounded-sm hover:bg-brand-charcoal-light transition-colors font-semibold">ابدأ مجاناً</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-brand-charcoal text-white py-14 px-6 text-center">
        <p className="text-brand-gold text-xs font-semibold tracking-widest uppercase mb-3">دليل الموردين</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">اعثر على أفضل مزودي الخدمات</h1>
        <p className="text-white/55 text-sm max-w-md mx-auto">+٥٠٠ مورد معتمد في المملكة — قاعات، تصوير، ضيافة، ديكور، وأكثر</p>
      </div>

      {/* Client component for filtering + display */}
      <VendorsClient initialVendors={vendors} />
    </div>
  );
}
