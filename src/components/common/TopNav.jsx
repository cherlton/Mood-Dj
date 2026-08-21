import React, { useState } from "react";
import { ArrowLeft, Search, Sparkles, Check } from "lucide-react";

export default function TopNav({
  activeTab = "curated",
  setActiveTab,
  onBack,
  currentTime,
  onQuickShuffle,
  onSearchFocus,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  showBackButton = false
}) {
  const [hoveredDisabledTab, setHoveredDisabledTab] = useState(null);

  const tabs = [
    { id: "curated", label: "Curated Hits", available: true },
    { id: "accurate", label: "Accurate Hits", available: true },
    { id: "new", label: "New Releases", available: false },
    { id: "news", label: "AI Vibe Feed", available: false }
  ];

  return (
    <header className="h-14 px-4 sm:px-6 bg-[#0d0e12]/80 backdrop-blur-md border-b border-[#1e2029] sticky top-0 z-20 flex items-center justify-between gap-3 select-none">
      {/* Left: Navigation & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {showBackButton && (
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-[#181a24] hover:bg-[#222533] border border-[#2c3040] text-gray-300 hover:text-white flex items-center justify-center transition-all duration-150"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium truncate">
          <span className="hover:text-white cursor-pointer transition-colors">Mood-DJ</span>
          <span>&gt;</span>
          <span className="text-white font-semibold flex items-center gap-1 truncate">
            <Sparkles className="w-3 h-3 text-[#ff7a45]" />
            AI Sound Curator
          </span>
        </div>
      </div>

      {/* Center: Tabs with Disabled & Coming Soon Tooltips */}
      <div className="hidden lg:flex items-center gap-1 bg-[#13141c] p-1 rounded-lg border border-[#1e202a]">
        {tabs.map((tab) => {
          const isActive = (activeTab === tab.id) || (activeTab === "Curated" && tab.id === "curated");
          
          if (!tab.available) {
            return (
              <div 
                key={tab.id} 
                className="relative"
                onMouseEnter={() => setHoveredDisabledTab(tab.id)}
                onMouseLeave={() => setHoveredDisabledTab(null)}
              >
                <button
                  type="button"
                  disabled
                  className="px-3 py-1 rounded-md text-xs font-medium text-gray-600 cursor-not-allowed transition-all opacity-60 flex items-center gap-1"
                >
                  {tab.label}
                </button>
                {hoveredDisabledTab === tab.id && (
                  <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 bg-[#1b1e2a] border border-[#2d3142] text-white text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-2xl z-30 whitespace-nowrap animate-in fade-in zoom-in-95 pointer-events-none">
                    <span className="text-[#ff7a45] mr-1">✦</span> Coming Soon
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.id === "accurate" && onSearchSubmit) {
                  onSearchSubmit();
                } else if (setActiveTab) {
                  setActiveTab(tab.id);
                }
              }}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-[#222532] text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#1a1c27]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Right: Quick Search + DJ Session Badge */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Quick Search */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (onSearchSubmit) onSearchSubmit();
          }}
          className="relative hidden sm:block w-36 md:w-48"
        >
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vibes..."
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            onFocus={onSearchFocus}
            className="w-full bg-[#151722] hover:bg-[#1a1d2b] focus:bg-[#1c1f2e] border border-[#242738] focus:border-[#ff5d2b]/60 rounded-lg pl-8 pr-2.5 py-1 text-xs text-white placeholder-gray-500 focus:outline-none transition-all duration-150"
          />
        </form>

        {/* User Pill / Engine Status */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#151722] border border-[#242738]">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#ff5d2b] to-[#ff914d] flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
            DJ
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-[11px] font-semibold text-white leading-tight">DJ Session</p>
            <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {currentTime || "Live"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
