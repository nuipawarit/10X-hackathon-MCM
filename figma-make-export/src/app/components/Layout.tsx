import { Outlet, Link, useLocation } from "react-router";
import { BarChart3 } from "lucide-react";

export function Layout() {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Diagnosis", exact: true },
    { path: "/audience", label: "Audience Insights" },
    { path: "/creative", label: "Creative Studio" },
    { path: "/distribution", label: "Distribution" },
    { path: "/success", label: "Results" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      {/* Header */}
      <header className="bg-white border-b border-[rgba(0,0,0,0.08)]">
        <div className="mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0052CC] rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[#1A1A1A]">MCM</h1>
                <p className="text-xs text-[#6B7280]">Marketing AI Platform</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex gap-1">
              {navItems.map((item) => {
                const isActive = item.exact 
                  ? location.pathname === item.path
                  : location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#0052CC] text-white"
                        : "text-[#6B7280] hover:bg-[#F4F6F8] hover:text-[#1A1A1A]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
