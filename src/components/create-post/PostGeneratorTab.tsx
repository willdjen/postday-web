'use client';

import { useState } from 'react';
import SchedulePostModal from '@/components/posts/SchedulePostModal';
import {
  Wand2,
  FileAudio,
  FileText,
  Link,
  Youtube,
  AlignLeft,
  Loader2,
  ArrowLeft,
  Copy,
  RefreshCw,
  Save,
  CalendarClock,
  Hash,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Mode = 'scratch' | 'audio' | 'pdf' | 'article' | 'youtube' | 'content';

const MODES: { key: Mode; label: string; desc: string; icon: React.ReactNode }[] = [
  { key: 'scratch', label: 'Buat dari Awal', desc: 'Tulis topik, AI bantu hasilkan', icon: <Wand2 className="h-6 w-6" /> },
  { key: 'audio', label: 'Dari Audio', desc: 'Upload file audio', icon: <FileAudio className="h-6 w-6" /> },
  { key: 'pdf', label: 'Dari PDF', desc: 'Ekstrak konten dari PDF', icon: <FileText className="h-6 w-6" /> },
  { key: 'article', label: 'Dari Artikel', desc: 'Paste link artikel', icon: <Link className="h-6 w-6" /> },
  { key: 'youtube', label: 'Dari YouTube', desc: 'Paste link video', icon: <Youtube className="h-6 w-6" /> },
  { key: 'content', label: 'Dari Konten', desc: 'Paste teks konten', icon: <AlignLeft className="h-6 w-6" /> },
];

const TONES = [
  'Friendly',
  'Authoritative',
  'Inspirational',
  'Professional',
  'Quirky',
  'Empathetic',
  'Bold',
  'Playful',
  'Minimalist',
  'Socratic',
];

type GeneratedResult = {
  content: string;
  hashtags: string[];
};

export default function PostGeneratorTab() {
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
  const [topic, setTopic] = useState('');
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  function toggleTone(tone: string) {
    setSelectedTones((prev) =>
      prev.includes(tone) ? prev.filter((t) => t !== tone) : [...prev, tone]
    );
  }

  async function handleGenerate() {
    if (!topic.trim() || !selectedMode) return;
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: selectedMode, topic, tones: selectedTones }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error ?? 'Terjadi kesalahan. Coba lagi.');
        return;
      }

      setResult(data);
      setEditedContent(data.content);
    } catch {
      alert('Gagal menghubungi server. Periksa koneksi Anda.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleCopy() {
    const text = editedContent + '\n\n' + (result?.hashtags?.map((h) => `#${h}`).join(' ') ?? '');
    navigator.clipboard.writeText(text);
    alert('Konten berhasil disalin!');
  }

  function handleReset() {
    setSelectedMode(null);
    setTopic('');
    setSelectedTones([]);
    setResult(null);
    setEditedContent('');
  }

  // SCREEN 1: Mode Selection
  if (!selectedMode) {
    return (
      <div>
        <p className="mb-4 text-sm text-gray-500">Pilih metode pembuatan konten:</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {MODES.map((mode) => (
            <button
              key={mode.key}
              onClick={() => setSelectedMode(mode.key)}
              className="group flex flex-col items-center gap-3 rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:border-[#FF5722]/30 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 text-[#FF5722] transition-transform group-hover:scale-110">
                {mode.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{mode.label}</p>
                <p className="mt-0.5 text-xs text-gray-400">{mode.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // SCREEN 2: Input + Generation
  return (
    <div className="space-y-5">
      {/* Back button */}
      <button
        onClick={handleReset}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke pilihan mode
      </button>

      {/* Mode badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-[#FF5722]">
        {MODES.find((m) => m.key === selectedMode)?.icon}
        {MODES.find((m) => m.key === selectedMode)?.label}
      </div>

      {/* Topic textarea */}
      <div>
        <label htmlFor="topic-input" className="mb-1.5 block text-sm font-medium text-gray-700">
          Tentang apa yang ingin Anda posting?
        </label>
        <textarea
          id="topic-input"
          rows={5}
          placeholder="Contoh: Tips memulai bisnis online untuk pemula..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#FF5722] focus:outline-none focus:ring-2 focus:ring-[#FF5722]/20 transition-all"
        />
      </div>

      {/* Tone selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Pilih tone (opsional)
        </label>
        <div className="flex flex-wrap gap-2">
          {TONES.map((tone) => {
            const isSelected = selectedTones.includes(tone);
            return (
              <button
                key={tone}
                onClick={() => toggleTone(tone)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
                  isSelected
                    ? 'border-purple-400 bg-purple-500 text-white shadow-sm shadow-purple-200'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                )}
              >
                {tone}
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!topic.trim() || isLoading}
        className={cn(
          'inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200',
          !topic.trim() || isLoading
            ? 'cursor-not-allowed bg-gray-300'
            : 'bg-gradient-to-r from-[#FF5722] to-[#FF9800] shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 active:scale-[0.98]'
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sedang membuat...
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" />
            Generate Post
          </>
        )}
      </button>

      {/* Result */}
      {result && (
        <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Hasil Generate</h3>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <Copy className="h-3.5 w-3.5" />
              Salin
            </button>
          </div>

          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={8}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-800 focus:border-[#FF5722] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]/20 transition-all"
          />

          {result.hashtags && result.hashtags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <Hash className="h-3.5 w-3.5 text-gray-400" />
              {result.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#FF5722] to-[#FF9800] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-md"
            >
              <CalendarClock className="h-3.5 w-3.5" />
              Jadwalkan
            </button>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Save className="h-3.5 w-3.5" />
              Simpan Draf
            </button>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', isLoading && 'animate-spin')} />
              Regenerate
            </button>
          </div>
        </div>
      )}

      {showScheduleModal && result && (
        <SchedulePostModal
          content={editedContent}
          hashtags={result.hashtags ?? []}
          onClose={() => setShowScheduleModal(false)}
        />
      )}
    </div>
  );
}
