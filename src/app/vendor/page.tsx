import { VendorLayout } from '@/components/dashboard/VendorLayout';
import { getVendorDashboardData } from '@/lib/actions/vendor';
import Link from 'next/link';

function formatSAR(n: number) {
  return n.toLocaleString('ar-SA') + ' ر.س';
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'منذ أقل من ساعة';
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'أمس';
  return `منذ ${days} أيام`;
}

const INQUIRY_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:  { label: 'جديد',     color: 'bg-yellow-100 text-yellow-700' },
  read:     { label: 'مقروء',   color: 'bg-blue-100 text-blue-700'     },
  replied:  { label: 'تم الرد', color: 'bg-green-100 text-green-700'   },
};

export default async function VendorPage() {
  const { profile, inquiries, reviews, photos } = await getVendorDashboardData();

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  const pendingInquiries = inquiries.filter(i => i.status === 'pending').length;

  // Setup required: redirect if no vendor profile
  if (!profile) {
    return (
      <VendorLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
          <p className="text-4xl">🏢</p>
          <h2 className="text-xl font-bold text-brand-charcoal">لم يتم إنشاء ملف المورد بعد</h2>
          <p className="text-sm text-gray-500 max-w-xs">أنشئ ملفك التجاري لتظهر في دليل الموردين وتستقبل الاستفسارات</p>
          <Link href="/vendor/setup" className="btn-primary mt-2 w-auto px-8">إنشاء ملف المورد</Link>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <div className="space-y-6 max-w-6xl mx-auto animate-fade-up">

        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-sm bg-brand-charcoal text-white px-8 py-7">
          <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-brand-gold/10" />
          <div className="absolute top-4 left-4 text-brand-gold/20 text-8xl select-none">✦</div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${profile.is_approved ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                  {profile.is_approved ? '✓ معتمد ومنشور' : '⏳ قيد المراجعة'}
                </span>
              </div>
              <h2 className="text-2xl font-bold">{profile.business_name}</h2>
              <p className="text-white/60 text-sm mt-1">{profile.city ?? 'لم تُحدَّد المدينة'}</p>
            </div>
            <Link
              href="/vendor/profile"
              className="flex-shrink-0 bg-brand-gold text-white font-semibold px-6 py-2.5 rounded-sm text-sm hover:bg-brand-gold-dark transition-colors"
            >
              تعديل الملف ←
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '💬', label: 'استفسارات جديدة', value: pendingInquiries.toString(), accent: 'bg-yellow-50' },
            { icon: '⭐', label: 'متوسط التقييم',   value: avgRating,                    accent: 'bg-brand-blush' },
            { icon: '📝', label: 'إجمالي التقييمات', value: reviews.length.toString(),   accent: 'bg-blue-50' },
            { icon: '🖼️', label: 'صور المعرض',      value: photos.length.toString(),     accent: 'bg-green-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-sm p-5 shadow-card border border-gray-100 flex items-start gap-4">
              <div className={`w-11 h-11 rounded-sm flex items-center justify-center text-xl flex-shrink-0 ${s.accent}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">{s.label}</p>
                <p className="text-xl font-bold text-brand-charcoal">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Inquiries */}
        <div className="bg-white rounded-sm p-6 shadow-card border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-brand-charcoal text-base">الاستفسارات</h2>
            <Link href="/vendor/inquiries" className="text-xs text-brand-gold hover:underline">عرض الكل ←</Link>
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">💬</p>
              <p className="text-sm">لا توجد استفسارات بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.slice(0, 5).map((inq) => {
                const statusInfo = INQUIRY_STATUS_LABELS[inq.status] ?? { label: inq.status, color: 'bg-gray-100 text-gray-500' };
                return (
                  <div key={inq.id} className="flex items-start gap-4 p-4 rounded-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-brand-blush flex items-center justify-center text-brand-rose font-bold flex-shrink-0">
                      ؟
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400">{timeAgo(inq.created_at)}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{inq.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-sm p-6 shadow-card border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-brand-charcoal text-base">التقييمات</h2>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">⭐</p>
              <p className="text-sm">لا توجد تقييمات بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.slice(0, 5).map((r) => (
                <div key={r.id} className="p-4 rounded-sm border border-gray-100">
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < r.rating ? 'text-brand-gold' : 'text-gray-200'}>★</span>
                    ))}
                    <span className="text-xs text-gray-400 mr-2">{timeAgo(r.created_at)}</span>
                    {r.is_verified && (
                      <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">✓ موثّق</span>
                    )}
                  </div>
                  {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Portfolio */}
        {photos.length > 0 && (
          <div className="bg-white rounded-sm p-6 shadow-card border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-brand-charcoal text-base">المعرض</h2>
              <Link href="/vendor/portfolio" className="text-xs text-brand-gold hover:underline">إدارة المعرض ←</Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {photos.map((photo) => (
                <div key={photo.id} className="aspect-square rounded-sm bg-brand-cream overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt={photo.alt_text ?? ''} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upgrade CTA if basic plan */}
        {profile.subscription_plan === 'basic' && (
          <div className="relative overflow-hidden rounded-sm bg-gradient-to-l from-brand-gold to-brand-gold-dark text-white p-7">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-1">ارتقِ بحضورك الرقمي</h3>
                <p className="text-white/80 text-sm">الباقة الاحترافية: صور غير محدودة، أولوية في نتائج البحث، تحليلات متقدمة</p>
              </div>
              <Link
                href="/vendor/upgrade"
                className="flex-shrink-0 bg-white text-brand-gold-dark font-bold px-7 py-3 rounded-sm text-sm hover:bg-white/90 transition-colors"
              >
                ترقية الآن
              </Link>
            </div>
          </div>
        )}

      </div>
    </VendorLayout>
  );
}
