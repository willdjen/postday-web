'use client';

import { useMemo, useState } from 'react';
import { format, startOfToday, addDays, isSameDay } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { CalendarDays } from 'lucide-react';

type PostItem = {
  id: string;
  content: string;
  status: string;
  scheduledAt: string | null;
  createdAt: string;
};

type MiniCalendarProps = {
  posts: PostItem[];
};

const STATUS_DOT: Record<string, string> = {
  PUBLISHED: 'bg-green-500',
  SCHEDULED: 'bg-blue-500',
  PENDING: 'bg-orange-400',
  DRAFT: 'bg-gray-400',
  FAILED: 'bg-red-500',
  ARCHIVED: 'bg-gray-300',
};

export default function MiniCalendar({ posts }: MiniCalendarProps) {
  const today = startOfToday();
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(today, i - 1)), [today]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  function postsOnDay(day: Date) {
    return posts.filter((p) => {
      const date = p.scheduledAt ? new Date(p.scheduledAt) : new Date(p.createdAt);
      return isSameDay(date, day);
    });
  }

  const selectedPosts = selectedDay ? postsOnDay(selectedDay) : [];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-gray-400" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          Jadwal Minggu Ini
        </h3>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayPosts = postsOnDay(day);
          const isToday = isSameDay(day, today);
          const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDay(isSelected ? null : day)}
              className={`flex flex-col items-center gap-1.5 rounded-lg py-2 transition-all duration-150 ${
                isSelected
                  ? 'bg-[#FF5722]/10 ring-1 ring-[#FF5722]/40'
                  : isToday
                    ? 'bg-orange-50'
                    : 'hover:bg-gray-50'
              }`}
            >
              <span className="text-[10px] font-medium uppercase text-gray-400">
                {format(day, 'EEE', { locale: idLocale })}
              </span>
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  isToday ? 'bg-[#FF5722] text-white' : 'text-gray-700'
                }`}
              >
                {format(day, 'd')}
              </span>
              <div className="flex gap-0.5">
                {dayPosts.length > 0 ? (
                  dayPosts.slice(0, 3).map((p, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[p.status] ?? 'bg-gray-300'}`}
                    />
                  ))
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-transparent" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Post preview popover */}
      {selectedDay && selectedPosts.length > 0 && (
        <div className="mt-3 space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3 animate-in fade-in">
          <p className="text-xs font-medium text-gray-500">
            {format(selectedDay, 'dd MMMM yyyy', { locale: idLocale })}
          </p>
          {selectedPosts.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-xs shadow-sm"
            >
              <span className="line-clamp-1 max-w-[160px] text-gray-700">{p.content}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  p.status === 'PUBLISHED'
                    ? 'bg-green-100 text-green-700'
                    : p.status === 'SCHEDULED'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                }`}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {selectedDay && selectedPosts.length === 0 && (
        <div className="mt-3 rounded-lg border border-dashed border-gray-200 p-3 text-center">
          <p className="text-xs text-gray-400">Tidak ada post di tanggal ini</p>
        </div>
      )}
    </div>
  );
}
