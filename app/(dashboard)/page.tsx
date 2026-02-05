'use client';

import { useRouter } from 'next/navigation';
import { AlertBanner } from '@/components/dashboard/alert-banner';
import { RoasChart } from '@/components/dashboard/roas-chart';
import { PerformanceTable } from '@/components/dashboard/performance-table';

const fallbackChartData = [
  { day: 'Jan 28', roas: 4.2 },
  { day: 'Jan 29', roas: 4.0 },
  { day: 'Jan 30', roas: 3.8 },
  { day: 'Jan 31', roas: 3.5 },
  { day: 'Feb 1', roas: 3.2 },
  { day: 'Feb 2', roas: 2.8 },
  { day: 'Feb 3', roas: 2.5 },
  { day: 'Feb 4', roas: 2.2 },
];

const fallbackPerformanceData = [
  {
    id: 1,
    thumbnail: 'https://images.unsplash.com/photo-1572534244649-8882340e53b5?w=200&h=200&fit=crop',
    name: 'Lifestyle Video',
    platform: 'Facebook',
    platformColor: '#1877F2',
    status: 'Low Performance',
    statusColor: '#FF5252',
    cpa: '$15.00',
    ctr: '0.8%',
    conversions: 24,
  },
  {
    id: 2,
    thumbnail: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop',
    name: 'Texture Zoom Image',
    platform: 'TikTok',
    platformColor: '#000000',
    status: 'High Performance',
    statusColor: '#00C853',
    cpa: '$4.50',
    ctr: '3.2%',
    conversions: 156,
  },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <AlertBanner
        title="Alert: Creative Fatigue Detected on Facebook Campaign"
        description="Your audience may be experiencing ad fatigue. ROAS has declined 47% over the past 7 days."
      />

      <RoasChart data={fallbackChartData} changePercent="-47%" />

      <PerformanceTable data={fallbackPerformanceData} />

      <div className="flex justify-center pt-4">
        <button
          onClick={() => router.push('/audience')}
          className="px-8 py-3 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-all shadow-sm hover:shadow-md"
        >
          Analyze Audience Insights
        </button>
      </div>
    </div>
  );
}
