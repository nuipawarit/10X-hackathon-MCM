import { FlaskConical, Building2, Wand2, Send } from "lucide-react";
import { useNavigate } from "react-router";

const creativeGroups = [
  {
    persona: "Skincare Geeks",
    icon: FlaskConical,
    iconBg: "#E8F5E9",
    iconColor: "#00C853",
    theme: "Laboratory & Science",
    images: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1626498068278-fb9d0bfb6686?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3QlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcwMTg1ODUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
        title: "Clean Lab Setting",
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1761581555169-bebb655b7aa7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJvcmF0b3J5JTIwZ3JlZW4lMjBsZWFmJTIwc2NpZW5jZXxlbnwxfHx8fDE3NzAyMTUzNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        title: "Natural Ingredients",
      },
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1743309026555-97f545a08490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtZXRpYyUyMGJvdHRsZSUyMG1pbmltYWwlMjBjbGVhbnxlbnwxfHx8fDE3NzAyMTUzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
        title: "Scientific Precision",
      },
    ],
  },
  {
    persona: "City Commuter",
    icon: Building2,
    iconBg: "#E3F2FD",
    iconColor: "#0052CC",
    theme: "Urban & Lifestyle",
    images: [
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1713148312902-bd3105e11b2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zY3JlZW4lMjBjb3NtZXRpYyUyMGNpdHklMjBjYWZlfGVufDF8fHx8MTc3MDIxNTM2Nnww&ixlib=rb-4.1.0&q=80&w=1080",
        title: "Cafe Moment",
      },
      {
        id: 5,
        url: "https://images.unsplash.com/photo-1767346569686-09f75df48ad7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBwcm9kdWN0JTIwdXJiYW4lMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzcwMjE1MzcwfDA&ixlib=rb-4.1.0&q=80&w=1080",
        title: "City Lifestyle",
      },
      {
        id: 6,
        url: "https://images.unsplash.com/photo-1626498068278-fb9d0bfb6686?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3QlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzcwMTg1ODUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
        title: "On-the-Go",
      },
    ],
  },
];

export function CreativeStudio() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
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

      {/* Creative Groups */}
      <div className="space-y-8">
        {creativeGroups.map((group, index) => (
          <div
            key={index}
            className="bg-[#2A2A2E] rounded-lg p-6 shadow-lg"
          >
            {/* Group Header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: group.iconBg }}
              >
                <group.icon className="w-6 h-6" style={{ color: group.iconColor }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  Target: {group.persona}
                </h2>
                <p className="text-sm text-gray-400">{group.theme}</p>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-3 gap-4">
              {group.images.map((image) => (
                <div
                  key={image.id}
                  className="group relative bg-[#1A1A1E] rounded-lg overflow-hidden hover:ring-2 hover:ring-[#0052CC] transition-all"
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm font-medium">{image.title}</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <div className="px-2 py-1 bg-[#00C853] text-white text-xs rounded-full font-medium">
                      AI Generated
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Refine Prompt Section */}
      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.08)] p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Refine Creative Prompt</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="E.g., 'Add more natural lighting' or 'Include product benefits text'"
            className="flex-1 px-4 py-3 bg-[#F4F6F8] border border-[rgba(0,0,0,0.08)] rounded-lg text-[#1A1A1A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
          />
          <button className="px-6 py-3 bg-[#F4F6F8] text-[#1A1A1A] rounded-lg font-medium hover:bg-[#E0E4E8] transition-all border border-[rgba(0,0,0,0.08)]">
            <Wand2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => navigate("/distribution")}
          className="px-8 py-3 bg-[#0052CC] text-white rounded-lg font-medium hover:bg-[#003D99] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          Deploy to A/B Testing
        </button>
      </div>
    </div>
  );
}
