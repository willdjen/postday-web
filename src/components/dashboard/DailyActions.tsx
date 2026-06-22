'use client';

import Link from 'next/link';
import { Pencil, MessageCircle } from 'lucide-react';

export default function DailyActions() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
        Aksi Harian
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Buat Post — active */}
        <Link
          href="/create-post"
          className="group flex flex-col items-center gap-3 rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-5 transition-all duration-200 hover:border-[#FF5722]/30 hover:shadow-md"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF5722] to-[#FF9800] text-white shadow-sm transition-transform group-hover:scale-110">
            <Pencil className="h-5 w-5" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">Buat Post</p>
            <p className="mt-0.5 text-xs text-gray-500">Tulis konten baru</p>
          </div>
        </Link>

        {/* Komentar — disabled */}
        <div className="relative flex flex-col items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-5 opacity-60 cursor-not-allowed">
          <span className="absolute -right-1 -top-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 shadow-sm">
            Segera Hadir
          </span>
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-200 text-gray-500">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-500">Komentar</p>
            <p className="mt-0.5 text-xs text-gray-400">Balas komentar post</p>
          </div>
        </div>
      </div>
    </div>
  );
}
