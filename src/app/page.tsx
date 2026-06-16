import Link from 'next/link';

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const EVENT_TYPES = [
  { emoji: '💍', label: 'زواج',        desc: 'خطط لحفل زفافك المثالي' },
  { emoji: '🎂', label: 'عيد ميلاد',  desc: 'اجعل يومه لا يُنسى'    },
  { emoji: '🎉', label: 'مناسبة',      desc: 'تخرج، ترقية، نجاح'    },
  { emoji: '🏠', label: 'حفلة منزل',  desc: 'تجمع دافئ مع الأحبة'  },
];

const FEATURES = [
  {
    icon: '🤖',
    title: 'مساعد ذكي لكل مناسبة',
    desc:  'ذكاء اصطناعي يبني لك خطة مفصّلة، يقترح الميزانية المثالية، ويتابع كل تفصيل معك خطوة بخطوة.',
  },
  {
    icon: '🏢',
    title: '+٥٠٠ مزود خدمات معتمد',
    desc:  'قاعات، مصورون، ضيافة، ديكور، ميك أب — كل ما تحتاجه في مكان واحد بتقييمات حقيقية وأسعار شفافة.',
  },
  {
    icon: '💰',
    title: 'إدارة ميزانية بصرية',
    desc:  'تتبع كل ريال تنفقه، استقبل تنبيهات تجاوز الميزانية، وصدّر تقريراً PDF باحترافية.',
  },
  {
    icon: '✅',
    title: 'قائمة مهام ذكية',
    desc:  'مهام مرتبة حسب الأولوية والموعد، مع إمكانية التخصيص الكامل لكل نوع مناسبة.',
  },
];

const STEPS = [
  { n: '١', label: 'سجّل وحدد مناسبتك',    desc: 'اختر نوع الحفلة وأدخل التفاصيل الأساسية في دقيقتين.' },
  { n: '٢', label: 'استخدم المساعد الذكي',  desc: 'احصل على خطة شاملة ومخصصة بمساعدة الذكاء الاصطناعي.' },
  { n: '٣', label: 'تواصل مع الموردين',     desc: 'اختر من بين مئات الموردين المعتمدين وتواصل مباشرة.' },
  { n: '٤', label: 'استمتع بمناسبتك',       desc: 'كل شيء منظم ومتابَع — أنت فقط تحتفل.' },
];

const TESTIMONIALS = [
  {
    name:    'مريم العتيبي',
    role:    'عروس — زفاف ديسمبر ٢٠٢٥',
    avatar:  'م',
    color:   'bg-pink-100 text-pink-600',
    quote:   'رباط غيّر تجربتي بالكامل. المساعد الذكي بنى لي خطة كاملة في دقائق وساعدني أوفر ٢٠٪ من الميزانية!',
    rating:  5,
  },
  {
    name:    'سلطان الغامدي',
    role:    'منظم حفلات — الرياض',
    avatar:  'س',
    color:   'bg-blue-100 text-blue-600',
    quote:   'استخدمته لأول مرة لحفلة عيد ميلاد ابنتي. التنسيق مع الموردين كان سلساً جداً، ما توقعت بهالسهولة.',
    rating:  5,
  },
  {
    name:    'نورة المطيري',
    role:    'منشئة فعاليات — جدة',
    avatar:  'ن',
    color:   'bg-purple-100 text-purple-600',
    quote:   'دليل الموردين وفّر عليّ أسابيع من البحث. الكل معتمد وعنده تقييمات حقيقية من ناس مرّوا بنفس التجربة.',
    rating:  5,
  },
];

const STATS = [
  { value: '+٢٨٠٠', label: 'مناسبة ناجحة' },
  { value: '+٥٠٠',  label: 'مزود خدمات معتمد' },
  { value: '٤.٩★',  label: 'متوسط التقييم' },
  { value: '٥ مدن', label: 'في المملكة' },
];

