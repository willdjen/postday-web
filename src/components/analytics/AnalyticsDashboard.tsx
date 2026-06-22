'use client';

import { useState, useEffect } from 'react';
import { Users, TrendingUp, Eye, MessageCircle, Share2, ThumbsUp, Zap, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import GrowthChart from './GrowthChart';

interface AnalyticsDataPoint {
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  engagementRate: number;
  capturedAt: string;
}

interface Props {
  analytics: AnalyticsDataPoint[];
}

type TabKey = 'growth' | 'viral' | 'inspiration';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'growth', label: 'Pertumbuhan' },
  { key: 'viral', label: 'Postingan Viral' },
  { key: 'inspiration', label: 'Inspirasi' },
];

export default function AnalyticsDashboard({ analytics }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('growth');
  const [stats, setStats] = useState({
    totalFollowers: 0, followersGained: 0,
    engagementRate: 0, ctr: 0,
    totalImpressions: 0, totalReactions: 0,
    totalComments: 0, totalShares: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/analytics/stats');
        if (res.ok) setStats(await res.json());
      } catch { /* ignore */ }
    }
    fetchStats();
  }, []);

  const metricCards = [
    { label: 'Total Pengikut', value: stats.totalFollowers.toLocaleString('id-ID'), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pengikut Didapat', value: `+${stats.followersGained.toLocaleString('id-ID')}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Tingkat Engagement', value: `${stats.engagementRate}%`, icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Click Through Rate', value: `${stats.ctr}%`, icon: Eye, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const engagementCards = [
    { label: 'Tayangan', value: stats.totalImpressions.toLocaleString('id-ID'), icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Reaksi', value: stats.totalReactions.toLocaleString('id-ID'), icon: ThumbsUp, color: 'text-pink-600', bg: 'bg-pink-50' },
    { label: 'Komentar', value: stats.totalComments.toLocaleString('id-ID'), icon: MessageCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Dibagikan', value: stats.totalShares.toLocaleString('id-ID'), icon: Share2, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  // Placeholder follower rows
  const placeholderFollowers = [
    { name: 'Andi Pratama', job: 'Product Manager', company: 'PT Tokopedia', score: 92 },
    { name: 'Sari Dewi', job: 'Marketing Lead', company: 'Gojek', score: 88 },
    { name: 'Budi Santoso', job: 'CTO', company: 'Bukalapak', score: 85 },
    { name: 'Rina Wijaya', job: 'Content Creator', company: 'Freelancer', score: 79 },
    { name: 'Hadi Kurniawan', job: 'VP Engineering', company: 'Traveloka', score: 74 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analitik</h1>
          <p className="mt-1 text-sm text-gray-500">Pantau performa konten dan pertumbuhan audiens kamu</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Calendar className="h-4 w-4" />30 Hari Terakhir
          </button>
        </div>
      </div>

      {/* Tab pills */}
      <div className="flex gap-2">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={cn('rounded-full px-4 py-2 text-sm font-medium transition-all',
              activeTab === t.key ? 'bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white shadow-md shadow-orange-200'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50')}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Growth tab */}
      {activeTab === 'growth' && (
        <div className="space-y-6">
          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {metricCards.map(c => (
              <div key={c.label} className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-gray-200">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#FF5722] to-[#FF9800] opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500">{c.label}</p>
                    <p className="text-xl font-bold text-gray-900">{c.value}</p>
                  </div>
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', c.bg)}>
                    <c.icon className={cn('h-5 w-5', c.color)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Growth chart */}
          <GrowthChart analytics={analytics} />

          {/* Engagement row */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {engagementCards.map(c => (
              <div key={c.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', c.bg)}>
                    <c.icon className={cn('h-4 w-4', c.color)} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{c.label}</p>
                    <p className="text-lg font-bold text-gray-900">{c.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Follower table */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-gray-900">Pengikut Teratas</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Nama</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Jabatan</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 hidden sm:table-cell">Perusahaan</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">Skor Engagement</th>
                </tr>
              </thead>
              <tbody>
                {placeholderFollowers.map((f, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-xs font-bold text-white">
                          {f.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{f.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">{f.job}</td>
                    <td className="px-5 py-3 text-sm text-gray-600 hidden sm:table-cell">{f.company}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={cn('rounded-full px-2.5 py-1 text-xs font-bold',
                        f.score >= 90 ? 'bg-green-100 text-green-700' : f.score >= 80 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700')}>
                        {f.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Viral & Inspiration tabs — coming soon */}
      {(activeTab === 'viral' || activeTab === 'inspiration') && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-20">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
            <Zap className="h-7 w-7 text-amber-500" />
          </div>
          <p className="text-sm font-semibold text-gray-700">
            {activeTab === 'viral' ? 'Postingan Viral' : 'Inspirasi'}
          </p>
          <p className="mt-1 text-xs text-gray-400">Fitur ini sedang dalam pengembangan</p>
          <span className="mt-3 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Segera Hadir
          </span>
        </div>
      )}
    </div>
  );
}
