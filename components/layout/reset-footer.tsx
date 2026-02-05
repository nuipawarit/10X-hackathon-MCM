'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export function ResetFooter() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleReset() {
    if (!confirm('Reset all demo data? This will clear the database and re-seed.')) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/db/reset', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setMessage('Reset complete!');
        setTimeout(() => window.location.reload(), 500);
      } else {
        setMessage(data.error?.message ?? 'Error');
      }
    } catch {
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="border-t border-[rgba(0,0,0,0.08)] py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <p className="text-xs text-[#6B7280]">MCM Demo</p>
        <div className="flex items-center gap-3">
          {message && <span className="text-xs text-[#6B7280]">{message}</span>}
          <button
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#6B7280] hover:text-[#1A1A1A] border border-[rgba(0,0,0,0.08)] rounded-lg hover:bg-white transition-all disabled:opacity-50"
          >
            <RotateCcw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Resetting...' : 'Reset Demo Data'}
          </button>
        </div>
      </div>
    </footer>
  );
}
