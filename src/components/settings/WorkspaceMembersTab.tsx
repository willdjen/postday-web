'use client';

import { useState, useEffect } from 'react';
import { Send, MoreHorizontal, Clock, UserPlus } from 'lucide-react';

interface MemberData {
  id: string;
  role: string;
  status: string;
  user: { id: string; name: string | null; email: string; image: string | null };
}

export default function WorkspaceMembersTab({ workspaceId }: { workspaceId: string }) {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMembers();
  }, [workspaceId]);

  async function fetchMembers() {
    try {
      const res = await fetch('/api/settings/members');
      if (res.ok) setMembers(await res.json());
    } finally { setLoading(false); }
  }

  async function handleInvite() {
    if (!email.trim()) return;
    setInviting(true); setError('');
    try {
      const res = await fetch('/api/settings/members/invite', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setEmail('');
        fetchMembers();
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal mengirim undangan');
      }
    } finally { setInviting(false); }
  }

  const accepted = members.filter(m => m.status === 'ACCEPTED');
  const pending = members.filter(m => m.status === 'PENDING');

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Anggota Workspace</h3>
        <p className="mt-1 text-sm text-gray-500">Kelola anggota dan atur level akses mereka di workspace kamu.</p>

        {/* Invite */}
        <div className="mt-5 flex gap-3">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleInvite()}
            className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
            placeholder="email@example.com" />
          <button onClick={handleInvite} disabled={inviting}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#FF5722] to-[#FF9800] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 hover:shadow-lg disabled:opacity-50">
            <Send className="h-4 w-4" />{inviting ? 'Mengirim...' : 'KIRIM UNDANGAN'}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        {/* Accepted members */}
        <div className="mt-6 space-y-2">
          {accepted.map(m => (
            <div key={m.id} className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 hover:bg-gray-100 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-bold text-white">
                {(m.user.name ?? m.user.email).charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{m.user.name ?? m.user.email}</p>
                <p className="text-xs text-gray-500">{m.user.email}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${m.role === 'OWNER' || m.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {m.role === 'OWNER' ? 'Owner' : m.role === 'ADMIN' ? 'Admin' : 'Editor'}
              </span>
              <button className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Pending invites */}
        {pending.length > 0 && (
          <div className="mt-6">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Clock className="h-4 w-4 text-amber-500" />Undangan Tertunda
            </h4>
            <div className="space-y-2">
              {pending.map(m => (
                <div key={m.id} className="flex items-center gap-4 rounded-lg border border-dashed border-amber-200 bg-amber-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-200 text-amber-700">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{m.user.email}</p>
                    <p className="text-xs text-amber-600">Menunggu konfirmasi</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">Pending</span>
                  <button className="rounded-lg p-1.5 text-gray-400 hover:bg-amber-100 hover:text-gray-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
