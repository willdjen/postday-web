'use client';

import { useState } from 'react';
import {
  Settings,
  Linkedin,
  Brain,
  Users,
  Pen,
  Palette,
  MessageCircle,
  MousePointerClick,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import GeneralTab from './GeneralTab';
import LinkedInAccountsTab from './LinkedInAccountsTab';
import AISettingsTab from './AISettingsTab';
import WorkspaceMembersTab from './WorkspaceMembersTab';
import WritingStyleTab from './WritingStyleTab';
import BrandKitTab from './BrandKitTab';
import AutoPlugTab from './AutoPlugTab';
import CustomCTATab from './CustomCTATab';

type TabKey = 'general' | 'linkedin' | 'ai' | 'members' | 'writing' | 'brand' | 'autoplug' | 'cta';

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'general', label: 'Umum', icon: <Settings className="h-4 w-4" /> },
  { key: 'linkedin', label: 'Akun LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
  { key: 'ai', label: 'AI & Bahasa', icon: <Brain className="h-4 w-4" /> },
  { key: 'members', label: 'Anggota Workspace', icon: <Users className="h-4 w-4" /> },
  { key: 'writing', label: 'Gaya Penulisan', icon: <Pen className="h-4 w-4" /> },
  { key: 'brand', label: 'Brand Kit', icon: <Palette className="h-4 w-4" /> },
  { key: 'autoplug', label: 'Auto-plug Komentar', icon: <MessageCircle className="h-4 w-4" /> },
  { key: 'cta', label: 'CTA Kustom', icon: <MousePointerClick className="h-4 w-4" /> },
];

export default function SettingsTabs({ workspaceId }: { workspaceId: string }) {
  const [activeTab, setActiveTab] = useState<TabKey>('general');

  return (
    <div className="space-y-6">
      {/* Scrollable pill row */}
      <div className="overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
        <div className="flex gap-2 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap',
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
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'general' && <GeneralTab workspaceId={workspaceId} />}
        {activeTab === 'linkedin' && <LinkedInAccountsTab workspaceId={workspaceId} />}
        {activeTab === 'ai' && <AISettingsTab workspaceId={workspaceId} />}
        {activeTab === 'members' && <WorkspaceMembersTab workspaceId={workspaceId} />}
        {activeTab === 'writing' && <WritingStyleTab workspaceId={workspaceId} />}
        {activeTab === 'brand' && <BrandKitTab workspaceId={workspaceId} />}
        {activeTab === 'autoplug' && <AutoPlugTab workspaceId={workspaceId} />}
        {activeTab === 'cta' && <CustomCTATab workspaceId={workspaceId} />}
      </div>
    </div>
  );
}
