'use client';

import { useState, useEffect } from 'react';
import { Smile, Sparkles, Plus } from 'lucide-react';

interface AutoPlugData {
  isEnabled: boolean;
  comment: string;
  delayAmount: number;
  delayUnit: string;
}

export default function AutoPlugTab({ workspaceId }: { workspaceId: string }) {
  const [data, setData] = useState<AutoPlugData>({ isEnabled: false, comment: '', delayAmount: 30, delayUnit: 'Menit' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch('/api/settings/autoplug');
        if (res.ok) {
          const d = await res.json();
          setData({ isEnabled: d.isEnabled ?? false, comment: d.comment ?? '', delayAmount: d.delayAmount ?? 30, delayUnit: d.delayUnit ?? 'Menit' });
        }
      } finally { setLoading(false); }
    }
    fetch_();
  }, [workspaceId]);

  async function handleToggle() {
    const v = !data.isEnabled;
    setData(p => ({ ...p, isEnabled: v }));
    await fetch('/api/settings/autoplug', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, isEnabled: v }),
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch('/api/settings/autoplug', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } finally { setSaving(false); }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Auto-Plug</h3>
            <p className="mt-1 text-sm text-gray-500">Balas secara otomatis ke post kamu jika mendapat engagement tinggi.</p>
          </div>
          <button onClick={handleToggle}
            className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${data.isEnabled ? 'bg-gradient-to-r from-[#FF5722] to-[#FF9800]' : 'bg-gray-300'}`}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${data.isEnabled ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
        </div>

        {/* Comment input */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-900">Komentar #1</label>
            <button className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700">
              <Sparkles className="h-3.5 w-3.5" />Generate with AI
            </button>
          </div>
          <div className="relative mt-2">
            <textarea value={data.comment} onChange={e => setData(p => ({ ...p, comment: e.target.value }))}
              rows={4}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm outline-none resize-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
              placeholder="Tulis komentar auto-plug kamu di sini..." />
            <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
              <Smile className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Delay */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Post setelah</span>
          <input type="number" value={data.delayAmount} onChange={e => setData(p => ({ ...p, delayAmount: parseInt(e.target.value) || 0 }))}
            className="w-20 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-center outline-none focus:border-orange-400" />
          <select value={data.delayUnit} onChange={e => setData(p => ({ ...p, delayUnit: e.target.value }))}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-orange-400">
            <option value="Menit">Menit</option>
            <option value="Jam">Jam</option>
          </select>
          <span className="text-sm text-gray-500">Setelah post dipublikasikan</span>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#FF5722] to-[#FF9800] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 hover:shadow-lg disabled:opacity-50">
            <Plus className="h-4 w-4" />{saving ? 'Menyimpan...' : 'TAMBAH KOMENTAR'}
          </button>
        </div>
      </div>
    </div>
  );
}
