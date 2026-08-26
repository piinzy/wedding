'use client';

import { useState, useTransition } from 'react';
import { approveVendor, rejectVendor } from '@/lib/actions/admin';

const EVENT_TYPE_ICONS: Record<string, string> = {
  wedding: '💍',
  home_party: '🏠',
  occasion: '🎉',
  birthday: '🎂',
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: 'زواج',
  home_party: 'حفلة منزل',
  occasion: 'مناسبة',
  birthday: 'عيد ميلاد',
};

const ROLE_LABELS: Record<string, string> = {
  organizer: 'منشئ فعالية',
  vendor: 'مزود خدمات',
  admin: 'أدمن',
};

const SERVICE_TYPE_LABELS: Record<string, string> = {
  hall: 'قاعة',
  photographer: 'تصوير',
  catering: 'ضيافة',
  decoration: 'ديكور',
  entertainment: 'ترفيه',
  other: 'أخرى',
};

type PendingVendor = {
  id: string;
  business_name: string;
  service_type: string;
  city: string | null;
  created_at: string;
  users: { full_name: string; email: string } | null;
};

type RecentEvent = {
  id: string;
  event_type: string;
  city: string | null;
  created_at: string;
  users: { full_name: string } | null;
};

type RecentUser = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'منذ أقل من ساعة';
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'أمس';
  return `منذ ${days} أيام`;
}

export function AdminTabs({
  pendingVendors,
  recentEvents,
  recentUsers,
}: {
  pendingVendors: PendingVendor[];
  recentEvents: RecentEvent[];
  recentUsers: RecentUser[];
}) {
  const [tab, setTab] = useState<'pending' | 'events'>('pending');
  const [vendors, setVendors] = useState(pendingVendors);
  const [isPending, startTransition] = useTransition();

  function handleApprove(vendorId: string) {
    startTransition(async () => {
      await approveVendor(vendorId);
      setVendors(prev => prev.filter(v => v.id !== vendorId));
    });
  }

  function handleReject(vendorId: string) {
    startTransition(async () => {
      await rejectVendor(vendorId);
      setVendors(prev => prev.filter(v => v.id !== vendorId));
    });
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-sm shadow-card border border-gray-100">
        <div className="flex border-b border-gray-100">
          {[
            { key: 'pending', label: 'موردون ينتظرون الموافقة', count: vendors.length },
            { key: 'events',  label: 'أحدث المناسبات',          count: recentEvents.length },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-brand-gold text-brand-charcoal'
                  : 'border-transparent text-gray-400 hover:text-brand-charcoal'
              }`}
            >
              {t.label}
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                tab === t.key ? 'bg-brand-gold text-white' : 'bg-gray-100 text-gray-500'
              }`}>{t.count}</span>
            </button>
          ))}
        </div>

        {tab === 'pending' && (
          <div className="divide-y divide-gray-50">
            {vendors.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-3xl mb-2">✅</p>
                <p className="text-sm">لا توجد طلبات معلقة</p>
              </div>
            ) : vendors.map(v => (
              <div key={v.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-sm bg-brand-blush flex items-center justify-center text-brand-rose font-bold">
                  {v.business_name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brand-charcoal text-sm">{v.business_name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-400">{SERVICE_TYPE_LABELS[v.service_type] ?? v.service_type}</span>
                    {v.city && <><span className="text-gray-300">·</span><span className="text-xs text-gray-400">{v.city}</span></>}
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{timeAgo(v.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(v.id)}
                    disabled={isPending}
                    className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-sm hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                  >
                    قبول
                  </button>
                  <button
                    onClick={() => handleReject(v.id)}
                    disabled={isPending}
                    className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-sm hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
                  >
                    رفض
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'events' && (
          <div className="divide-y divide-gray-50">
            {recentEvents.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-3xl mb-2">🎪</p>
                <p className="text-sm">لا توجد مناسبات بعد</p>
              </div>
            ) : recentEvents.map(e => (
              <div key={e.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-sm bg-brand-cream flex items-center justify-center text-xl flex-shrink-0">
                  {EVENT_TYPE_ICONS[e.event_type] ?? '🎉'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brand-charcoal text-sm">{e.users?.full_name ?? '—'}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-brand-gold">{EVENT_TYPE_LABELS[e.event_type] ?? e.event_type}</span>
                    {e.city && <><span className="text-gray-300">·</span><span className="text-xs text-gray-400">{e.city}</span></>}
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{timeAgo(e.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-sm p-6 shadow-card border border-gray-100">
        <h2 className="font-bold text-brand-charcoal text-base mb-4">أحدث المسجلين</h2>
        {recentUsers.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">لا يوجد مستخدمون بعد</p>
        ) : (
          <div className="space-y-3">
            {recentUsers.map(u => (
              <div key={u.id} className="flex items-center gap-3 p-3 rounded-sm hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-brand-blush flex items-center justify-center font-bold text-sm text-brand-rose">
                  {u.full_name[0] ?? '؟'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brand-charcoal text-sm">{u.full_name}</p>
                  <p className="text-xs text-gray-400">{ROLE_LABELS[u.role] ?? u.role}</p>
                </div>
                <p className="text-xs text-gray-400 flex-shrink-0">{timeAgo(u.created_at)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
