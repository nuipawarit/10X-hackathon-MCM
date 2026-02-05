export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { FlaskConical, Building2, Wand2, Send } from 'lucide-react';
import { PromptInput } from '@/components/creative/prompt-input';
import { getActiveCampaign, getCampaignCreatives } from '@/lib/db/queries';

const PERSONA_ICONS: Record<string, typeof FlaskConical> = { FlaskConical, Building2 };

export default async function CreativePage() {
  const campaign = await getActiveCampaign();
  const creativeGroups = campaign ? await getCampaignCreatives(campaign.id) : [];

  if (creativeGroups.length === 0) {
    return (
      <div className="max-w-7xl mx-auto text-center py-16 text-[#6B7280]">
        <p className="text-lg font-medium">No data available</p>
        <p className="text-sm mt-1">Create a campaign to get started</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8F5E9] rounded-full mb-2">
          <Wand2 className="w-4 h-4 text-[#00C853]" />
          <span className="text-sm font-medium text-[#00C853]">AI-Generated Creatives</span>
        </div>
        <h1 className="text-3xl font-semibold text-[#1A1A1A]">Generative AI Creative Studio</h1>
        <p className="text-[#6B7280] max-w-2xl mx-auto">
          Tailored ad creatives generated for each persona using AI
        </p>
      </div>

      <div className="space-y-8">
        {creativeGroups.map((group, index) => {
          const Icon = PERSONA_ICONS[group.iconName] ?? FlaskConical;
          return (
            <div key={index} className="bg-[#2A2A2E] rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: group.iconBg }}>
                  <Icon className="w-6 h-6" style={{ color: group.iconColor }} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">Target: {group.persona}</h2>
                  <p className="text-sm text-gray-400">{group.theme}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {group.images.map((image) => (
                  <div key={image.id} className="group relative bg-[#1A1A1E] rounded-lg overflow-hidden hover:ring-2 hover:ring-[#0052CC] transition-all">
                    <img src={image.url} alt={image.title} className="w-full h-64 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white text-sm font-medium">{image.title}</p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <div className="px-2 py-1 bg-[#00C853] text-white text-xs rounded-full font-medium">AI Generated</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <PromptInput />

      <div className="flex justify-center pt-4">
        <Link
          href="/distribution"
          className="px-8 py-3 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          Deploy to A/B Testing
        </Link>
      </div>
    </div>
  );
}
