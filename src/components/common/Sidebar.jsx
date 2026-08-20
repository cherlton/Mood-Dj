import React from "react";
import { 
  Sparkles, 
  Mic, 
  Activity, 
  Flame, 
  Moon, 
  Coffee, 
  Zap, 
  HeartHandshake, 
  Smile,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Logo from "./Logo";

export default function Sidebar({ 
  onSelectMood,
  activeMood = "",
  backendHealth = "healthy",
  onOpenVoice
}) {
  // Navigation sections matching backend endpoints directly
  const endpointActions = [
    { 
      id: "playlist", 
      label: "AI Mood Curator", 
      endpoint: "POST /get_playlist", 
      icon: Sparkles,
      action: () => onSelectMood && onSelectMood("trending hits") 
    },
    { 
      id: "voice", 
      label: "Voice Mood AI", 
      endpoint: "POST /analyze-voice", 
      icon: Mic,
      action: () => onOpenVoice && onOpenVoice() 
    },
    { 
      id: "health", 
      label: "Backend Status", 
      endpoint: "GET /health", 
      icon: Activity,
      action: null 
    },
  ];

  // Active Curated Moods (Directly invokes POST /get_playlist with target mood)
  const curatedMoods = [
    { label: "Energetic Dance", icon: Zap, mood: "energetic" },
    { label: "Late Night Chill", icon: Moon, mood: "late night" },
    { label: "Deep Focus Lo-Fi", icon: Coffee, mood: "focus" },
    { label: "Happy & Upbeat", icon: Smile, mood: "happy" },
    { label: "Sunset Soul & R&B", icon: Flame, mood: "r&b hits" },
    { label: "Calm & Peaceful", icon: HeartHandshake, mood: "calm" },
  ];

  return (
    <aside className="w-56 lg:w-60 h-screen sticky top-0 flex-shrink-0 bg-[#0d0e12] border-r border-[#1e2029] flex flex-col justify-between p-4 select-none z-30 hidden md:flex">
      <div className="space-y-6">
        {/* Brand Header with Custom Logo */}
        <div className="px-1 pt-1">
          <Logo size={34} showText={true} />
        </div>

        {/* Live Backend Services / Endpoints */}
        <div className="space-y-1">
          <h2 className="text-[11px] font-bold tracking-wider text-gray-500 uppercase px-2 mb-2">
            API Endpoints
          </h2>
          {endpointActions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-[#161720] transition-all duration-150 group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 text-[#ff7a45] group-hover:scale-110 transition-transform" />
                  <span className="truncate">{item.label}</span>
                </div>
                <span className="text-[9px] text-gray-600 font-mono hidden lg:inline">
                  {item.id === "health" ? "200 OK" : "API"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Curated Mood Queries (Calling /get_playlist) */}
        <div className="space-y-1">
          <h2 className="text-[11px] font-bold tracking-wider text-gray-500 uppercase px-2 mb-2">
            Curated Moods
          </h2>
          <div className="space-y-1">
            {curatedMoods.map((preset, idx) => {
              const Icon = preset.icon;
              const isSelected = activeMood.toLowerCase().includes(preset.mood.toLowerCase());
              return (
                <button
                  key={idx}
                  onClick={() => onSelectMood && onSelectMood(preset.mood)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isSelected
                      ? "bg-[#ff5d2b]/15 text-[#ff7a45] border border-[#ff5d2b]/30 font-semibold"
                      : "text-gray-400 hover:text-white hover:bg-[#161720]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-3.5 h-3.5 text-[#ff7a45] flex-shrink-0" />
                    <span className="truncate">{preset.label}</span>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff5d2b] animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Live Service Health Status */}
      <div className="pt-3 border-t border-[#1e2029]">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-[#14151d] border border-[#202330]">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          </div>
          <div className="truncate">
            <p className="text-[11px] font-semibold text-white truncate flex items-center gap-1">
              Flask & Spotify Active
            </p>
            <p className="text-[10px] text-gray-400 truncate">Port 5000 • Live Sync</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
