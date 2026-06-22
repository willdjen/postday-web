'use client';

import { useState } from 'react';
import { X, CalendarClock, Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  content: string;
  hashtags: string[];
  onClose: () => void;
}

const PLATFORMS = [
  { key: 'linkedin', label: 'LinkedIn', available: true },
  { key: 'instagram', label: 'Instagram', available: false },
  { key: 'facebook', label: 'Facebook', available: false },
];

export default function SchedulePostModal({ content, hashtags, onClose }: Props) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [platforms, setPlatforms] = useState<string[]>(['linkedin']);
  const [scheduling, setScheduling] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  function togglePlatform(key: string) {
    setPlatforms(p => p.includes(key) ? p.filter(x => x !== key) : [...p, key]);
  }

  async function handleSchedule() {
    if (!date) { setError('Pilih tanggal terlebih dahulu'); return; }
    setScheduling(true); setError('');
    try {
      const scheduledAt = new Date(`${date}T${time}:00`).toISOString();
      const res = await fetch('/api/posts/schedule', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, hashtags, scheduledAt }),
      });
      if (res.ok) {
        setSuccess('Post berhasil dijadwalkan! 🎉');
        setTimeout(onClose, 1500);
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal menjadwalkan post');
      }
    } finally { setScheduling(false); }
  }

  async function handleSaveDraft() {
    setSavingDraft(true); setError('');
    try {
      const res = await fetch('/api/posts/drafts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, hashtags }),
      });
      if (res.ok) {
        setSuccess('Draf berhasil disimpan! ✅');
        setTimeout(onClose, 1500);
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal menyimpan draf');
      }
    } finally { setSavingDraft(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Jadwalkan Post</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="py-10 text-center">
            <p className="text-lg font-semibold text-gray-900">{success}</p>
          </div>
        ) : (
          <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Preview Konten</label>
              <textarea readOnly value={content} rows={4}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 resize-none" />
              {hashtags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {hashtags.map(h => (
                    <span key={h} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">#{h}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Platform */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p => (
                  <button key={p.key} onClick={() => p.available && togglePlatform(p.key)}
                    disabled={!p.available}
                    className={cn('rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                      !p.available ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                        : platforms.includes(p.key) ? 'border-orange-400 bg-orange-50 text-orange-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300')}>
                    {p.label}
                    {!p.available && <span className="ml-1 text-[10px]">(Segera Hadir)</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal</label>
                <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Waktu</label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button onClick={handleSchedule} disabled={scheduling || savingDraft}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF9800] py-3 text-sm font-semibold text-white shadow-md shadow-orange-200 hover:shadow-lg disabled:opacity-50">
                {scheduling ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarClock className="h-4 w-4" />}
                {scheduling ? 'Menjadwalkan...' : 'JADWALKAN'}
              </button>
              <button onClick={handleSaveDraft} disabled={scheduling || savingDraft}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                {savingDraft ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                SIMPAN DRAF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
