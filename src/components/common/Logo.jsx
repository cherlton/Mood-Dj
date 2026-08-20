import React from "react";

/**
 * Mood-DJ Official Vector Logo
 * Features dynamic audio soundwaves, turntable vinyl rings, and energetic gradient glow.
 */
export default function Logo({ size = 32, className = "", showText = false }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className} select-none`}>
      <div 
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#ff5d2b] via-[#ff7a45] to-[#9333ea] p-0.5 shadow-lg shadow-[#ff5d2b]/25 flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <div className="w-full h-full bg-[#0d0e14] rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle background acoustic glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff5d2b]/20 to-transparent"></div>
          
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3/5 h-3/5 text-white relative z-10"
          >
            <defs>
              <linearGradient id="logoGlow" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff5d2b" />
                <stop offset="100%" stopColor="#ff9a62" />
              </linearGradient>
            </defs>
            {/* Equalizer Sound Waves */}
            <rect x="3" y="10" width="2.5" height="4" rx="1.25" fill="#ff7a45" />
            <rect x="7.5" y="6" width="2.5" height="12" rx="1.25" fill="url(#logoGlow)" />
            <rect x="12" y="3" width="2.5" height="18" rx="1.25" fill="#ffffff" />
            <rect x="16.5" y="7" width="2.5" height="10" rx="1.25" fill="url(#logoGlow)" />
            <rect x="21" y="11" width="2.5" height="2" rx="1" fill="#ff7a45" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-sm font-extrabold text-white tracking-tight font-sans">
              Mood<span className="text-[#ff7a45]">-DJ</span>
            </span>
            <span className="text-[9px] uppercase font-bold tracking-wider px-1 py-0.5 rounded bg-[#ff5d2b]/20 text-[#ff7a45] border border-[#ff5d2b]/30">
              AI
            </span>
          </div>
          <span className="text-[10px] text-gray-500 font-medium tracking-wide">
            Sound Curator
          </span>
        </div>
      )}
    </div>
  );
}
