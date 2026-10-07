'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error tracking in production
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[50vh] p-6">
      <div className="bg-white rounded-sm shadow-card border border-gray-100 p-8 text-center max-w-sm w-full">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-2xl mx-auto mb-3">⚠️</div>
        <h2 className="font-bold text-brand-charcoal mb-1">تعذّر تحميل البيانات</h2>
        <p className="text-sm text-gray-400 mb-5">
          حدث خطأ أثناء تحميل اللوحة. يُرجى المحاولة مجدداً.
        </p>
        <div className="flex flex-col gap-2">
          <button onClick={reset} className="btn-primary">
            إعادة المحاولة
          </button>
          <Link href="/" className="text-sm text-brand-gold hover:underline">
            الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
