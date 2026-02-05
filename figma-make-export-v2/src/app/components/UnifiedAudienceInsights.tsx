import { useState } from "react";
import { Users, Briefcase } from "lucide-react";
import { AudienceDiscovery } from "./AudienceDiscovery";
import { AudienceBusinessInsights } from "./AudienceBusinessInsights";

type ViewMode = "consumer" | "business";

export function UnifiedAudienceInsights() {
  const [viewMode, setViewMode] = useState<ViewMode>("consumer");

  return (
    <div className="space-y-6">
      {/* View Mode Selector */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-1 shadow-sm">
          <button
            onClick={() => setViewMode("consumer")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === "consumer"
                ? "bg-[#0052CC] text-white shadow-md"
                : "text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F4F6F8]"
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Consumer Insights</span>
            <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              viewMode === "consumer" 
                ? "bg-white/20 text-white" 
                : "bg-[#E8F1FF] text-[#0052CC]"
            }`}>
              Behavioral
            </div>
          </button>
          
          <button
            onClick={() => setViewMode("business")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              viewMode === "business"
                ? "bg-[#0052CC] text-white shadow-md"
                : "text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F4F6F8]"
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span>Business Insights</span>
            <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              viewMode === "business" 
                ? "bg-white/20 text-white" 
                : "bg-[#E8F5E9] text-[#00C853]"
            }`}>
              Lifecycle
            </div>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="transition-opacity duration-300">
        {viewMode === "consumer" ? (
          <AudienceDiscovery />
        ) : (
          <AudienceBusinessInsights />
        )}
      </div>
    </div>
  );
}
