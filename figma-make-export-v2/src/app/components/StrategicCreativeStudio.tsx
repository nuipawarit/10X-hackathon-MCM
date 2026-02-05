import { Sparkles, ChevronDown, RefreshCw, ArrowRight, TrendingUp, Target, Zap, Check } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

// Business Goal options
const businessGoals = [
  { id: "vip", label: "Top Spenders (VIP)", stage: "Lifecycle Stage", tag: "High LTV Goal", color: "#9C27B0" },
  { id: "new", label: "New Customers", stage: "Lifecycle Stage", tag: "Low CAC Goal", color: "#0052CC" },
  { id: "returning", label: "Active/Returning", stage: "Lifecycle Stage", tag: "Retention Goal", color: "#00C853" },
  { id: "atrisk", label: "At-Risk / Drop-off", stage: "Lifecycle Stage", tag: "Win-Back Goal", color: "#FF9800" },
];

// Target Persona options
const targetPersonas = [
  { id: "geeks", label: "Skincare Geeks", segment: "Audience Segment", tag: "Interest: Ingredients", color: "#7B61FF" },
  { id: "minimalist", label: "Minimalist Buyers", segment: "Audience Segment", tag: "Interest: Simplicity", color: "#00BCD4" },
  { id: "luxury", label: "Luxury Seekers", segment: "Audience Segment", tag: "Interest: Premium", color: "#FFD700" },
  { id: "eco", label: "Eco-Conscious", segment: "Audience Segment", tag: "Interest: Sustainability", color: "#4CAF50" },
];

