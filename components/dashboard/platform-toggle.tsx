'use client';

import { PLATFORM_COLORS } from '@/lib/db/constants';

interface PlatformToggleProps {
  activePlatforms: string[];
  onToggle: (platform: string) => void;
}

const allPlatforms = ['meta', 'google', 'tiktok', 'shopee', 'lazada', 'line', 'lemon8'];

export function PlatformToggle({ activePlatforms, onToggle }: PlatformToggleProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {allPlatforms.map((key) => {
        const info = PLATFORM_COLORS[key];
        if (!info) return null;
        const active = activePlatforms.includes(key);
        return (
          <button
            key={key}
            onClick={() => onToggle(key)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
            style={{
              backgroundColor: active ? `${info.color}15` : '#F4F6F8',
              borderColor: active ? info.color : 'transparent',
              color: active ? info.color : '#6B7280',
            }}
          >
            {info.logo} {info.displayName}
          </button>
        );
      })}
    </div>
  );
}
