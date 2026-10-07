import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6" dir="rtl">
      <div className="text-center max-w-md">
        <p className="text-8xl font-bold text-brand-gold/30 mb-2">٤٠٤</p>
        <h1 className="text-2xl font-bold text-brand-charcoal mb-2">الصفحة غير موجودة</h1>
        <p className="text-gray-500 text-sm mb-8">
          يبدو أن الرابط الذي تبحث عنه غير موجود أو تم نقله.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            العودة للرئيسية
          </Link>
          <Link href="/dashboard" className="border border-brand-charcoal text-brand-charcoal font-semibold py-3.5 px-6 rounded-sm text-sm hover:bg-brand-cream transition-colors">
            لوحة التحكم
          </Link>
        </div>
      </div>
    </div>
  );
}
