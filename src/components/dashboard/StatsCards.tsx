'use client';

import { Users, TrendingUp, FileText, Eye } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

type StatsCardsProps = {
  postsThisMonth: number;
  workspaceId?: string;
};

type StatCardData = {
  label: string;
  value: string | number;
  change: string;
  icon: ReactNode;
  iconBg: string;
};

export default function StatsCards({ postsThisMonth, workspaceId }: StatsCardsProps) {
  const [stats, setStats] = useState({ totalFollowers: 0, engagementRate: 0, followersGained: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const url = workspaceId
          ? `/api/analytics/stats?workspaceId=${workspaceId}`
          : '/api/analytics/stats';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalFollowers: data.totalFollowers ?? 0,
            engagementRate: data.engagementRate ?? 0,
            followersGained: data.followersGained ?? 0,
          });
        }
      } catch { /* graceful fallback to 0 */ }
    }
    fetchStats();
  }, [workspaceId]);

  const cards: StatCardData[] = [
    {
      label: 'Total Pengikut',
      value: stats.totalFollowers.toLocaleString('id-ID'),
      change: `+${stats.followersGained}`,
      icon: <Users className="h-5 w-5 text-blue-600" />,
      iconBg: 'bg-blue-50',
    },
    {
      label: 'Tingkat Interaksi',
      value: `${stats.engagementRate}%`,
      change: '+0',
      icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
      iconBg: 'bg-emerald-50',
    },
    {
      label: 'Post Bulan Ini',
      value: postsThisMonth,
      change: `+${postsThisMonth}`,
      icon: <FileText className="h-5 w-5 text-orange-600" />,
      iconBg: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-200"
        >
          {/* Subtle gradient accent */}
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#FF5722] to-[#FF9800] opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
                {card.change} ↑
              </span>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconBg}`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
