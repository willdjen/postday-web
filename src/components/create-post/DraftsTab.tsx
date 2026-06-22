'use client';

import { useState, useEffect } from 'react';
import { FileStack, Edit3, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type Draft = {
  id: string;
  title: string | null;
  content: string;
  platform: string;
  createdAt: string;
  updatedAt: string;
};

export default function DraftsTab() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDrafts() {
      try {
        const res = await fetch('/api/drafts');
        if (res.ok) {
          const data = await res.json();
          setDrafts(data);
        }
      } catch {
        console.error('Gagal memuat draf');
      } finally {
        setIsLoading(false);
      }
    }
    fetchDrafts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        <span className="ml-2 text-sm text-gray-500">Memuat draf...</span>
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-16">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <FileStack className="h-7 w-7 text-gray-400" />
        </div>
        <p className="text-sm font-semibold text-gray-600">Belum ada draf</p>
        <p className="mt-1 text-xs text-gray-400">
          Draf akan muncul di sini setelah Anda menyimpannya
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {drafts.map((draft) => (
        <div
          key={draft.id}
          className="group rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-gray-200 hover:shadow-md"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase text-gray-500">
              {draft.platform}
            </span>
            <span className="text-xs text-gray-400">{formatDate(draft.createdAt)}</span>
          </div>

          {draft.title && (
            <h4 className="mb-1 text-sm font-semibold text-gray-800">{draft.title}</h4>
          )}

          <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-gray-600">
            {draft.content.length > 100 ? `${draft.content.slice(0, 100)}...` : draft.content}
          </p>

          <button
            onClick={() => alert(`Edit draf "${draft.title ?? draft.id}": segera hadir`)}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit Draf
          </button>
        </div>
      ))}
    </div>
  );
}
