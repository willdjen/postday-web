'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const TONE_SUGGESTIONS = ['Friendly', 'Authoritative', 'Inspirational', 'Professional'];
const AUDIENCE_SUGGESTIONS = ['Corporate Executives', 'Freelancers & Creators'];
const CONTENT_SUGGESTIONS = ['How-to Guides', 'Case Studies', 'Personal Stories'];

function TagInput({ label, value, onChange, suggestions }: {
  label: string; value: string[]; onChange: (v: string[]) => void; suggestions?: string[];
}) {
  const [input, setInput] = useState('');
  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!value.includes(input.trim())) onChange([...value, input.trim()]);
      setInput('');
    }
  }
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1.5 rounded-lg border border-gray-200 bg-gray-50 p-2 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
        <div className="flex flex-wrap gap-1.5">
          {value.map(v => (
            <span key={v} className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">
              {v}<button onClick={() => onChange(value.filter(x => x !== v))} className="hover:bg-orange-200 rounded-full p-0.5"><X className="h-3 w-3" /></button>
            </span>
          ))}
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
            className="min-w-[100px] flex-1 bg-transparent px-1 py-0.5 text-sm outline-none" placeholder="Ketik dan Enter..." />
        </div>
      </div>
      {suggestions && suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions.filter(s => !value.includes(s)).map(s => (
            <button key={s} onClick={() => onChange([...value, s])}
              className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-700">+ {s}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function WritingStyleModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState('');
  const [toneOfVoice, setToneOfVoice] = useState<string[]>([]);
  const [targetAudience, setTargetAudience] = useState<string[]>([]);
  const [contentType, setContentType] = useState<string[]>([]);
  const [personas, setPersonas] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [personaInput, setPersonaInput] = useState('');

  async function handleCreate() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/settings/writing-styles', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, toneOfVoice, targetAudience, contentType, personas }),
      });
      if (res.ok) onCreated();
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Buat Gaya Penulisan Baru</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Gaya</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              placeholder='Writing like "Israel Stoltenberg"' />
          </div>
          <TagInput label="Tone of Voice" value={toneOfVoice} onChange={setToneOfVoice} suggestions={TONE_SUGGESTIONS} />
          <TagInput label="Target Audience" value={targetAudience} onChange={setTargetAudience} suggestions={AUDIENCE_SUGGESTIONS} />
          <TagInput label="Content Type" value={contentType} onChange={setContentType} suggestions={CONTENT_SUGGESTIONS} />
          <div>
            <label className="block text-sm font-medium text-gray-700">Persona-based preferences</label>
            <div className="mt-1.5 rounded-lg border border-gray-200 bg-gray-50 p-2 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
              <div className="flex flex-wrap gap-1.5">
                {personas.map(p => (
                  <span key={p} className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                    @{p}<button onClick={() => setPersonas(personas.filter(x => x !== p))} className="hover:bg-blue-200 rounded-full p-0.5"><X className="h-3 w-3" /></button>
                  </span>
                ))}
                <input type="text" value={personaInput} onChange={e => setPersonaInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && personaInput.trim()) {
                      e.preventDefault();
                      const v = personaInput.trim().replace(/^@/, '');
                      if (!personas.includes(v)) setPersonas([...personas, v]);
                      setPersonaInput('');
                    }
                  }}
                  className="min-w-[100px] flex-1 bg-transparent px-1 py-0.5 text-sm outline-none" placeholder="@handle..." />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button onClick={handleCreate} disabled={saving || !name.trim()}
            className="rounded-lg bg-gradient-to-r from-[#FF5722] to-[#FF9800] px-8 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 hover:shadow-lg disabled:opacity-50">
            {saving ? 'Membuat...' : 'BUAT'}
          </button>
        </div>
      </div>
    </div>
  );
}
