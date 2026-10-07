'use client';

import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6" dir="rtl">
      <div className="bg-white rounded-sm shadow-card p-10 text-center max-w-md w-full">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-3xl mx-auto mb-4">
          ⚠️
        </div>
        <h1 className="text-xl font-bold text-brand-charcoal mb-2">حدث خطأ غير متوقع</h1>
        <p className="text-gray-500 text-sm mb-6">
          نأسف على هذا الإزعاج. حدث خطأ تقني في الصفحة.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-300 mb-4 font-mono">كود الخطأ: {error.digest}</p>
        )}
        <div className="flex flex-col gap-2">
          <button
            onClick={reset}
            className="btn-primary"
          >
            حاول مجدداً
          </button>
          <Link href="/" className="text-sm text-brand-gold hover:underline">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
