import { FlaskConical, Building2, Rocket, Users, Sparkles, Check, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

const adSets = [
  {
    id: 1,
    name: "Geek Ads Set",
    icon: FlaskConical,
    iconBg: "#E8F5E9",
    iconColor: "#00C853",
    creatives: 3,
    budget: "$2,500",
    persona: "Tech-Savvy Early Adopters",
  },
  {
    id: 2,
    name: "Commuter Ads Set",
    icon: Building2,
    iconBg: "#E3F2FD",
    iconColor: "#0052CC",
    creatives: 3,
    budget: "$2,500",
    persona: "Urban Professionals",
  },
];

const platforms = [
  {
    id: 1,
    name: "TikTok",
    color: "#000000",
    logo: "TT",
    reach: "450K",
  },
  {
    id: 2,
    name: "Lemon8",
    color: "#FFB800",
    logo: "L8",
    reach: "280K",
  },
  {
    id: 3,
    name: "Instagram",
    color: "#E1306C",
    logo: "IG",
    reach: "520K",
  },
  {
    id: 4,
    name: "Facebook",
    color: "#1877F2",
    logo: "FB",
    reach: "380K",
  },
];

// AI Suggestions for each ad set
const aiSuggestions = {
  1: {
    platforms: [1, 2], // TikTok, Lemon8
    reason: "High engagement from tech-savvy users aged 18-34 on short-form video platforms",
    confidence: 92,
  },
  2: {
    platforms: [3, 4], // Instagram, Facebook
    reason: "Peak activity during commute hours (7-9 AM, 5-7 PM) on Meta platforms",
    confidence: 88,
  },
};

export function DistributionFlow() {
  const navigate = useNavigate();
  
  // State to track user's platform selections for each ad set
  const [selections, setSelections] = useState<Record<number, number[]>>({
    1: [1, 2], // Geek Ads Set -> TikTok, Lemon8 (AI default)
    2: [3, 4], // Commuter Ads Set -> Instagram, Facebook (AI default)
  });

  // Toggle platform selection for an ad set
  const togglePlatform = (adSetId: number, platformId: number) => {
    setSelections(prev => {
      const current = prev[adSetId] || [];
      if (current.includes(platformId)) {
        return { ...prev, [adSetId]: current.filter(id => id !== platformId) };
      } else {
        return { ...prev, [adSetId]: [...current, platformId] };
      }
    });
  };

  // Check if current selection matches AI suggestion
  const matchesAISuggestion = (adSetId: number) => {
    const aiPlatforms = aiSuggestions[adSetId as keyof typeof aiSuggestions]?.platforms || [];
    const userPlatforms = selections[adSetId] || [];
    return JSON.stringify([...aiPlatforms].sort()) === JSON.stringify([...userPlatforms].sort());
  };

  // Reset to AI suggestion
  const resetToAI = (adSetId: number) => {
    const aiPlatforms = aiSuggestions[adSetId as keyof typeof aiSuggestions]?.platforms || [];
    setSelections(prev => ({ ...prev, [adSetId]: [...aiPlatforms] }));
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8F1FF] rounded-full mb-2">
          <Rocket className="w-4 h-4 text-[#0052CC]" />
          <span className="text-sm font-medium text-[#0052CC]">Campaign Distribution</span>
        </div>
        <h1 className="text-3xl font-semibold text-[#1A1A1A]">Campaign Distribution Flow</h1>
        <p className="text-[#6B7280] max-w-2xl mx-auto">
          AI-powered platform recommendations based on audience behavior and performance data
        </p>
      </div>

      {/* Distribution Cards */}
      <div className="space-y-6">
        {adSets.map((adSet) => {
          const suggestion = aiSuggestions[adSet.id as keyof typeof aiSuggestions];
          const isUsingAI = matchesAISuggestion(adSet.id);
          const selectedPlatforms = selections[adSet.id] || [];

          return (
            <div key={adSet.id} className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden">
              {/* Ad Set Header */}
              <div className="bg-gradient-to-r from-white to-[#F4F6F8] p-6 border-b border-[rgba(0,0,0,0.08)]">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: adSet.iconBg }}
                    >
                      <adSet.icon className="w-7 h-7" style={{ color: adSet.iconColor }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1">{adSet.name}</h3>
                      <p className="text-sm text-[#6B7280] mb-2">{adSet.persona}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-[#6B7280]">{adSet.creatives} Creatives</span>
                        <span className="text-[#6B7280]">•</span>
                        <span className="font-semibold text-[#0052CC]">{adSet.budget} Budget</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Status Badge */}
                  {isUsingAI ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E8F5E9] rounded-full">
                      <Sparkles className="w-4 h-4 text-[#00C853]" />
                      <span className="text-xs font-medium text-[#00C853]">Using AI Suggestion</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFF3E0] rounded-full">
                      <span className="text-xs font-medium text-[#FF9800]">Custom Selection</span>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Recommendation Section */}
              <div className="p-6 bg-[#F8FBFF] border-b border-[rgba(0,0,0,0.08)]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E8F1FF] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-[#0052CC]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-[#1A1A1A]">AI Recommendation</h4>
                      <div className="px-2 py-0.5 bg-[#E8F1FF] rounded text-xs font-medium text-[#0052CC]">
                        {suggestion.confidence}% Confidence
                      </div>
                    </div>
                    <p className="text-sm text-[#6B7280] mb-3">{suggestion.reason}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#6B7280]">Suggested Platforms:</span>
                      <div className="flex items-center gap-2">
                        {suggestion.platforms.map(platformId => {
                          const platform = platforms.find(p => p.id === platformId);
                          if (!platform) return null;
                          return (
                            <div
                              key={platformId}
                              className="px-2 py-1 rounded text-xs font-medium text-white"
                              style={{ backgroundColor: platform.color }}
                            >
                              {platform.name}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {!isUsingAI && (
                    <button
                      onClick={() => resetToAI(adSet.id)}
                      className="px-3 py-1.5 bg-[#0052CC] text-white rounded-lg text-xs font-medium hover:bg-[#003D99] transition-all"
                    >
                      Apply AI Suggestion
                    </button>
                  )}
                </div>
              </div>

              {/* Platform Selection Grid */}
              <div className="p-6">
                <h4 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-4">
                  Select Platforms to Deploy
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {platforms.map((platform) => {
                    const isSelected = selectedPlatforms.includes(platform.id);
                    const isAISuggested = suggestion.platforms.includes(platform.id);

                    return (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(adSet.id, platform.id)}
                        className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? "border-[rgba(0,82,204,0.5)] bg-[#F8FBFF] shadow-sm"
                            : "border-[rgba(0,0,0,0.08)] bg-white hover:border-[rgba(0,0,0,0.15)]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                            style={{ backgroundColor: platform.color }}
                          >
                            {platform.logo}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h5 className="font-semibold text-[#1A1A1A]">{platform.name}</h5>
                              {isSelected && (
                                <div className="w-5 h-5 rounded-full bg-[#0052CC] flex items-center justify-center flex-shrink-0">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                              <Users className="w-3 h-3" />
                              <span>Reach: {platform.reach}</span>
                            </div>
                            {isAISuggested && (
                              <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-[#E8F1FF] rounded-full">
                                <Sparkles className="w-3 h-3 text-[#0052CC]" />
                                <span className="text-xs font-medium text-[#0052CC]">AI Suggested</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <p className="text-sm text-[#6B7280] mb-2">Total Ad Sets</p>
          <p className="text-3xl font-semibold text-[#1A1A1A]">2</p>
        </div>
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <p className="text-sm text-[#6B7280] mb-2">Active Platforms</p>
          <p className="text-3xl font-semibold text-[#1A1A1A]">
            {new Set(Object.values(selections).flat()).size}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <p className="text-sm text-[#6B7280] mb-2">Estimated Reach</p>
          <p className="text-3xl font-semibold text-[#0052CC]">1.63M</p>
        </div>
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <p className="text-sm text-[#6B7280] mb-2">Total Budget</p>
          <p className="text-3xl font-semibold text-[#1A1A1A]">$5,000</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => navigate("/success")}
          className="px-8 py-3 bg-[#00C853] text-white rounded-lg font-medium hover:bg-[#00A843] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <Rocket className="w-5 h-5" />
          Launch Campaign
        </button>
      </div>
    </div>
  );
}
