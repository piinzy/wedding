import { notFound } from 'next/navigation';
import Link from 'next/link';
import InquiryForm from '@/components/vendors/InquiryForm';
import { getVendorById } from '@/lib/actions/vendor';

const SERVICE_ICONS: Record<string, string> = {
  photography: '📸', venue: '🏛️', catering: '🍽️',
  decoration: '🌸', music: '🎵', makeup: '💄',
  flowers: '💐', invitation: '💌',
};

export default async function VendorDetailPage({ params }: { params: { id: string } }) {
  const vendor = await getVendorById(params.id);

  // If not found in DB, show a placeholder (for mock IDs during dev)
  const v = vendor ?? {
    id: params.id,
    business_name: 'مورد غير موجود',
    service_type: 'photography',
    city: '-',
    description: '',
    price_per_event: null,
    average_rating: 0,
    review_count: 0,
    reviews: [],
    is_approved: true,
  };

  if (!vendor && !params.id.startsWith('m')) notFound();

  const icon = SERVICE_ICONS[v.service_type] ?? '✦';

  return (
    <div className="min-h-screen bg-brand-cream" dir="rtl">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-brand-charcoal text-xl font-bold">رباط</span>
            <span className="text-brand-gold text-2xl">✦</span>
          </Link>
          <Link href="/vendors" className="text-sm text-gray-500 hover:text-brand-gold transition-colors flex items-center gap-1">
            ← العودة للموردين
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left: vendor info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover + basic info */}
            <div className="bg-white rounded-sm border border-gray-100 overflow-hidden shadow-card">
              <div className="h-52 bg-gradient-to-br from-brand-blush to-brand-gold/25 flex items-center justify-center text-8xl">
                {icon}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-brand-charcoal mb-1">{v.business_name}</h1>
                    <p className="text-gray-400 text-sm">{v.city}</p>
                  </div>
                  <span className="bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full border border-green-100">✓ معتمد</span>
                </div>

                {v.average_rating > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <svg key={i} className={`w-4 h-4 ${i <= Math.round(v.average_rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="font-bold text-brand-charcoal">{v.average_rating}</span>
                    <span className="text-gray-400 text-sm">({v.review_count ?? 0} تقييم)</span>
                  </div>
                )}

                {v.description && (
                  <p className="text-gray-600 text-sm leading-relaxed">{v.description}</p>
                )}

                {v.price_per_event && (
                  <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-400">السعر التقريبي للمناسبة</span>
                    <span className="text-xl font-bold text-brand-charcoal">
                      {v.price_per_event.toLocaleString('ar-SA')} ر.س
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews */}
            {(v.reviews?.length ?? 0) > 0 && (
              <div className="bg-white rounded-sm border border-gray-100 p-6 shadow-card">
                <h2 className="font-bold text-brand-charcoal mb-4">آراء العملاء</h2>
                <div className="space-y-4">
                  {v.reviews.slice(0, 5).map((r: any) => (
                    <div key={r.id} className="pb-4 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-full bg-brand-blush flex items-center justify-center text-xs font-bold text-brand-rose">
                          {r.reviewer_name?.[0] ?? 'م'}
                        </div>
                        <span className="text-sm font-medium text-brand-charcoal">{r.reviewer_name ?? 'مستخدم'}</span>
                        <span className="text-yellow-400 text-xs">{'★'.repeat(r.rating ?? 5)}</span>
                      </div>
                      {r.comment && <p className="text-xs text-gray-500 leading-relaxed mr-9">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: inquiry form */}
          <div className="lg:col-span-1">
            <InquiryForm vendorId={v.id} vendorName={v.business_name} />
          </div>
        </div>
      </div>
    </div>
  );
}
