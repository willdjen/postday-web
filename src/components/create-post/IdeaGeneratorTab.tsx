'use client';

import { useState } from 'react';
import { Sparkles, Loader2, ArrowRight, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function IdeaGeneratorTab() {
  const [topic, setTopic] = useState('');
  const [useNews, setUseNews] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ideas, setIdeas] = useState<string[]>([]);

  async function handleGenerate() {
    if (!topic.trim()) return;
    setIsLoading(true);
    setIdeas([]);

    try {
      const res = await fetch('/api/ai/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, useNews }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error ?? 'Terjadi kesalahan.');
        return;
      }

      setIdeas(data.ideas ?? []);
    } catch {
      alert('Gagal menghubungi server.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <label htmlFor="idea-topic" className="mb-1.5 block text-sm font-medium text-gray-700">
          Tambahkan satu topik atau industri
        </label>
        <input
          id="idea-topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Contoh: Fashion muslim, Kuliner Nusantara, Skincare lokal..."
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#FF5722] focus:outline-none focus:ring-2 focus:ring-[#FF5722]/20 transition-all"
        />

        {/* News checkbox */}
        <label className="mt-3 flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={useNews}
            onChange={(e) => setUseNews(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#FF5722] focus:ring-[#FF5722]"
          />
          <Newspaper className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            Gunakan berita terkini tentang topik di atas
          </span>
        </label>

        <button
          onClick={handleGenerate}
          disabled={!topic.trim() || isLoading}
          className={cn(
            'mt-4 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200',
            !topic.trim() || isLoading
              ? 'cursor-not-allowed bg-gray-300'
              : 'bg-gradient-to-r from-[#FF5722] to-[#FF9800] shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 active:scale-[0.98]'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Mencari ide...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Ide
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {ideas.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Ide untuk &quot;{topic}&quot;
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea, idx) => (
              <button
                key={idx}
                onClick={() => alert(`Buat post dari ide ini: "${idea}" — fitur segera hadir`)}
                className="group flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:border-[#FF5722]/30 hover:shadow-md"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-500 transition-transform group-hover:scale-110">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed text-gray-700">{idea}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#FF5722] opacity-0 transition-opacity group-hover:opacity-100">
                    Buat post dari ide ini
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
