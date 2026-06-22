'use client';

import { Trash2, Edit3, FileText } from 'lucide-react';
import { getStatusColor } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

type PostItem = {
  id: string;
  content: string;
  status: string;
  platform: string;
  scheduledAt: string | null;
  createdAt: string;
};

type RecentPostsProps = {
  posts: PostItem[];
};

const STATUS_LABELS: Record<string, string> = {
  PUBLISHED: 'Diterbitkan',
  SCHEDULED: 'Terjadwal',
  DRAFT: 'Draf',
  FAILED: 'Gagal',
  ARCHIVED: 'Diarsipkan',
};

export default function RecentPosts({ posts }: RecentPostsProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <FileText className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-500">Belum ada post terjadwal</p>
        <p className="mt-1 text-xs text-gray-400">Buat post pertamamu untuk mulai!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          Post Terbaru
        </h3>
        <span className="text-xs text-gray-400">{posts.length} post</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-200"
          >
            {/* Top accent bar */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#FF5722] to-[#FF9800] opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="mb-3 flex items-center justify-between">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(post.status)}`}
              >
                {STATUS_LABELS[post.status] ?? post.status}
              </span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase text-gray-500">
                {post.platform}
              </span>
            </div>

            <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-gray-700">
              {post.content.length > 100 ? `${post.content.slice(0, 100)}...` : post.content}
            </p>

            <p className="mb-3 text-xs text-gray-400">
              {formatDate(post.scheduledAt ?? post.createdAt)}
            </p>

            <div className="flex items-center gap-2 border-t border-gray-50 pt-3">
              <button
                onClick={() => alert('Edit post: segera hadir')}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => alert('Hapus post: segera hadir')}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
