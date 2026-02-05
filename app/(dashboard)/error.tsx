'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto mt-20 text-center space-y-6">
      <div className="w-16 h-16 bg-[#FFF3E0] rounded-full flex items-center justify-center mx-auto">
        <AlertTriangle className="w-8 h-8 text-[#FF9800]" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-[#1A1A1A]">Something went wrong</h2>
        <p className="text-sm text-[#6B7280]">
          An unexpected error occurred. Please try again.
        </p>
      </div>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-all"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}
