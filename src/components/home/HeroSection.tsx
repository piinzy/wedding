'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import dynamic from 'next/dynamic';

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false });

export default function HeroSection() {
  const badgeRef   = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const descRef    = useRef<HTMLParagraphElement>(null);
  const btnsRef    = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(badgeRef.current,  { opacity: 0, y: 20, duration: 0.8 }, 0.3)
      .from(titleRef.current,  { opacity: 0, y: 35, duration: 0.9 }, 0.5)
      .from(descRef.current,   { opacity: 0, y: 20, duration: 0.8 }, 0.7)
      .from(btnsRef.current,   { opacity: 0, y: 20, duration: 0.8 }, 0.9)
      .from(statsRef.current,  { opacity: 0, y: 20, duration: 0.8 }, 1.1)
      .from(cardRef.current,   { opacity: 0, x: -40, duration: 1   }, 0.8);
  }, []);

  return (
    <section className="relative overflow-hidden bg-brand-charcoal text-white min-h-[100vh] flex items-center">
      <HeroCanvas />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid lg:grid-cols-2 gap-16 items-center w-full">

        {/* Text */}
        <div>
          <div ref={badgeRef} className="inline-flex items-center gap-2.5 bg-brand-gold/12 border border-brand-gold/25 rounded-full px-4 py-2 text-xs font-semibold text-brand-gold-light mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            منصة المناسبات العربية الأولى
          </div>

          <h1 ref={titleRef} className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
            مناسبتك المثالية
            <br />
            <span className="text-brand-gold relative">
              تبدأ هنا
              <span className="absolute bottom-1 right-0 left-0 h-0.5 bg-gradient-to-l from-brand-gold to-transparent rounded-full" />
            </span>
          </h1>

          <p ref={descRef} className="text-white/60 text-lg leading-relaxed mb-10 max-w-lg">
            من حفلات الزفاف الفاخرة إلى أعياد الميلاد الدافئة — رباط يخطط معك، يوصلك بأفضل الموردين، ويضمن مناسبة لا تُنسى.
          </p>

          <div ref={btnsRef} className="flex flex-col sm:flex-row gap-3 mb-14">
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 bg-gradient-to-l from-[#D4A85A] to-brand-gold text-white font-bold px-9 py-4 rounded-sm hover:opacity-90 transition-opacity text-sm shadow-brand"
            >
              ابدأ التخطيط مجاناً
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <Link
              href="/vendors"
              className="flex items-center justify-center gap-2 border border-white/20 text-white/80 font-medium px-8 py-4 rounded-sm hover:bg-white/8 transition-colors text-sm"
            >
              استعرض الموردين
            </Link>
          </div>

          <div ref={statsRef} className="flex items-center gap-10 pt-10 border-t border-white/10">
            {[
              { value: '+٢٨٠٠', label: 'مناسبة ناجحة' },
              { value: '+٥٠٠',  label: 'مزود معتمد'   },
              { value: '٤.٩★',  label: 'متوسط التقييم' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-extrabold text-brand-gold">{s.value}</p>
                <p className="text-white/40 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Floating dashboard card */}
        <div ref={cardRef} className="hidden lg:flex items-center justify-center">
          <div className="relative w-full max-w-sm">

            {/* Main card */}
            <div className="bg-white rounded-xl shadow-2xl p-6 relative z-10 animate-[float_6s_ease-in-out_infinite]" style={{ color: '#1B1B1B' }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">مناسبتك القادمة</p>
                  <p className="font-bold">حفل زفاف — ٢٥ ديسمبر</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-blush flex items-center justify-center text-xl">💍</div>
              </div>

              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>تقدم التخطيط</span><span className="font-bold text-brand-charcoal">٦٨٪</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-5">
                <div className="h-full bg-gradient-to-l from-[#D4A85A] to-brand-gold rounded-full" style={{ width: '68%' }} />
              </div>

              <div className="space-y-2 mb-5">
                {[
                  { done: true,  text: 'حجز القاعة'    },
                  { done: true,  text: 'اختيار المصور'  },
                  { done: false, text: 'تصميم الدعوات'  },
                  { done: false, text: 'اختيار الفستان' },
                ].map(t => (
                  <div key={t.text} className={`flex items-center gap-2.5 text-xs p-2 rounded ${t.done ? 'text-gray-400 bg-gray-50' : 'text-brand-charcoal bg-amber-50'}`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${t.done ? 'bg-green-400 border-green-400' : 'border-gray-300'}`}>
                      {t.done && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                    </div>
                    <span className={t.done ? 'line-through' : ''}>{t.text}</span>
                  </div>
                ))}
              </div>

              <div className="bg-brand-cream rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">الميزانية المتبقية</p>
                  <p className="font-bold text-green-600 text-sm">٦٥٬٥٠٠ ر.س</p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-400">من إجمالي</p>
                  <p className="font-bold text-brand-charcoal text-sm">١٢٠٬٠٠٠ ر.س</p>
                </div>
              </div>
            </div>

            {/* AI chip */}
            <div className="absolute -bottom-5 -left-8 bg-white rounded-xl shadow-card border border-gray-100 p-3 z-20 w-52 animate-[float_5s_ease-in-out_1s_infinite]">
              <div className="flex items-start gap-2">
                <span className="text-lg">🤖</span>
                <div>
                  <p className="text-xs font-semibold text-brand-charcoal mb-0.5">اقتراح المساعد</p>
                  <p className="text-xs text-gray-500 leading-relaxed">احجزي المصور الآن — الجدول يمتلئ!</p>
                </div>
              </div>
            </div>

            {/* Vendor chip */}
            <div className="absolute -top-4 -right-6 bg-white rounded-xl shadow-card border border-gray-100 px-3 py-2 flex items-center gap-2 z-20 animate-[float_4s_ease-in-out_0.5s_infinite]">
              <span className="text-sm">📸</span>
              <div>
                <p className="text-xs font-semibold text-brand-charcoal">استوديو لحظات</p>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-[10px]">★★★★★</span>
                  <span className="text-xs text-gray-400">٤.٨</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
