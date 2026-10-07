'use client';

import { useState, useTransition } from 'react';
import { createInquiry } from '@/lib/actions/vendor';

export default function InquiryForm({ vendorId, vendorName }: { vendorId: string; vendorName: string }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('');
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);

  const EVENT_TYPES = ['زفاف', 'عيد ميلاد', 'خطوبة', 'تخرج', 'حفلة منزل', 'أخرى'];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await createInquiry({ vendorId, message, eventDate, eventType });
      setResult(res);
      if (res.success) setMessage('');
    });
  }

  return (
    <div className="bg-white rounded-sm border border-gray-100 shadow-card p-6 sticky top-24">
      <h2 className="font-bold text-brand-charcoal mb-1">تواصل مع المورد</h2>
      <p className="text-xs text-gray-400 mb-5">{vendorName} سيرد عليك خلال ٢٤ ساعة</p>

      {result?.success ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">✅</div>
          <p className="font-bold text-brand-charcoal mb-1">تم إرسال استفسارك!</p>
          <p className="text-xs text-gray-400 mb-5">سيتواصل معك المورد قريباً</p>
          <button
            onClick={() => setResult(null)}
            className="text-sm text-brand-gold hover:underline"
          >
            إرسال استفسار آخر
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {result?.error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-sm">
              {result.error}
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1.5">نوع المناسبة</label>
            <select
              value={eventType}
              onChange={e => setEventType(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-sm px-3 py-2.5 focus:outline-none focus:border-brand-gold"
            >
              <option value="">اختر نوع المناسبة (اختياري)</option>
              {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1.5">تاريخ المناسبة</label>
            <input
              type="date"
              value={eventDate}
              onChange={e => setEventDate(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-sm px-3 py-2.5 focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1.5">رسالتك <span className="text-red-400">*</span></label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="اكتب تفاصيل احتياجك هنا..."
              rows={4}
              required
              className="w-full text-sm border border-gray-200 rounded-sm px-3 py-2.5 focus:outline-none focus:border-brand-gold resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{message.length} / ١٠ أحرف على الأقل</p>
          </div>

          <button
            type="submit"
            disabled={isPending || message.trim().length < 10}
            className="w-full bg-brand-charcoal text-white font-bold py-3 rounded-sm hover:bg-brand-charcoal-light transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'جار الإرسال...' : 'إرسال الاستفسار'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            يجب{' '}
            <a href="/login" className="text-brand-gold hover:underline">تسجيل الدخول</a>
            {' '}لإرسال استفسار
          </p>
        </form>
      )}
    </div>
  );
}
