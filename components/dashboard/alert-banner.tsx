'use client';

import { AlertTriangle } from 'lucide-react';

interface AlertBannerProps {
  title: string;
  description: string;
}

export function AlertBanner({ title, description }: AlertBannerProps) {
  return (
    <div className="bg-[#FFF3E0] border border-[#FF9800] rounded-lg p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-[#FF9800] flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h3 className="font-semibold text-[#1A1A1A] mb-1">{title}</h3>
        <p className="text-sm text-[#6B7280]">{description}</p>
      </div>
    </div>
  );
}
