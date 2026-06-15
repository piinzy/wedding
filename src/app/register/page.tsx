'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type Role = 'bride' | 'vendor';

const STEPS = ['اختر نوع حسابك', 'معلوماتك الشخصية', 'تأكيد التسجيل'];

export default function RegisterPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [step, setStep]         = useState(0);
  const [role, setRole]         = useState<Role | null>(null);
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [done, setDone]         = useState(false);

  /* ── Validation ── */
  function validateStep1() {
    if (!name.trim())               return 'الرجاء إدخال اسمك الكامل';
    if (!email.includes('@'))       return 'البريد الإلكتروني غير صحيح';
    if (password.length < 8)        return 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    if (password !== confirm)       return 'كلمة المرور غير متطابقة';
    return '';
  }

  /* ── Submit ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, role },
        emailRedirectTo: `${location.origin}/dashboard`,
      },
    });

    if (signUpError) {
      setError(signUpError.message === 'User already registered'
        ? 'هذا البريد الإلكتروني مسجل مسبقاً'
        : 'حدث خطأ، حاول مرة أخرى');
      setLoading(false);
      return;
    }

    setDone(true);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/dashboard` },
    });
  }

  /* ── Success screen ── */
  if (done) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-fade-up">
          <div className="w-20 h-20 rounded-full bg-brand-blush flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">💌</span>
          </div>
          <h2 className="text-2xl font-bold text-brand-charcoal mb-3">تحقق من بريدك الإلكتروني</h2>
          <p className="text-brand-charcoal-light text-sm leading-relaxed mb-8">
            أرسلنا رابط تأكيد إلى <strong className="text-brand-charcoal">{email}</strong>
            <br />افتح بريدك وانقر على الرابط لتفعيل حسابك
          </p>
          <Link href="/login" className="btn-primary inline-block w-auto px-10">
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left: Hero Image ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)' }} />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80')` }}
        />

        <div className="relative z-20 flex flex-col justify-end p-14 text-white">
          <div className="mb-8">
            <div className="w-12 h-px bg-brand-gold mb-6" />
            <h2 className="text-4xl font-bold leading-snug mb-3">
              ابدأي رحلتك<br />نحو يومك المثالي
            </h2>
            <p className="text-white/75 text-base leading-relaxed max-w-xs">
              سجلي معنا مجاناً واستمتعي بتجربة تخطيط زفاف لا تُنسى
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {[
              { icon: '✦', text: 'ذكاء اصطناعي لتخطيط زفافك' },
              { icon: '✦', text: '+٥٠٠ مورد معتمد في المملكة' },
              { icon: '✦', text: 'إدارة الميزانية والمهام بسهولة' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <span className="text-brand-gold text-sm">{f.icon}</span>
                <span className="text-white/80 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen bg-brand-cream">

        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-brand-charcoal text-lg font-bold tracking-tight group-hover:text-brand-gold transition-colors">رباط</span>
            <span className="text-brand-gold text-xl">✦</span>
          </Link>
          <p className="text-sm text-brand-charcoal-light">
            لديك حساب؟{' '}
            <Link href="/login" className="text-brand-gold hover:underline font-semibold">
              سجل الدخول
            </Link>
          </p>
        </header>

        {/* Progress bar */}
        <div className="px-8">
          <div className="flex items-center gap-2 mb-1">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  i < step ? 'bg-brand-gold text-white' :
                  i === step ? 'bg-brand-charcoal text-white' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs hidden sm:block transition-colors ${i === step ? 'text-brand-charcoal font-semibold' : 'text-gray-400'}`}>
                  {s}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px transition-all duration-300 ${i < step ? 'bg-brand-gold' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-8 py-8">
          <div className="w-full max-w-md animate-fade-up">

            {/* ── STEP 0: Choose role ── */}
            {step === 0 && (
              <div>
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-blush mb-5">
                    <span className="text-2xl">👋</span>
                  </div>
                  <h1 className="text-3xl font-bold text-brand-charcoal mb-2">إنشاء حساب جديد</h1>
                  <p className="text-brand-charcoal-light text-sm">ما الذي يصفك بشكل أفضل؟</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {/* Bride card */}
                  <button
                    type="button"
                    onClick={() => setRole('bride')}
                    className={`group relative flex flex-col items-center gap-3 p-6 rounded-sm border-2 transition-all duration-200 ${
                      role === 'bride'
                        ? 'border-brand-gold bg-brand-blush shadow-brand'
                        : 'border-gray-200 bg-white hover:border-brand-gold-light'
                    }`}
                  >
                    <span className="text-4xl">👰</span>
                    <div className="text-center">
                      <p className="font-bold text-brand-charcoal text-sm">عروس</p>
                      <p className="text-gray-400 text-xs mt-1">أخطط لزفافي</p>
                    </div>
                    {role === 'bride' && (
                      <span className="absolute top-3 left-3 w-5 h-5 bg-brand-gold rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    )}
                  </button>

                  {/* Vendor card */}
                  <button
                    type="button"
                    onClick={() => setRole('vendor')}
                    className={`group relative flex flex-col items-center gap-3 p-6 rounded-sm border-2 transition-all duration-200 ${
                      role === 'vendor'
                        ? 'border-brand-gold bg-brand-blush shadow-brand'
                        : 'border-gray-200 bg-white hover:border-brand-gold-light'
                    }`}
                  >
                    <span className="text-4xl">🏢</span>
                    <div className="text-center">
                      <p className="font-bold text-brand-charcoal text-sm">مورد خدمات</p>
                      <p className="text-gray-400 text-xs mt-1">أقدم خدمات الأفراح</p>
                    </div>
                    {role === 'vendor' && (
                      <span className="absolute top-3 left-3 w-5 h-5 bg-brand-gold rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => { if (role) setStep(1); }}
                  disabled={!role}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  التالي
                </button>

                {/* Divider */}
                <div className="gold-divider my-6">
                  <span className="text-xs text-gray-400">أو</span>
                </div>

                <button type="button" onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white rounded-sm py-3.5 text-sm font-medium text-brand-charcoal hover:bg-gray-50 transition-colors shadow-input">
                  <GoogleIcon />
                  المتابعة مع Google
                </button>
              </div>
            )}

            {/* ── STEP 1: Personal info ── */}
            {step === 1 && (
              <div>
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-blush mb-5">
                    <span className="text-2xl">{role === 'bride' ? '💍' : '🏢'}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-brand-charcoal mb-2">معلوماتك الشخصية</h1>
                  <p className="text-brand-charcoal-light text-sm">
                    تسجيل كـ <span className="text-brand-gold font-semibold">{role === 'bride' ? 'عروس' : 'مورد خدمات'}</span>
                  </p>
                </div>

                {error && (
                  <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
                    <span className="text-red-500">⚠</span>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="input-label">
                      {role === 'bride' ? 'الاسم الكامل' : 'اسم النشاط التجاري'}
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={role === 'bride' ? 'مريم العتيبي' : 'استوديو النور للتصوير'}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="input-label">البريد الإلكتروني</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      required
                      className="input-field"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="input-label">كلمة المرور</label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="٨ أحرف على الأقل"
                        required
                        className="input-field pl-12"
                        dir="ltr"
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-charcoal transition-colors">
                        {showPass ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    {/* Password strength */}
                    {password.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i < Math.min(Math.floor(password.length / 2), 4)
                              ? password.length >= 8 ? 'bg-green-400' : 'bg-brand-gold'
                              : 'bg-gray-200'
                          }`} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirm" className="input-label">تأكيد كلمة المرور</label>
                    <input
                      id="confirm"
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      required
                      className={`input-field ${confirm && confirm !== password ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''}`}
                      dir="ltr"
                    />
                    {confirm && confirm !== password && (
                      <p className="text-red-500 text-xs mt-1">كلمة المرور غير متطابقة</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setStep(0); setError(''); }}
                      className="flex-1 border border-gray-200 bg-white text-brand-charcoal font-semibold py-3.5 px-6 rounded-sm hover:bg-gray-50 transition-colors text-sm"
                    >
                      رجوع
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] btn-primary mt-0"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <LoadingSpinner />
                          جاري التسجيل...
                        </span>
                      ) : 'إنشاء الحساب'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Terms note */}
            <p className="text-center text-xs text-gray-400 mt-8 leading-relaxed">
              بإنشاء حساب، أنت توافق على{' '}
              <Link href="/terms" className="underline hover:text-brand-gold">شروط الخدمة</Link>
              {' '}و{' '}
              <Link href="/privacy" className="underline hover:text-brand-gold">سياسة الخصوصية</Link>
            </p>
          </div>
        </div>

        <footer className="px-8 py-5 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} رباط — منصة الزفاف العربية</p>
        </footer>
      </div>
    </div>
  );
}

/* ── Icons ── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
  );
}