/* ══════════════════════════════════════════════
   COMPONENTS
══════════════════════════════════════════════ */
function StarRow({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(n)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-brand-cream overflow-x-hidden">

      {/* ══ NAVBAR ══ */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-brand-charcoal text-xl font-bold">رباط</span>
            <span className="text-brand-gold text-2xl">✦</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <Link href="/vendors"    className="hover:text-brand-charcoal transition-colors">الموردون</Link>
            <Link href="/dashboard"  className="hover:text-brand-charcoal transition-colors">لوحة التحكم</Link>
            <Link href="#how-it-works" className="hover:text-brand-charcoal transition-colors">كيف يعمل</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login"    className="text-sm text-brand-charcoal hover:text-brand-gold transition-colors font-medium hidden sm:block">دخول</Link>
            <Link href="/register" className="text-sm bg-brand-charcoal text-white px-5 py-2.5 rounded-sm hover:bg-brand-charcoal-light transition-colors font-semibold">
              ابدأ مجاناً
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden bg-brand-charcoal text-white min-h-[90vh] flex items-center">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        {/* Gold glow blobs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-brand-gold/10 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-gold/8 blur-[100px] translate-x-1/3 translate-y-1/3" />

        {/* Decorative ✦ */}
        <div className="absolute top-12 left-10 text-brand-gold/15 text-[160px] font-bold leading-none select-none pointer-events-none">✦</div>
        <div className="absolute bottom-16 right-16 text-brand-gold/10 text-[80px] leading-none select-none pointer-events-none">✦</div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">

          {/* Left text */}
          <div>
            <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-xs font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              منصة المناسبات العربية الأولى
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              مناسبتك المثالية
              <br />
              <span className="text-brand-gold">تبدأ هنا</span>
            </h1>

            <p className="text-white/65 text-lg leading-relaxed mb-10 max-w-lg">
              من حفلات الزفاف الفاخرة إلى أعياد الميلاد الدافئة — رباط يخطط معك، يوصلك بأفضل الموردين، ويضمن مناسبة لا تُنسى.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link href="/register" className="flex items-center justify-center gap-2 bg-brand-gold text-white font-bold px-8 py-4 rounded-sm hover:bg-brand-gold-dark transition-colors text-sm shadow-brand">
                ابدأ التخطيط مجاناً
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </Link>
              <Link href="/vendors" className="flex items-center justify-center gap-2 border border-white/20 text-white/80 font-medium px-8 py-4 rounded-sm hover:bg-white/8 transition-colors text-sm">
                استعرض الموردين
              </Link>
            </div>

            {/* Mini stats */}
            <div className="flex items-center gap-6 pt-8 border-t border-white/10">
              {STATS.slice(0, 3).map(s => (
                <div key={s.label}>
                  <p className="text-xl font-bold text-brand-gold">{s.value}</p>
                  <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: floating card mockup */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-sm">

              {/* Main card */}
              <div className="bg-white rounded-sm shadow-2xl p-6 relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">مناسبتك القادمة</p>
                    <p className="font-bold text-brand-charcoal">حفل زفاف — ٢٥ ديسمبر</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-brand-blush flex items-center justify-center text-xl">💍</div>
                </div>

                {/* Progress */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>تقدم التخطيط</span><span className="font-bold text-brand-charcoal">٦٨٪</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-gradient rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-2 mb-5">
                  {[
                    { done: true,  text: 'حجز القاعة'       },
                    { done: true,  text: 'اختيار المصور'    },
                    { done: false, text: 'تصميم الدعوات'    },
                    { done: false, text: 'اختيار الفستان'   },
                  ].map(t => (
                    <div key={t.text} className={`flex items-center gap-2.5 text-xs p-2 rounded-sm ${t.done ? 'text-gray-400' : 'text-brand-charcoal'}`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${t.done ? 'bg-green-400 border-green-400' : 'border-gray-300'}`}>
                        {t.done && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                      </div>
                      <span className={t.done ? 'line-through' : ''}>{t.text}</span>
                    </div>
                  ))}
                </div>

                {/* Budget mini */}
                <div className="bg-brand-cream rounded-sm p-3 flex items-center justify-between">
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

              {/* Floating: AI suggestion */}
              <div className="absolute -bottom-5 -left-8 bg-white rounded-sm shadow-card border border-gray-100 p-3 z-20 w-52">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🤖</span>
                  <div>
                    <p className="text-xs font-semibold text-brand-charcoal mb-0.5">اقتراح المساعد</p>
                    <p className="text-xs text-gray-500 leading-relaxed">احجزي المصور الآن — الجدول يمتلئ في ديسمبر!</p>
                  </div>
                </div>
              </div>

              {/* Floating: vendor chip */}
              <div className="absolute -top-4 -right-6 bg-white rounded-sm shadow-card border border-gray-100 px-3 py-2 flex items-center gap-2 z-20">
                <span className="text-sm">📸</span>
                <div>
                  <p className="text-xs font-semibold text-brand-charcoal">استوديو لحظات</p>
                  <div className="flex items-center gap-1">
                    <StarRow n={5} />
                    <span className="text-xs text-gray-400">٤.٨</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ EVENT TYPES ══ */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-brand-gold text-sm font-semibold tracking-widest uppercase mb-3">لكل المناسبات</p>
          <h2 className="text-3xl font-bold text-brand-charcoal">ما نوع مناسبتك؟</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {EVENT_TYPES.map(e => (
            <Link
              key={e.label}
              href="/register"
              className="group bg-white border border-gray-100 rounded-sm p-7 text-center hover:border-brand-gold hover:shadow-brand transition-all duration-200 hover:-translate-y-1"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">{e.emoji}</div>
              <p className="font-bold text-brand-charcoal mb-1">{e.label}</p>
              <p className="text-gray-400 text-xs">{e.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ STATS BAND ══ */}
      <section className="bg-brand-charcoal py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-brand-gold mb-1">{s.value}</p>
              <p className="text-white/50 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-brand-gold text-sm font-semibold tracking-widest uppercase mb-3">لماذا رباط؟</p>
          <h2 className="text-3xl font-bold text-brand-charcoal mb-3">كل ما تحتاجه في مكان واحد</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
            لا داعي لجداول بيانات أو رسائل متفرقة — رباط يجمع كل شيء ويجعل تنظيم المناسبات تجربة ممتعة.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="bg-white rounded-sm p-7 border border-gray-100 shadow-card hover:shadow-brand hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="w-14 h-14 rounded-sm bg-brand-cream flex items-center justify-center text-3xl mb-5 group-hover:bg-brand-blush transition-colors">
                {f.icon}
              </div>
              <h3 className="font-bold text-brand-charcoal mb-2 text-sm leading-snug">{f.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-gold text-sm font-semibold tracking-widest uppercase mb-3">الطريقة</p>
            <h2 className="text-3xl font-bold text-brand-charcoal">كيف يعمل رباط؟</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.label} className="relative text-center">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(50%+28px)] w-[calc(100%-56px)] h-px bg-brand-gold-light" />
                )}
                <div className="w-14 h-14 rounded-full bg-brand-charcoal text-white font-bold text-xl flex items-center justify-center mx-auto mb-5 relative z-10">
                  {s.n}
                </div>
                <h3 className="font-bold text-brand-charcoal text-sm mb-2">{s.label}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-brand-gold text-sm font-semibold tracking-widest uppercase mb-3">آراء المستخدمين</p>
          <h2 className="text-3xl font-bold text-brand-charcoal">ماذا يقولون عنا؟</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-white rounded-sm p-7 border border-gray-100 shadow-card hover:shadow-brand transition-all duration-200">
              {/* Quote mark */}
              <div className="text-5xl text-brand-gold/20 font-serif leading-none mb-3">"</div>
              <StarRow n={t.rating} />
              <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-6">{t.quote}</p>
              <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${t.color}`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-brand-charcoal text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="py-6 px-6 pb-14">
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-sm bg-brand-charcoal text-white px-8 py-16 text-center">
          <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #C9A96E 0%, transparent 60%), radial-gradient(circle at 80% 50%, #C9A96E 0%, transparent 60%)' }} />
          <div className="absolute top-6 right-8 text-brand-gold/15 text-8xl select-none">✦</div>
          <div className="absolute bottom-6 left-8 text-brand-gold/10 text-6xl select-none">✦</div>

          <div className="relative z-10">
            <p className="text-brand-gold text-sm font-semibold tracking-widest uppercase mb-4">ابدأ اليوم</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              مناسبتك المثالية<br />تستحق أفضل تخطيط
            </h2>
            <p className="text-white/60 text-base mb-10 max-w-md mx-auto">
              سجّل مجاناً وابدأ التخطيط الآن — لا بطاقة ائتمان، لا تعقيد.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="bg-brand-gold text-white font-bold px-10 py-4 rounded-sm hover:bg-brand-gold-dark transition-colors text-sm shadow-brand">
                ابدأ مجاناً — الآن
              </Link>
              <Link href="/vendors" className="border border-white/25 text-white/80 font-medium px-8 py-4 rounded-sm hover:bg-white/10 transition-colors text-sm">
                استعرض الموردين
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="bg-brand-charcoal text-white/50 py-10 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">رباط</span>
            <span className="text-brand-gold">✦</span>
            <span className="text-xs mr-2">منصة المناسبات العربية</span>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <Link href="/terms"   className="hover:text-white transition-colors">شروط الخدمة</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">الخصوصية</Link>
            <Link href="/vendors" className="hover:text-white transition-colors">الموردون</Link>
            <Link href="/register" className="hover:text-white transition-colors">سجّل</Link>
          </div>
          <p className="text-xs">© ٢٠٢٦ رباط. جميع الحقوق محفوظة.</p>
        </div>
      </footer>

    </div>
  );
}
