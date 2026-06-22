'use client';

import { useState, useEffect } from 'react';
import { Smile, Sparkles, X } from 'lucide-react';

interface CTAData {
  isEnabled: boolean;
  finishers: string[];
  label: string;
}

export default function CustomCTATab({ workspaceId }: { workspaceId: string }) {
  const [data, setData] = useState<CTAData>({
    isEnabled: false,
    finishers: ['Write a comment', 'Follow me', 'Check the Link', 'Check my Featured Section', 'Send me a Dm'],
    label: '',
  });
  const [loading, setLoading] = useState(true);
  const [finisherInput, setFinisherInput] = useState('');

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch('/api/settings/cta');
        if (res.ok) {
          const d = await res.json();
          setData({
            isEnabled: d.isEnabled ?? false,
            finishers: d.finishers?.length ? d.finishers : ['Write a comment', 'Follow me', 'Check the Link', 'Check my Featured Section', 'Send me a Dm'],
            label: d.label ?? '',
          });
        }
      } finally { setLoading(false); }
    }
    fetch_();
  }, [workspaceId]);

  async function handleToggle() {
    const v = !data.isEnabled;
    setData(p => ({ ...p, isEnabled: v }));
    await fetch('/api/settings/cta', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, isEnabled: v }),
    });
  }

  function removeFinisher(f: string) {
    const updated = { ...data, finishers: data.finishers.filter(x => x !== f) };
    setData(updated);
    fetch('/api/settings/cta', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
  }

  function addFinisher() {
    if (!finisherInput.trim() || data.finishers.includes(finisherInput.trim())) return;
    const updated = { ...data, finishers: [...data.finishers, finisherInput.trim()] };
    setData(updated);
    setFinisherInput('');
    fetch('/api/settings/cta', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
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
            <h3 className="text-lg font-semibold text-gray-900">CTA Kustom/Post Finishers</h3>
            <p className="mt-1 text-sm text-gray-500">Simpan CTA kustom dan gunakan dalam post kamu dengan mudah</p>
          </div>
          <button onClick={handleToggle}
            className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${data.isEnabled ? 'bg-gradient-to-r from-[#FF5722] to-[#FF9800]' : 'bg-gray-300'}`}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${data.isEnabled ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
        </div>

        {/* Post Finishers */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-900">Post Finishers</label>
            <button className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700">
              <Sparkles className="h-3.5 w-3.5" />Generate with AI
            </button>
          </div>

          <div className="relative mt-2">
            <input type="text" value={finisherInput} onChange={e => setFinisherInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFinisher(); } }}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
              placeholder="Ketik finisher baru dan tekan Enter..." />
            <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
              <Smile className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {data.finishers.map(f => (
              <span key={f} className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3 py-1.5 text-xs font-medium text-orange-700">
                {f}
                <button onClick={() => removeFinisher(f)} className="rounded-full p-0.5 hover:bg-orange-100">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
