'use client';

interface PerformanceItem {
  id: number;
  thumbnail: string;
  name: string;
  platform: string;
  platformColor: string;
  status: string;
  statusColor: string;
  cpa: string;
  ctr: string;
  conversions: number;
}

interface PerformanceTableProps {
  data: PerformanceItem[];
}

export function PerformanceTable({ data }: PerformanceTableProps) {
  return (
    <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden">
      <div className="p-6 border-b border-[rgba(0,0,0,0.08)]">
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-1">
          Cross-Platform Creative Performance
        </h2>
        <p className="text-sm text-[#6B7280]">Compare creative performance across platforms</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F4F6F8]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Creative</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Platform</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">CPA</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">CTR</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Conversions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(0,0,0,0.08)]">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-[#F4F6F8] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <span className="font-medium text-[#1A1A1A]">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.platformColor }}
                    />
                    <span className="text-sm text-[#1A1A1A]">{item.platform}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${item.statusColor}15`,
                      color: item.statusColor,
                    }}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold" style={{ color: item.statusColor }}>
                    {item.cpa}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-[#1A1A1A]">{item.ctr}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-[#1A1A1A]">{item.conversions}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
