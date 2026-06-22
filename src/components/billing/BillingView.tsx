'use client';

import { useState, useEffect } from 'react';
import { Check, Crown, Zap, Star, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLAN_LIMITS, PLAN_PRICES } from '@/types';

interface SubscriptionData {
  plan: string;
  status: string;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
}

interface InvoiceData {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: string;
  issuedAt: string;
}

interface Props {
  subscription: SubscriptionData | null;
  workspaceId: string;
}

function formatIDR(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

function limitLabel(v: number) {
  return v === -1 ? 'Tidak terbatas' : v.toString();
}

const PLAN_BADGES: Record<string, { color: string; icon: React.ReactNode }> = {
  FREE: { color: 'bg-gray-100 text-gray-700', icon: <Star className="h-3.5 w-3.5" /> },
  STARTER: { color: 'bg-blue-100 text-blue-700', icon: <Zap className="h-3.5 w-3.5" /> },
  PRO: { color: 'bg-purple-100 text-purple-700', icon: <Crown className="h-3.5 w-3.5" /> },
  ENTERPRISE: { color: 'bg-amber-100 text-amber-700', icon: <Crown className="h-3.5 w-3.5" /> },
};

const INVOICE_STATUS: Record<string, string> = {
  PAID: 'bg-green-100 text-green-700',
  OPEN: 'bg-orange-100 text-orange-700',
  DRAFT: 'bg-gray-100 text-gray-600',
  VOID: 'bg-red-100 text-red-700',
  UNCOLLECTIBLE: 'bg-red-100 text-red-700',
};

export default function BillingView({ subscription, workspaceId }: Props) {
  const currentPlan = subscription?.plan ?? 'FREE';
  const limits = PLAN_LIMITS[currentPlan] ?? PLAN_LIMITS.FREE;
  const badge = PLAN_BADGES[currentPlan] ?? PLAN_BADGES.FREE;
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [upgrading, setUpgrading] = useState('');

  useEffect(() => {
    async function fetchBilling() {
      try {
        const res = await fetch('/api/billing');
        if (res.ok) {
          const data = await res.json();
          setInvoices(data.invoices ?? []);
        }
      } catch { /* ignore */ }
    }
    fetchBilling();
  }, [workspaceId]);

  async function handleUpgrade(plan: string) {
    setUpgrading(plan);
    try {
      const res = await fetch('/api/billing/upgrade', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } finally { setUpgrading(''); }
  }

  const plans = [
    {
      key: 'FREE', name: 'Gratis', price: 'Rp 0', period: '/bulan', popular: false,
      features: ['10 postingan/bulan', '1 akun sosial', '20 kredit AI', '1 anggota tim'],
    },
    {
      key: 'STARTER', name: 'Starter', price: 'Rp 149.000', period: '/bulan', popular: true,
      features: ['100 postingan/bulan', '3 akun sosial', '200 kredit AI', '3 anggota tim', 'Gaya penulisan kustom', 'Brand kit'],
    },
    {
      key: 'PRO', name: 'Pro', price: 'Rp 349.000', period: '/bulan', popular: false,
      features: ['Postingan tidak terbatas', '10 akun sosial', '1.000 kredit AI', '10 anggota tim', 'Semua fitur Starter', 'Auto Pilot Generator', 'Carousel Maker'],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Current Plan Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Paket Saat Ini</h3>
          <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold', badge.color)}>
            {badge.icon}{currentPlan}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Postingan/bulan', value: limitLabel(limits.posts) },
            { label: 'Akun sosial', value: limitLabel(limits.accounts) },
            { label: 'Kredit AI', value: limitLabel(limits.aiCredits) },
            { label: 'Anggota tim', value: limitLabel(limits.members) },
          ].map(item => (
            <div key={item.label} className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="mt-1 text-lg font-bold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
        {currentPlan === 'FREE' && (
          <p className="mt-4 text-sm text-orange-600 font-medium">💡 Upgrade untuk fitur lengkap dan kuota lebih besar</p>
        )}
      </div>

      {/* Plan Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map(plan => {
          const isCurrent = currentPlan === plan.key;
          return (
            <div key={plan.key} className={cn(
              'relative rounded-2xl border-2 bg-white p-6 shadow-sm transition-all hover:shadow-md',
              plan.popular ? 'border-[#FF5722]' : 'border-gray-200',
              isCurrent && 'ring-2 ring-orange-100'
            )}>
              {plan.popular && (
                <span className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF9800] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wide">
                  Populer
                </span>
              )}
              <h4 className="text-lg font-bold text-gray-900">{plan.name}</h4>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>
              <ul className="mt-5 space-y-2.5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 flex-shrink-0 text-green-500" />{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => !isCurrent && handleUpgrade(plan.key)}
                disabled={isCurrent || upgrading === plan.key}
                className={cn('mt-6 w-full rounded-xl py-3 text-sm font-semibold transition-all',
                  isCurrent ? 'bg-gray-100 text-gray-400 cursor-default'
                    : 'bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white shadow-md shadow-orange-200 hover:shadow-lg'
                )}>
                {isCurrent ? 'Paket Saat Ini' : upgrading === plan.key ? 'Memproses...' : `Mulai ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Invoice History */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900">Riwayat Tagihan</h3>
        </div>
        {invoices.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-400">Belum ada riwayat tagihan.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Jumlah</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-700">{new Date(inv.issuedAt).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{formatIDR(inv.amount)}</td>
                  <td className="px-6 py-3">
                    <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', INVOICE_STATUS[inv.status] ?? 'bg-gray-100 text-gray-600')}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button className="text-xs font-medium text-orange-600 hover:text-orange-700">Lihat</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
