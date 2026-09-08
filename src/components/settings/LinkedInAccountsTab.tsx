'use client';

import { useState, useEffect } from 'react';
import { Linkedin, ExternalLink, Calendar, MoreHorizontal, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialAccountData {
  id: string;
  accountName: string;
  accountHandle?: string;
  profileImageUrl?: string;
  platform: string;
  updatedAt: string;
  isActive: boolean;
  tokenExpiresAt?: string | null;
}

export default function LinkedInAccountsTab({ workspaceId }: { workspaceId: string }) {
  const [accounts, setAccounts] = useState<SocialAccountData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await fetch('/api/social-accounts');
        if (res.ok) {
          const data = await res.json();
          setAccounts(data.filter((a: SocialAccountData) => a.platform === 'LINKEDIN'));
        }
      } finally {
        setLoading(false);
      }
    }
    fetchAccounts();
  }, [workspaceId]);

  function isTokenExpired(expiresAt?: string | null) {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Akun LinkedIn</h3>
            <p className="mt-1 text-sm text-gray-500">
              Kelola akun LinkedIn yang terhubung ke workspace ini
            </p>
          </div>
          <a href="/api/social/linkedin/connect">
            <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#FF5722] to-[#FF9800] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition-all hover:shadow-lg hover:shadow-orange-300">
              <ExternalLink className="h-4 w-4" />
              Hubungkan Akun
            </button>
          </a>
        </div>

        <div className="mt-6 space-y-3">
          {accounts.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-10 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                <Linkedin className="h-7 w-7 text-blue-500" />
              </div>
              <p className="text-sm font-semibold text-gray-700">Belum ada akun LinkedIn</p>
              <p className="mt-1 text-xs text-gray-400">
                Hubungkan akun LinkedIn kamu untuk mulai menjadwalkan post
              </p>
              <a href="/api/social/linkedin/connect" className="mt-4 inline-block">
                <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#FF5722] to-[#FF9800] px-4 py-2 text-xs font-semibold text-white shadow-md">
                  <Linkedin className="h-3.5 w-3.5" />
                  TAMBAH AKUN
                </button>
              </a>
            </div>
          ) : (
            accounts.map((acc) => {
              const expired = isTokenExpired(acc.tokenExpiresAt);
              return (
                <div
                  key={acc.id}
                  className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50"
                >
                  {/* Avatar */}
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white">
                    {acc.accountName.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{acc.accountName}</p>
                    <p className="text-xs text-gray-500">{acc.accountHandle ?? 'LinkedIn'}</p>
                  </div>

                  {/* Updated date */}
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(acc.updatedAt).toLocaleDateString('id-ID')}
                  </div>

                  {/* Token status badge */}
                  <div className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                    expired
                      ? 'bg-red-100 text-red-700'
                      : acc.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                  )}>
                    {expired ? (
                      <><AlertCircle className="h-3 w-3" />Expired</>
                    ) : acc.isActive ? (
                      <><CheckCircle className="h-3 w-3" />Aktif</>
                    ) : (
                      'Nonaktif'
                    )}
                  </div>

                  {/* Re-connect if expired */}
                  {expired && (
                    <a href="/api/social/linkedin/connect">
                      <button className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 transition-colors hover:bg-orange-100">
                        Perbarui
                      </button>
                    </a>
                  )}

                  <button className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
