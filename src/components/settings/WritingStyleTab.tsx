'use client';

import { useState, useEffect } from 'react';
import { Check, Plus } from 'lucide-react';
import WritingStyleModal from './WritingStyleModal';

interface StyleData {
  id: string;
  name: string;
  isDefault: boolean;
  toneOfVoice: string[];
  targetAudience: string[];
  contentType: string[];
}

export default function WritingStyleTab({ workspaceId }: { workspaceId: string }) {
  const [styles, setStyles] = useState<StyleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchStyles(); }, [workspaceId]);

  async function fetchStyles() {
    try {
      const res = await fetch('/api/settings/writing-styles');
      if (res.ok) setStyles(await res.json());
    } finally { setLoading(false); }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Kelola Gaya Penulisan Konten Kamu</h3>
        <p className="mt-1 text-sm text-gray-500">Pilih gaya penulisan default atau buat yang baru.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {styles.map(style => (
            <div key={style.id}
              className={`relative cursor-pointer rounded-xl border-2 p-5 transition-all hover:shadow-md ${style.isDefault ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white hover:border-orange-200'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{style.name}</p>
                  {style.toneOfVoice.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {style.toneOfVoice.map(t => (
                        <span key={t} className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-600">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                {style.isDefault && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setShowModal(true)}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#FF5722] to-[#FF9800] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 hover:shadow-lg">
          <Plus className="h-4 w-4" />BUAT GAYA PENULISAN BARU
        </button>
      </div>

      {showModal && <WritingStyleModal onClose={() => setShowModal(false)} onCreated={() => { setShowModal(false); fetchStyles(); }} />}
    </div>
  );
}
