// /app/page.tsx - Home page for Wedding AI Planner

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          مخطط الزفاف الذكي
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
          منصتك الشاملة لتخطيط حفل زفاف أحلامك بمساعدة الذكاء الاصطناعي
        </p>
        
        <div className="flex gap-4 flex-col sm:flex-row">
          <Link
            href="/register"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ابدأ الآن
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            تسجيل الدخول
          </Link>
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      {/* Will be added as a component in the layout */}
    </div>
  );
}
