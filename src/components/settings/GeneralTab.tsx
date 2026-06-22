'use client';

import { useState, useEffect } from 'react';
import { Linkedin, ExternalLink, UserPlus, Calendar } from 'lucide-react';

interface SocialAccountData {
  id: string;
  accountName: string;
  accountHandle?: string;
  profileImageUrl?: string;
  platform: string;
  updatedAt: string;
}

export default function GeneralTab({ workspaceId }: { workspaceId: string }) {
  const [name, setName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [accounts, setAccounts] = useState<SocialAccountData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [wsRes, accRes] = await Promise.all([
          fetch('/api/settings/workspace'),
          fetch('/api/social-accounts'),
        ]);
        if (wsRes.ok) {
          const ws = await wsRes.json();
          setName(ws.name);
          setOriginalName(ws.name);
        }
        if (accRes.ok) {
          const accs = await accRes.json();
          setAccounts(accs);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [workspaceId]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/settings/workspace', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOriginalName(updated.name);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Workspace Name Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Nama Workspace</h3>
        <p className="mt-1 text-sm text-gray-500">Gunakan nama agensi atau perusahaan kamu.</p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-4 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
          placeholder="Nama workspace..."
        />

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving || name === originalName}
            className="rounded-lg bg-gradient-to-r from-[#FF5722] to-[#FF9800] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition-all hover:shadow-lg hover:shadow-orange-300 disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'SIMPAN PERUBAHAN'}
          </button>
          <button
            onClick={() => setName(originalName)}
            disabled={name === originalName}
            className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            BATALKAN
          </button>
        </div>
      </div>

      {/* Connected LinkedIn Accounts Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Akun LinkedIn Terhubung</h3>
            <p className="mt-1 text-sm text-gray-500">
              Kelola akun LinkedIn yang terhubung ke workspace ini
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">
            <ExternalLink className="h-4 w-4" />
            CREATE LINK
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#FF5722] to-[#FF9800] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition-all hover:shadow-lg hover:shadow-orange-300">
            <UserPlus className="h-4 w-4" />
            TAMBAH AKUN
          </button>
        </div>

        {/* Accounts list */}
        <div className="mt-5 space-y-3">
          {accounts.length === 0 ? (
            <div className="rounded-lg bg-purple-50 p-4 text-center text-sm text-gray-500">
              <Linkedin className="mx-auto mb-2 h-8 w-8 text-purple-300" />
              Belum ada akun LinkedIn yang terhubung
            </div>
          ) : (
            accounts.map((acc) => (
              <div
                key={acc.id}
                className="flex items-center gap-4 rounded-lg bg-purple-50 p-4 transition-colors hover:bg-purple-100"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-200 text-purple-600">
                  <Linkedin className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{acc.accountName}</p>
                  <p className="text-xs text-gray-500">{acc.accountHandle ?? acc.platform}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar className="h-3.5 w-3.5" />
                  Updated on: {new Date(acc.updatedAt).toLocaleDateString('id-ID')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