export function StrategicCreativeStudio() {
  const [selectedGoal, setSelectedGoal] = useState(businessGoals[0]);
  const [selectedPersona, setSelectedPersona] = useState(targetPersonas[0]);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => setIsRegenerating(false), 1500);
  };

  // AI Suggestions based on combination
  const getAISuggestion = () => {
    if (selectedGoal.id === "vip" && selectedPersona.id === "geeks") {
      return "AI Suggestion: Combine exclusive premium offers with deep-dive ingredient visuals to trigger high-value purchases.";
    }
    if (selectedGoal.id === "new" && selectedPersona.id === "minimalist") {
      return "AI Suggestion: Focus on simple, clean product shots with straightforward value propositions to reduce decision fatigue.";
    }
    if (selectedGoal.id === "atrisk" && selectedPersona.id === "eco") {
      return "AI Suggestion: Highlight sustainability credentials and limited-time offers to re-engage environmentally conscious customers.";
    }
    return `AI Suggestion: Tailor messaging to emphasize ${selectedGoal.tag.toLowerCase()} while appealing to ${selectedPersona.tag.toLowerCase()}.`;
  };

  return (
    <div className="max-w-[1800px] mx-auto h-[calc(100vh-100px)] flex gap-6">
      {/* Left Sidebar: Strategy Context */}
      <div className="w-80 flex-shrink-0 space-y-4">
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Campaign Context</h2>
          
          {/* Business Goal Selector */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
              Business Goal
            </label>
            <div className="relative">
              <select
                value={selectedGoal.id}
                onChange={(e) => setSelectedGoal(businessGoals.find(g => g.id === e.target.value) || businessGoals[0])}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-lg appearance-none cursor-pointer hover:border-[#0052CC] transition-colors text-sm font-medium text-[#1A1A1A]"
              >
                {businessGoals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280] pointer-events-none" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedGoal.color }}
              />
              <span className="text-xs text-[#6B7280]">{selectedGoal.stage}:</span>
              <div
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${selectedGoal.color}15`,
                  color: selectedGoal.color,
                }}
              >
                {selectedGoal.tag}
              </div>
            </div>
          </div>

          {/* Target Persona Selector */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">
              Target Persona
            </label>
            <div className="relative">
              <select
                value={selectedPersona.id}
                onChange={(e) => setSelectedPersona(targetPersonas.find(p => p.id === e.target.value) || targetPersonas[0])}
                className="w-full px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-lg appearance-none cursor-pointer hover:border-[#7B61FF] transition-colors text-sm font-medium text-[#1A1A1A]"
              >
                {targetPersonas.map((persona) => (
                  <option key={persona.id} value={persona.id}>
                    {persona.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280] pointer-events-none" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedPersona.color }}
              />
              <span className="text-xs text-[#6B7280]">{selectedPersona.segment}:</span>
              <div
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${selectedPersona.color}15`,
                  color: selectedPersona.color,
                }}
              >
                {selectedPersona.tag}
              </div>
            </div>
          </div>

          {/* AI Insight Box */}
          <div className="p-4 bg-gradient-to-br from-[#7B61FF]/10 to-[#0052CC]/10 rounded-lg border border-[#7B61FF]/30">
            <div className="flex items-start gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#7B61FF] flex-shrink-0 mt-0.5" />
              <span className="text-xs font-semibold text-[#7B61FF] uppercase tracking-wider">
                AI Strategy Fusion
              </span>
            </div>
            <p className="text-sm text-[#1A1A1A] leading-relaxed">
              {getAISuggestion()}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-4">
            Context Stats
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6B7280]">Segment Size</span>
              <span className="text-sm font-semibold text-[#1A1A1A]">120 customers</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6B7280]">Avg. Order Value</span>
              <span className="text-sm font-semibold text-[#00C853]">฿4,250</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6B7280]">Purchase Frequency</span>
              <span className="text-sm font-semibold text-[#1A1A1A]">3.2x/year</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas: AI Generation Board */}
      <div className="flex-1 flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#7B61FF]" />
              <h1 className="text-2xl font-semibold text-[#1A1A1A]">
                Generated Assets (Business + Interest Fusion)
              </h1>
            </div>
            <p className="text-sm text-[#6B7280]">
              AI-crafted creatives optimized for {selectedGoal.label} targeting {selectedPersona.label}
            </p>
          </div>
          
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[rgba(0,0,0,0.08)] rounded-lg hover:border-[#7B61FF] hover:bg-[#7B61FF]/5 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-[#7B61FF] ${isRegenerating ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium text-[#7B61FF]">
              {isRegenerating ? 'Generating...' : 'Regenerate All'}
            </span>
          </button>
        </div>

        {/* Generated Visuals Grid */}
        <div className="flex-1 grid grid-cols-2 gap-6 overflow-y-auto pb-6">
          {/* Visual 1: The Upsell Ad */}
          <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-md hover:shadow-xl transition-all overflow-hidden group">
            <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[#F4F6F8] to-white">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758426637739-fcb6eea3f4d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwc3Vuc2NyZWVuJTIwYm90dGxlcyUyMHNjaWVudGlmaWMlMjBsYWJvcmF0b3J5fGVufDF8fHx8MTc3MDI3MDUxN3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Premium VIP Bundle"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#9C27B0] rounded-full">
                    <Zap className="w-3 h-3 text-white" />
                    <span className="text-xs font-semibold text-white">Optimized for Upsell</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    Exclusive VIP Bundle:<br />The Ultimate Protection Science
                  </h3>
                  <p className="text-sm text-white/90">
                    Advanced SPF50+ PA++++ with Niacinamide Complex
                  </p>
                </div>
              </div>

              {/* Regenerate Button */}
              <button
                onClick={handleRegenerate}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-white"
              >
                <RefreshCw className="w-5 h-5 text-[#7B61FF]" />
              </button>
            </div>

            <div className="p-4 border-t border-[rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">AI Optimization</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-[#00C853]" />
                      <span className="text-xs text-[#00C853] font-medium">Premium Imagery</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-[#00C853]" />
                      <span className="text-xs text-[#00C853] font-medium">Science Appeal</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#6B7280]">Predicted CTR</p>
                  <p className="text-lg font-semibold text-[#7B61FF]">5.2%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual 2: The Loyalty Ad */}
          <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] shadow-md hover:shadow-xl transition-all overflow-hidden group">
            <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-[#F4F6F8] to-white">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1532642431870-2cd545b1c86c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHRleHR1cmUlMjBjbG9zZXVwJTIwc2NpZW50aWZpYyUyMGluZ3JlZGllbnRzfGVufDF8fHx8MTc3MDI3MDUxN3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Loyalty Membership"
                className="w-full h-full object-cover"
              />
              
              {/* Gold Card Overlay Simulation */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-40 bg-gradient-to-br from-[#FFD700] to-[#FFA000] rounded-lg shadow-2xl transform -rotate-6 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white text-xs font-semibold mb-1">VIP MEMBER</p>
                  <p className="text-white text-2xl font-bold">GOLD TIER</p>
                  <p className="text-white/80 text-xs mt-2">Exclusive Access</p>
                </div>
              </div>

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#9C27B0] rounded-full">
                    <Target className="w-3 h-3 text-white" />
                    <span className="text-xs font-semibold text-white">Optimized for High LTV</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    Unlock Your Tier:<br />0% Alcohol Formula
                  </h3>
                  <p className="text-sm text-white/90">
                    Pure Hyaluronic Acid + Ceramide Complex
                  </p>
                </div>
              </div>

              {/* Regenerate Button */}
              <button
                onClick={handleRegenerate}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-white"
              >
                <RefreshCw className="w-5 h-5 text-[#7B61FF]" />
              </button>
            </div>

            <div className="p-4 border-t border-[rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#6B7280] mb-1">AI Optimization</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-[#00C853]" />
                      <span className="text-xs text-[#00C853] font-medium">Ingredient Focus</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-[#00C853]" />
                      <span className="text-xs text-[#00C853] font-medium">Exclusivity</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#6B7280]">Predicted CTR</p>
                  <p className="text-lg font-semibold text-[#7B61FF]">4.9%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Performance Prediction */}
      <div className="w-80 flex-shrink-0 space-y-4">
        <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#00C853]" />
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Performance Prediction</h2>
          </div>

          {/* Score Card */}
          <div className="p-4 bg-gradient-to-br from-[#00C853]/10 to-[#0052CC]/10 rounded-lg border border-[#00C853]/30 mb-4">
            <p className="text-xs text-[#6B7280] uppercase tracking-wider mb-2">
              Predicted Conversion Rate
            </p>
            <div className="flex items-baseline gap-2 mb-2">
              <p className="text-4xl font-bold text-[#00C853]">4.8%</p>
              <span className="px-2 py-1 bg-[#00C853] text-white text-xs font-semibold rounded-full">
                Very High
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#6B7280]">
              <TrendingUp className="w-3 h-3" />
              <span>+2.3% vs campaign average</span>
            </div>
          </div>

          {/* Reasoning */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
              AI Reasoning
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#7B61FF]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#7B61FF]" />
                </div>
                <p className="text-sm text-[#1A1A1A]">
                  Matches VIP purchasing power with ingredient-focused content
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#7B61FF]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#7B61FF]" />
                </div>
                <p className="text-sm text-[#1A1A1A]">
                  Premium visual aesthetic aligns with high LTV segment preferences
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#7B61FF]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#7B61FF]" />
                </div>
                <p className="text-sm text-[#1A1A1A]">
                  Scientific messaging resonates with "Skincare Geeks" persona
                </p>
              </div>
            </div>
          </div>

          {/* Expected Impact */}
          <div className="p-4 bg-[#F4F6F8] rounded-lg mb-6">
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
              Expected Impact
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Revenue Lift</span>
                <span className="text-sm font-semibold text-[#00C853]">+₿28,500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">ROAS</span>
                <span className="text-sm font-semibold text-[#00C853]">6.2x</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Engagement</span>
                <span className="text-sm font-semibold text-[#1A1A1A]">+35%</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full px-6 py-4 bg-[#0052CC] text-white rounded-lg font-semibold hover:bg-[#003D99] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group">
            <span>Push to Ad Manager</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Secondary Actions */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="px-4 py-2 bg-white border border-[rgba(0,0,0,0.08)] rounded-lg text-sm font-medium text-[#1A1A1A] hover:border-[#0052CC] hover:bg-[#0052CC]/5 transition-all">
              Save Draft
            </button>
            <button className="px-4 py-2 bg-white border border-[rgba(0,0,0,0.08)] rounded-lg text-sm font-medium text-[#1A1A1A] hover:border-[#7B61FF] hover:bg-[#7B61FF]/5 transition-all">
              Export
            </button>
          </div>
        </div>

        {/* AI Learning Indicator */}
        <div className="bg-gradient-to-br from-[#7B61FF] to-[#9C27B0] rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" />
            <p className="text-xs font-semibold uppercase tracking-wider">AI Learning</p>
          </div>
          <p className="text-sm leading-relaxed opacity-90">
            This creative strategy has been used successfully 47 times with similar segments
          </p>
        </div>
      </div>
    </div>
  );
}
