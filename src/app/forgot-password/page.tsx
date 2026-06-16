'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { Metadata } from 'next';

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });
    if (error) { setError('تعذر إرسال الرابط، تحقق من البريد الإلكتروني'); setLoading(false); return; }
    setDone(true);
  }

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <span className="text-brand-charcoal text-xl font-bold">رباط</span>
            <span className="text-brand-gold text-2xl">✦</span>
          </Link>
          <div className="w-14 h-14 rounded-full bg-brand-blush flex items-center justify-center mx-auto mb-5">
            <span className="text-2xl">🔑</span>
          </div>
          {done ? (
            <>
              <h1 className="text-2xl font-bold text-brand-charcoal mb-2">تم الإرسال!</h1>
              <p className="text-gray-400 text-sm">أرسلنا رابط إعادة التعيين إلى <strong className="text-brand-charcoal">{email}</strong></p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-brand-charcoal mb-2">نسيت كلمة المرور؟</h1>
              <p className="text-gray-400 text-sm">أدخل بريدك وسنرسل لك رابط إعادة التعيين</p>
            </>
          )}
        </div>

        {!done && (
          <form onSubmit={handleSubmit} className="bg-white rounded-sm shadow-card border border-gray-100 p-8 space-y-5">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
                <span className="text-red-500">⚠</span>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            <div>
              <label htmlFor="email" className="input-label">البريد الإلكتروني</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com" required className="input-field" dir="ltr" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-400 mt-6">
          <Link href="/login" className="text-brand-gold hover:underline font-medium">← العودة لتسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
}
