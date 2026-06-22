'use client';

import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

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

export default function GrowthChart({ analytics }: Props) {
  const chartData = useMemo(() => {
    if (analytics.length === 0) {
      // Placeholder data: last 7 days with zero values
      return Array.from({ length: 7 }, (_, i) => ({
        date: format(subDays(new Date(), 6 - i), 'dd MMM', { locale: idLocale }),
        followers: 0,
        connections: 0,
      }));
    }

    return analytics
      .slice()
      .reverse()
      .map((a) => ({
        date: format(new Date(a.capturedAt), 'dd MMM', { locale: idLocale }),
        followers: a.reach,
        connections: Math.round(a.reach * 0.7), // simulated connections ratio
      }));
  }, [analytics]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Pertumbuhan Pengikut & Koneksi</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              fontSize: '13px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
          <Line
            type="monotone"
            dataKey="followers"
            stroke="#FF5722"
            strokeWidth={2}
            dot={false}
            name="Pengikut"
            activeDot={{ r: 4, fill: '#FF5722' }}
          />
          <Line
            type="monotone"
            dataKey="connections"
            stroke="#9747FF"
            strokeWidth={2}
            dot={false}
            name="Koneksi"
            activeDot={{ r: 4, fill: '#9747FF' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
