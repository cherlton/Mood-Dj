import React, { useState } from "react";
import { Play, Pause, Heart, Share2, Sparkles, Disc3, Music2, ListMusic } from "lucide-react";

export default function RightPanel({
  nowPlayingTrack,
  isPlaying,
  onPlayPause,
  tracks = [],
  trackDetails = [],
  currentTrackIndex = 0,
  onSelectTrack,
  mood = "R&B Hits"
}) {
  const [liked, setLiked] = useState(false);

  // Active track info from trackDetails or fallback
  const activeDetail = trackDetails && trackDetails[currentTrackIndex] 
    ? trackDetails[currentTrackIndex] 
    : { name: `Track #${currentTrackIndex + 1}`, artist: "Curated Artist", image: null };

  return (
    <aside className="w-72 xl:w-80 h-screen sticky top-0 flex-shrink-0 bg-[#0d0e12] border-l border-[#1e2029] flex flex-col justify-between p-4 select-none z-20 hidden 2xl:flex overflow-y-auto space-y-4">
      <div className="space-y-3">
        {/* Top Section: Active AI Mood Session */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5d2b] animate-pulse"></span>
            <span className="font-semibold text-gray-200">Active AI Session</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            SYNCED
          </span>
        </div>

        {/* Current Mood Pill */}
        <div className="p-2.5 rounded-xl bg-[#151722] border border-[#222536] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#ff5d2b] to-[#ff8c42] flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white capitalize truncate">{mood || "Curated Playlist"}</p>
              <p className="text-[10px] text-gray-400">Spotify Match Engine</p>
            </div>
          </div>
          <span className="text-[10px] text-[#ff7a45] font-semibold bg-[#ff5d2b]/10 px-2 py-0.5 rounded border border-[#ff5d2b]/20 flex-shrink-0">
            8 Tracks
          </span>
        </div>

        {/* Center: Now Playing Card with Waveform Curve */}
        <div className="p-3.5 rounded-xl bg-[#151722] border border-[#222536] space-y-3 shadow-md">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {activeDetail.image ? (
                <img 
                  src={activeDetail.image} 
                  alt={activeDetail.name}
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0 shadow"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-purple-800 to-rose-900 flex items-center justify-center text-white flex-shrink-0 shadow">
                  <Disc3 className={`w-5 h-5 text-rose-300 ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: '8s' }} />
                </div>
              )}
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">
                  {activeDetail.name}
                </p>
                <p className="text-[10px] text-gray-400 truncate">
                  {activeDetail.artist}
                </p>
              </div>
            </div>
          </div>

          {/* Golden / Orange Waveform Curve */}
          <div className="relative h-14 bg-[#0e1017] rounded-lg p-2 flex items-center justify-center overflow-hidden border border-[#1b1e2a]">
            <svg
              className="w-full h-full text-[#ff5d2b]"
              viewBox="0 0 200 60"
              fill="none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="waveGlowRight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff5d2b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ff5d2b" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,35 Q20,10 40,35 T80,35 T120,20 T160,45 T200,30 L200,60 L0,60 Z"
                fill="url(#waveGlowRight)"
              />
              <path
                d="M0,35 Q20,10 40,35 T80,35 T120,20 T160,45 T200,30"
                stroke="#ff7a45"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                className={isPlaying ? "animate-pulse" : ""}
              />
            </svg>
            <div className="absolute top-1.5 right-2 text-[9px] font-mono text-emerald-400 bg-black/50 px-1.5 py-0.5 rounded border border-white/5">
              {isPlaying ? "320 KBPS" : "READY"}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setLiked(!liked)}
                className={`p-1.5 rounded-lg hover:bg-[#1f2231] transition-colors ${liked ? "text-[#ff5d2b]" : "text-gray-400 hover:text-white"}`}
                title="Like Track"
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-[#ff5d2b]" : ""}`} />
              </button>
              <button
                className="p-1.5 rounded-lg hover:bg-[#1f2231] text-gray-400 hover:text-white transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onPlayPause}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#ff5d2b] to-[#ff8c42] hover:from-[#f0501d] hover:to-[#ff6830] text-white flex items-center justify-center shadow-lg shadow-[#ff5d2b]/25 transition-all transform active:scale-95"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Bottom Section: Active 8-Track Queue directly synced with backend */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between border-b border-[#1e2029] pb-2">
            <div className="flex items-center gap-2">
              <ListMusic className="w-3.5 h-3.5 text-[#ff7a45]" />
              <span className="text-xs font-bold text-white">Current Track Queue</span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">
              {tracks.length} tracks
            </span>
          </div>

          {/* List of 8 tracks */}
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {tracks.map((uri, idx) => {
              const detail = trackDetails[idx] || { name: `Track ${idx + 1}`, artist: "Spotify Track", image: null };
              const isCurrent = idx === currentTrackIndex;
              return (
                <button
                  key={`${uri}-${idx}`}
                  onClick={() => onSelectTrack && onSelectTrack(idx)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                    isCurrent
                      ? "bg-[#1f2231] border border-[#ff5d2b]/40 text-white"
                      : "hover:bg-[#151722] text-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {detail.image ? (
                      <img 
                        src={detail.image} 
                        alt="" 
                        className="w-7 h-7 rounded object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded bg-[#252838] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                        {idx + 1}
                      </div>
                    )}
                    <div className="truncate">
                      <p className="text-xs font-medium text-white truncate">{detail.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{detail.artist}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono flex-shrink-0 pl-2">
                    {isCurrent && isPlaying ? "LIVE" : `#${idx + 1}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
