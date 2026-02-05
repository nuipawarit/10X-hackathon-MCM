'use client';

import { IconResolver } from '@/components/shared/icon-resolver';

interface PersonaCardProps {
  id?: string | number;
  title: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
  tags: string[];
  intent: number;
  description: string;
  demographics: string;
  interests: string[];
}

export function PersonaCard({
  title, iconName, iconBg, iconColor, tags, intent, description, demographics, interests,
}: PersonaCardProps) {
  return (
    <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6 border-b border-[rgba(0,0,0,0.08)]">
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: iconBg }}
          >
            <IconResolver name={iconName} className="w-8 h-8" style={{ color: iconColor }} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">{title}</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-[#F4F6F8] text-[#1A1A1A] text-xs font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-[#1A1A1A] mb-2">Description</h4>
          <p className="text-sm text-[#6B7280]">{description}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#1A1A1A] mb-2">Demographics</h4>
          <p className="text-sm text-[#6B7280]">{demographics}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#1A1A1A] mb-2">Key Interests</h4>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span key={interest} className="px-2 py-1 bg-[#E8F1FF] text-[#0052CC] text-xs rounded">
                {interest}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#1A1A1A] mb-2">Purchase Intent</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Likelihood to convert</span>
              <span className="font-semibold text-[#00C853]">{intent}%</span>
            </div>
            <div className="w-full bg-[#E0E4E8] rounded-full h-2 overflow-hidden">
              <div className="bg-[#00C853] h-full rounded-full transition-all" style={{ width: `${intent}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
