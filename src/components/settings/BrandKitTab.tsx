'use client';

import { useState, useEffect } from 'react';
import { MoreHorizontal, Plus, Palette } from 'lucide-react';
import BrandKitModal from './BrandKitModal';

interface BrandKitData {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor?: string;
  fontHeading?: string;
  logoUrl?: string;
}

export default function BrandKitTab({ workspaceId }: { workspaceId: string }) {
  const [kits, setKits] = useState<BrandKitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchKits(); }, [workspaceId]);

  async function fetchKits() {
    try {
      const res = await fetch('/api/settings/brand-kits');
      if (res.ok) setKits(await res.json());
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
        <h3 className="text-lg font-semibold text-gray-900">Kelola Brand Kit Kamu</h3>
        <p className="mt-1 text-sm text-gray-500">Pilih brand kit untuk diterapkan otomatis ke carousel.</p>

        <div className="mt-6 space-y-3">
          {kits.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-10 text-center">
              <Palette className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="text-sm font-semibold text-gray-700">Belum ada Brand Kit</p>
              <p className="mt-1 text-xs text-gray-400">Buat brand kit pertama kamu</p>
            </div>
          ) : (
            kits.map(kit => (
              <div key={kit.id} className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 hover:bg-gray-100 transition-colors">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2" style={{ borderColor: kit.primaryColor, backgroundColor: kit.primaryColor + '20' }}>
                  <span className="text-sm font-bold" style={{ color: kit.primaryColor }}>
                    {kit.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{kit.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border border-gray-200" style={{ backgroundColor: kit.primaryColor }} />
                    {kit.secondaryColor && <span className="h-4 w-4 rounded-full border border-gray-200" style={{ backgroundColor: kit.secondaryColor }} />}
                    {kit.fontHeading && <span className="text-xs text-gray-400">{kit.fontHeading}</span>}
                  </div>
                </div>
                <button className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <button onClick={() => setShowModal(true)}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#FF5722] to-[#FF9800] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 hover:shadow-lg">
          <Plus className="h-4 w-4" />BUAT BRAND KIT BARU
        </button>
      </div>

      {showModal && <BrandKitModal onClose={() => setShowModal(false)} onCreated={() => { setShowModal(false); fetchKits(); }} />}
    </div>
  );
}
