'use client';

import { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface Props { onClose: () => void; onCreated: () => void; }

const PRESET_COLORS = ['#0D9488', '#3B82F6', '#F97316', '#EF4444', '#22C55E', '#6366F1', '#EC4899', '#8B5CF6'];

export default function BrandKitModal({ onClose, onCreated }: Props) {
  const [profileName, setProfileName] = useState('');
  const [profileHandle, setProfileHandle] = useState('');
  const [primaryFont, setPrimaryFont] = useState('');
  const [secondaryFont, setSecondaryFont] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#FF5722');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [otherColor, setOtherColor] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!profileName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/settings/brand-kits', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileName, profileHandle, primaryColor, secondaryColor: secondaryColor || undefined, accentColor: otherColor || undefined, primaryFont: primaryFont || undefined, secondaryFont: secondaryFont || undefined }),
      });
      if (res.ok) onCreated();
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Buat Brand Kit Baru</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Name</label>
            <input type="text" value={profileName} onChange={e => setProfileName(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Handle</label>
            <input type="text" value={profileHandle} onChange={e => setProfileHandle(e.target.value)} placeholder="@handle"
              className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Primary Font Family</label>
              <input type="text" value={primaryFont} onChange={e => setPrimaryFont(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Secondary Font Family</label>
              <input type="text" value={secondaryFont} onChange={e => setSecondaryFont(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
            </div>
          </div>

          {/* Brand Prime Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand Prime Color</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_COLORS.map(c => (
                <button key={c} onClick={() => setPrimaryColor(c)}
                  className={`h-8 w-8 rounded-lg border-2 transition-transform hover:scale-110 ${primaryColor === c ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-orange-400" />
              <div className="h-9 w-9 rounded-lg border border-gray-200" style={{ backgroundColor: primaryColor }} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Secondary Color</label>
            <div className="mt-1.5 flex items-center gap-2">
              <input type="text" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} placeholder="#000000"
                className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-orange-400" />
              <div className="h-9 w-9 rounded-lg border border-gray-200" style={{ backgroundColor: secondaryColor || '#fff' }} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Other Color</label>
            <div className="mt-1.5 flex items-center gap-2">
              <input type="text" value={otherColor} onChange={e => setOtherColor(e.target.value)} placeholder="#000000"
                className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-orange-400" />
              <div className="h-9 w-9 rounded-lg border border-gray-200" style={{ backgroundColor: otherColor || '#fff' }} />
            </div>
          </div>

          {/* Upload Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload Logo File</label>
            <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
              <Upload className="mx-auto mb-2 h-8 w-8 text-gray-300" />
              <p className="text-xs text-gray-500">Drag & drop file di sini</p>
              <button className="mt-2 rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                Klik untuk upload
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button onClick={handleCreate} disabled={saving || !profileName.trim()}
            className="rounded-lg bg-gradient-to-r from-[#FF5722] to-[#FF9800] px-8 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 hover:shadow-lg disabled:opacity-50">
            {saving ? 'Membuat...' : 'BUAT'}
          </button>
        </div>
      </div>
    </div>
  );
}
