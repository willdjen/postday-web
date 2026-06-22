'use client';

import { useState, useEffect, KeyboardEvent } from 'react';
import { Globe, Info, X, Sparkles } from 'lucide-react';

interface AISettingsData {
  autoPostEnabled: boolean;
  profileDescription: string | null;
  topics: string[];
  defaultLanguage: string;
  defaultTone: string;
}

export default function AISettingsTab({ workspaceId }: { workspaceId: string }) {
  const [data, setData] = useState<AISettingsData>({
    autoPostEnabled: false, profileDescription: '', topics: [],
    defaultLanguage: 'id', defaultTone: 'profesional',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [topicInput, setTopicInput] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings/ai');
        if (res.ok) {
          const s = await res.json();
          setData({
            autoPostEnabled: s.autoPostEnabled ?? false,
            profileDescription: s.profileDescription ?? '',
            topics: s.topics ?? [], defaultLanguage: s.defaultLanguage ?? 'id',
            defaultTone: s.defaultTone ?? 'profesional',
          });
        }
      } finally { setLoading(false); }
    }
    fetchSettings();
  }, [workspaceId]);

  async function handleToggle() {
    const v = !data.autoPostEnabled;
    setData(p => ({ ...p, autoPostEnabled: v }));
    await fetch('/api/settings/ai', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autoPostEnabled: v }),
    });
  }

  function handleTopicKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && topicInput.trim()) {
      e.preventDefault();
      if (!data.topics.includes(topicInput.trim()))
        setData(p => ({ ...p, topics: [...p.topics, topicInput.trim()] }));
      setTopicInput('');
    }
  }

  function removeTopic(t: string) {
    setData(p => ({ ...p, topics: p.topics.filter(x => x !== t) }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch('/api/settings/ai', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } finally { setSaving(false); }
  }

  const suggestedHashtags = data.topics.map(t =>
    '#' + t.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/gi, '')
  );

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">AI Pribadi Kamu</h3>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Globe className="h-4 w-4" />LANGUAGE
          </button>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-lg bg-blue-50 p-4">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
          <p className="text-sm text-blue-700">
            Setiap hari kami membuat post segar untuk setiap topik yang ditambahkan. Kamu bisa menemukan post ini di &ldquo;Auto-Pilot Posts&rdquo;
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Aktifkan Auto Post Generation</p>
            <p className="mt-0.5 text-xs text-gray-500">AI akan otomatis membuat post setiap hari</p>
          </div>
          <button onClick={handleToggle} className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${data.autoPostEnabled ? 'bg-gradient-to-r from-[#FF5722] to-[#FF9800]' : 'bg-gray-300'}`}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${data.autoPostEnabled ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-900">Siapa kamu di LinkedIn?</label>
          <input type="text" value={data.profileDescription ?? ''} onChange={e => setData(p => ({ ...p, profileDescription: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
            placeholder="Contoh: Founder startup teknologi..." />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-900">Topik apa yang kamu posting?</label>
          <p className="mt-1 text-xs text-gray-500">Tekan Enter untuk menambah topik</p>
          <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-2 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100">
            <div className="flex flex-wrap gap-2">
              {data.topics.map(topic => (
                <span key={topic} className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                  {topic}
                  <button onClick={() => removeTopic(topic)} className="rounded-full p-0.5 hover:bg-orange-200"><X className="h-3 w-3" /></button>
                </span>
              ))}
              <input type="text" value={topicInput} onChange={e => setTopicInput(e.target.value)} onKeyDown={handleTopicKeyDown}
                className="min-w-[120px] flex-1 bg-transparent px-2 py-1 text-sm text-gray-900 outline-none" placeholder="Tambah topik..." />
            </div>
          </div>
        </div>

        {suggestedHashtags.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-gray-500">Hashtag yang disarankan:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedHashtags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-600">
                  <Sparkles className="h-3 w-3" />{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <button onClick={handleSave} disabled={saving}
            className="rounded-lg bg-gradient-to-r from-[#FF5722] to-[#FF9800] px-8 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 hover:shadow-lg disabled:opacity-50">
            {saving ? 'Menyimpan...' : 'SIMPAN'}
          </button>
        </div>
      </div>
    </div>
  );
}
