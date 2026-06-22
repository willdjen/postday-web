'use client';

import { useState, useEffect, useRef } from 'react';
import { ImageIcon, Video, Mic, FileText, Archive, Upload, Search, X, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaAssetData {
  id: string;
  type: string;
  url: string;
  publicId: string | null;
  mimeType: string | null;
  sizeInBytes: number | null;
  createdAt: string;
}

type Tab = 'all' | 'scheduled' | 'published';
type Category = 'all' | 'IMAGE' | 'VIDEO' | 'CAROUSEL';

const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'scheduled', label: 'Terjadwal' },
  { key: 'published', label: 'Dipublikasikan' },
];

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'IMAGE', label: 'Gambar' },
  { key: 'VIDEO', label: 'Video' },
  { key: 'CAROUSEL', label: 'Carousel' },
];

const UPLOAD_TYPES = [
  { label: 'Gambar', icon: ImageIcon, accept: 'image/*', color: 'text-blue-600 bg-blue-50' },
  { label: 'Video', icon: Video, accept: 'video/*', color: 'text-purple-600 bg-purple-50' },
  { label: 'Audio', icon: Mic, accept: 'audio/*', color: 'text-pink-600 bg-pink-50' },
  { label: 'Dokumen', icon: FileText, accept: '.pdf,.doc,.docx', color: 'text-amber-600 bg-amber-50' },
  { label: 'Zip', icon: Archive, accept: '.zip,.rar', color: 'text-green-600 bg-green-50' },
];

function formatSize(bytes: number | null) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function typeBadge(type: string) {
  switch (type) {
    case 'IMAGE': return 'bg-blue-100 text-blue-700';
    case 'VIDEO': return 'bg-purple-100 text-purple-700';
    case 'CAROUSEL': return 'bg-amber-100 text-amber-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export default function MediaLibraryView({ workspaceId }: { workspaceId: string }) {
  const [assets, setAssets] = useState<MediaAssetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<Tab>('all');
  const [category, setCategory] = useState<Category>('all');
  const [preview, setPreview] = useState<MediaAssetData | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [acceptType, setAcceptType] = useState('');

  useEffect(() => { fetchAssets(); }, [workspaceId, tab, category]);

  async function fetchAssets() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.set('type', category);
      params.set('tab', tab);
      const res = await fetch(`/api/media?${params}`);
      if (res.ok) setAssets(await res.json());
    } finally { setLoading(false); }
  }

  function triggerUpload(accept: string) {
    setAcceptType(accept);
    setTimeout(() => fileRef.current?.click(), 50);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/media/upload', { method: 'POST', body: fd });
      if (res.ok) fetchAssets();
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept={acceptType} className="hidden" onChange={handleUpload} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Perpustakaan Media</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola semua aset media kamu di satu tempat</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {UPLOAD_TYPES.map(u => (
            <button key={u.label} onClick={() => triggerUpload(u.accept)} disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:shadow-sm hover:border-gray-300 disabled:opacity-50">
              <u.icon className="h-4 w-4" />{u.label}
            </button>
          ))}
        </div>
      </div>

      {uploading && (
        <div className="flex items-center gap-2 rounded-lg bg-orange-50 border border-orange-200 px-4 py-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-300 border-t-orange-600" />
          <span className="text-sm text-orange-700">Mengunggah file...</span>
        </div>
      )}

      {/* Tab pills */}
      <div className="flex gap-2">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={cn('rounded-full px-4 py-2 text-sm font-medium transition-all',
              tab === t.key ? 'bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white shadow-md shadow-orange-200'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50')}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setCategory(c.key)}
            className={cn('rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all',
              category === c.key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
        </div>
      ) : assets.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
            <Upload className="h-8 w-8 text-orange-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700">Belum ada media</p>
          <p className="mt-1 text-xs text-gray-400">Upload file pertama kamu menggunakan tombol di atas</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map(asset => (
            <div key={asset.id} onClick={() => setPreview(asset)}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg hover:border-gray-300">
              {/* Thumbnail */}
              <div className="relative aspect-square bg-gray-100">
                {asset.type === 'IMAGE' ? (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-300" />
                  </div>
                ) : asset.type === 'VIDEO' ? (
                  <div className="flex h-full items-center justify-center bg-purple-50">
                    <Video className="h-12 w-12 text-purple-300" />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center bg-amber-50">
                    <FileText className="h-12 w-12 text-amber-300" />
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="truncate text-xs font-medium text-gray-900">
                  {asset.publicId ?? 'Untitled'}
                </p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">{formatSize(asset.sizeInBytes)}</span>
                  <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-semibold', typeBadge(asset.type))}>
                    {asset.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setPreview(null)}>
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Detail Media</h3>
              <button onClick={() => setPreview(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center mb-4">
              {preview.type === 'IMAGE' ? <ImageIcon className="h-16 w-16 text-gray-300" />
                : preview.type === 'VIDEO' ? <Video className="h-16 w-16 text-purple-300" />
                : <FileText className="h-16 w-16 text-amber-300" />}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Nama</span><span className="font-medium text-gray-900">{preview.publicId ?? '—'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Tipe</span><span className={cn('rounded px-2 py-0.5 text-xs font-semibold', typeBadge(preview.type))}>{preview.type}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Ukuran</span><span className="font-medium text-gray-900">{formatSize(preview.sizeInBytes)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">MIME</span><span className="font-medium text-gray-900">{preview.mimeType ?? '—'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Diunggah</span><span className="font-medium text-gray-900">{new Date(preview.createdAt).toLocaleDateString('id-ID')}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
