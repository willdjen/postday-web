'use client';

import { useState, useMemo } from 'react';
import {
  startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  eachDayOfInterval, format, isSameDay, addWeeks, subWeeks,
  addMonths, subMonths, getDay,
} from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Check, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostData {
  id: string;
  title: string | null;
  content: string;
  status: string;
  scheduledAt: string | null;
  platform: string;
}

interface Props {
  posts: PostData[];
  workspaceId: string;
}

const DAY_NAMES = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

function statusColor(status: string) {
  switch (status) {
    case 'PUBLISHED': return 'bg-green-500';
    case 'SCHEDULED': return 'bg-blue-500';
    case 'FAILED': return 'bg-red-500';
    case 'DRAFT': return 'bg-orange-400';
    default: return 'bg-gray-400';
  }
}

function statusBadge(status: string) {
  switch (status) {
    case 'PUBLISHED': return 'bg-green-100 text-green-700';
    case 'SCHEDULED': return 'bg-blue-100 text-blue-700';
    case 'FAILED': return 'bg-red-100 text-red-700';
    case 'DRAFT': return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export default function CalendarView({ posts, workspaceId }: Props) {
  const [view, setView] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  function navigate(dir: 'prev' | 'next') {
    if (view === 'week') {
      setCurrentDate(dir === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
    } else {
      setCurrentDate(dir === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
    }
  }

  const periodLabel = useMemo(() => {
    if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(start, 'd', { locale: idLocale })} - ${format(end, 'd MMM yyyy', { locale: idLocale })}`;
    }
    return format(currentDate, 'MMMM yyyy', { locale: idLocale });
  }, [currentDate, view]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const monthDays = useMemo(() => {
    const mStart = startOfMonth(currentDate);
    const mEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(mStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(mEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentDate]);

  function postsForDay(day: Date) {
    return posts.filter(p => p.scheduledAt && isSameDay(new Date(p.scheduledAt), day));
  }

  const isToday = (day: Date) => isSameDay(day, new Date());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 capitalize">{periodLabel}</h1>
          <p className="mt-1 text-sm text-gray-500">Kalender konten kamu</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex rounded-lg border border-gray-200 bg-white p-0.5">
            <button onClick={() => setView('week')}
              className={cn('rounded-md px-4 py-1.5 text-sm font-medium transition-all', view === 'week' ? 'bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900')}>
              Minggu
            </button>
            <button onClick={() => setView('month')}
              className={cn('rounded-md px-4 py-1.5 text-sm font-medium transition-all', view === 'month' ? 'bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900')}>
              Bulan
            </button>
          </div>
          {/* Navigation */}
          <div className="flex items-center gap-1">
            <button onClick={() => navigate('prev')} className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => navigate('next')} className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* WEEK VIEW */}
      {view === 'week' && (
        <div className="grid grid-cols-7 gap-3">
          {weekDays.map((day, i) => {
            const dayPosts = postsForDay(day);
            return (
              <div key={i} className={cn('rounded-xl border bg-white p-3 min-h-[180px] transition-all', isToday(day) ? 'border-orange-300 ring-2 ring-orange-100' : 'border-gray-200')}>
                {/* Day header */}
                <div className="mb-3 text-center">
                  <p className="text-xs font-medium text-gray-400 uppercase">{DAY_NAMES[i]}</p>
                  <p className={cn('mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold', isToday(day) ? 'bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white' : 'text-gray-900')}>
                    {format(day, 'd')}
                  </p>
                </div>
                {/* Posts */}
                <div className="space-y-2">
                  {dayPosts.map(post => (
                    <div key={post.id} className="rounded-lg border border-gray-100 bg-gray-50 p-2 transition-colors hover:bg-gray-100">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={cn('h-2 w-2 rounded-full', statusColor(post.status))} />
                        <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-semibold', statusBadge(post.status))}>
                          {post.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 line-clamp-2">
                        {post.content.substring(0, 40)}{post.content.length > 40 ? '...' : ''}
                      </p>
                      {post.scheduledAt && (
                        <p className="mt-1 text-[10px] text-gray-400">
                          {format(new Date(post.scheduledAt), 'HH:mm')}
                        </p>
                      )}
                      <div className="mt-1.5 flex gap-1">
                        <button className="rounded bg-gradient-to-r from-[#FF5722] to-[#FF9800] px-2 py-0.5 text-[10px] font-semibold text-white">
                          <Check className="h-3 w-3 inline mr-0.5" />SETUJUI
                        </button>
                        <button className="rounded border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-medium text-gray-600">
                          <Pencil className="h-3 w-3 inline mr-0.5" />EDIT
                        </button>
                      </div>
                    </div>
                  ))}
                  {dayPosts.length === 0 && (
                    <p className="text-center text-[10px] text-gray-300 pt-4">Tidak ada post</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MONTH VIEW */}
      {view === 'month' && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
            {DAY_NAMES.map(d => (
              <div key={d} className="px-2 py-2.5 text-center text-xs font-semibold text-gray-500 uppercase">{d}</div>
            ))}
          </div>
          {/* Days grid */}
          <div className="grid grid-cols-7">
            {monthDays.map((day, i) => {
              const dayPosts = postsForDay(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              return (
                <div key={i}
                  className={cn('min-h-[100px] border-b border-r border-gray-100 p-2 transition-colors hover:bg-gray-50', !isCurrentMonth && 'bg-gray-50/50')}>
                  <p className={cn('text-sm font-medium', isToday(day) ? 'inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white' : isCurrentMonth ? 'text-gray-900' : 'text-gray-300')}>
                    {format(day, 'd')}
                  </p>
                  <div className="mt-1 space-y-1">
                    {dayPosts.slice(0, 3).map(post => (
                      <div key={post.id} className="flex items-center gap-1 rounded px-1 py-0.5 hover:bg-gray-100">
                        <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', statusColor(post.status))} />
                        <span className="text-[10px] text-gray-600 truncate">
                          {post.scheduledAt ? format(new Date(post.scheduledAt), 'HH:mm') : ''} {post.content.substring(0, 15)}
                        </span>
                      </div>
                    ))}
                    {dayPosts.length > 3 && (
                      <p className="text-[10px] text-gray-400 pl-1">+{dayPosts.length - 3} lainnya</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
