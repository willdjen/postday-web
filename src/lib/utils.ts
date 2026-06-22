import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(value: Date | string, pattern = 'dd MMM yyyy'): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return format(date, pattern, { locale: id });
}

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace('.0', '')}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace('.0', '')}K`;
  return value.toString();
}

export function getStatusColor(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized === 'published') return 'bg-green-100 text-green-700';
  if (normalized === 'scheduled') return 'bg-blue-100 text-blue-700';
  if (normalized === 'failed') return 'bg-red-100 text-red-700';
  if (normalized === 'archived') return 'bg-neutral-200 text-neutral-700';
  return 'bg-orange-100 text-orange-700';
}

export function getPlatformColor(platform: string): string {
  const normalized = platform.toLowerCase();
  if (normalized === 'instagram') return 'bg-pink-100 text-pink-700';
  if (normalized === 'facebook') return 'bg-blue-100 text-blue-700';
  if (normalized === 'linkedin') return 'bg-sky-100 text-sky-700';
  if (normalized === 'tiktok') return 'bg-neutral-900 text-white';
  if (normalized === 'youtube') return 'bg-red-100 text-red-700';
  if (normalized === 'x') return 'bg-neutral-900 text-white';
  return 'bg-neutral-100 text-neutral-700';
}
