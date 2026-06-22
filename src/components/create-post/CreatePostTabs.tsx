'use client';

import { useState } from 'react';
import { Sparkles, Lightbulb, LayoutGrid, FileStack, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

import PostGeneratorTab from './PostGeneratorTab';
import IdeaGeneratorTab from './IdeaGeneratorTab';
import DraftsTab from './DraftsTab';

type TabKey = 'generator' | 'ideas' | 'carousel' | 'drafts' | 'autopilot';

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'generator', label: 'Post Generator', icon: <Sparkles className="h-4 w-4" /> },
  { key: 'ideas', label: 'Ide Generator', icon: <Lightbulb className="h-4 w-4" /> },
  { key: 'carousel', label: 'Carousel Maker', icon: <LayoutGrid className="h-4 w-4" /> },
  { key: 'drafts', label: 'Draf', icon: <FileStack className="h-4 w-4" /> },
  { key: 'autopilot', label: 'Auto Pilot', icon: <Zap className="h-4 w-4" /> },
];

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-20">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
        <Zap className="h-7 w-7 text-amber-500" />
      </div>
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      <p className="mt-1 text-xs text-gray-400">Fitur ini sedang dalam pengembangan</p>
      <span className="mt-3 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
        Segera Hadir
      </span>
    </div>
  );
}

export default function CreatePostTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>('generator');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Buat Post</h1>
        <p className="mt-1 text-sm text-gray-500">
          Buat konten media sosial dengan bantuan AI
        </p>
      </div>

      {/* Pill tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
              activeTab === tab.key
                ? 'bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white shadow-md shadow-orange-200'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'generator' && <PostGeneratorTab />}
        {activeTab === 'ideas' && <IdeaGeneratorTab />}
        {activeTab === 'carousel' && <ComingSoon label="Carousel Maker" />}
        {activeTab === 'drafts' && <DraftsTab />}
        {activeTab === 'autopilot' && <ComingSoon label="Auto Pilot" />}
      </div>
    </div>
  );
}
