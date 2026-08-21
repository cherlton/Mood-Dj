import React, { useState, useEffect } from "react";
import { 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Sparkles, 
  Heart,
  ExternalLink
} from "lucide-react";
import useTheme from "../../hooks/useTheme";

export default function PlaylistResult({
  mood = "Curated Mix",
  tracks = [],
  trackDetails = [],
  onTrackChange,
  onPlaybackStateChange
}) {
  const { currentTheme } = useTheme();
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");
  const [currentTrack, setCurrentTrack] = useState(0);
  const [likedMap, setLikedMap] = useState({});
  const [renderKey, setRenderKey] = useState(0);

  // Pure dynamic track list from backend API
  const activeList = Array.isArray(trackDetails) ? trackDetails.slice(0, 8) : [];

  // Trigger smooth slide animation when new tracks arrive
  useEffect(() => {
    if (activeList.length > 0) {
      setRenderKey(prev => prev + 1);
    }
  }, [trackDetails, tracks]);

  const handleShuffle = () => {
    setIsShuffled(!isShuffled);
    setCurrentTrack(0);
    setRenderKey(prev => prev + 1);
  };

  const handleRepeat = () => {
    const modes = ["off", "all", "one"];
    const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const toggleTrackLike = (e, index) => {
    e.stopPropagation();
    setLikedMap(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const formattedMoodTitle = mood
    ? mood.charAt(0).toUpperCase() + mood.slice(1)
    : "Curated AI Mix";

  return (
    <div className="space-y-5 select-none">
      {/* 1. Curated Hero Banner */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-[#ff5d2b] via-[#f7521e] to-[#d63d0f] p-5 sm:p-7 text-white shadow-xl flex flex-col justify-between border border-white/10 group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 max-w-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-white/90 bg-black/25 px-2.5 py-0.5 rounded backdrop-blur-sm inline-block border border-white/10">
              OFFICIAL SPOTIFY PLAYLIST
            </span>
            <span className="text-[10px] text-white/80 bg-white/10 px-2 py-0.5 rounded font-mono">
              {activeList.length} Tracks Loaded
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight capitalize">
            {formattedMoodTitle}
          </h2>

          <p className="text-xs text-white/85 font-medium leading-relaxed line-clamp-2 max-w-lg">
            Direct Spotify audio players matching your requested emotion, artist, and sound profile.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/90">
            <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded border border-white/10">
              <Heart className="w-3.5 h-3.5 fill-white text-white" />
              <span>50,056 Likes</span>
            </div>
            <span>•</span>
            <span>{activeList.length} Songs</span>
          </div>
        </div>
      </div>

      {/* 2. Controls Header Bar */}
      <div className="flex items-center justify-between gap-3 bg-[#13141c] border border-[#222534] rounded-lg px-3.5 py-2 text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#ff7a45]" />
          <span className="font-bold text-white">
            Matched Spotify Tracks ({activeList.length})
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Direct Spotify Audio
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShuffle}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors text-xs cursor-pointer ${
              isShuffled
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-semibold"
                : "bg-[#181a25] hover:bg-[#202332] text-gray-400 border-[#252838]"
            }`}
          >
            <Shuffle className="w-3 h-3" />
            <span>Shuffle</span>
          </button>

          <button
            type="button"
            onClick={handleRepeat}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors text-xs cursor-pointer ${
              repeatMode !== "off"
                ? "bg-[#ff5d2b]/15 text-[#ff7a45] border-[#ff5d2b]/30 font-semibold"
                : "bg-[#181a25] hover:bg-[#202332] text-gray-400 border-[#252838]"
            }`}
          >
            {repeatMode === "one" ? <Repeat1 className="w-3 h-3" /> : <Repeat className="w-3 h-3" />}
            <span className="capitalize">{repeatMode === "off" ? "Repeat" : repeatMode}</span>
          </button>
        </div>
      </div>

      {/* 3. Matched Tracks Grid Cards - 2 Column Widescreen Fit for Spotify Embeds */}
      <div 
        key={`grid-${renderKey}`} 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 animate-slide-in-left"
      >
        {activeList.map((detail, index) => {
          const trackId = detail.id || (detail.uri ? detail.uri.replace("spotify:track:", "") : "");
          const isLiked = likedMap[index];
          const isCurrent = index === currentTrack;

          return (
            <div
              key={`${detail.id || detail.uri || index}-${renderKey}`}
              style={{ animationDelay: `${index * 45}ms` }}
              onClick={() => {
                setCurrentTrack(index);
                if (onTrackChange) {
                  onTrackChange(index, detail.uri || `spotify:track:${trackId}`);
                }
              }}
              className={`group relative rounded-2xl bg-[#14151d] hover:bg-[#181a25] border p-3 transition-all duration-200 shadow-lg flex flex-col justify-between space-y-2.5 animate-slide-in-left ${
                isCurrent
                  ? "border-[#ff5d2b] ring-1 ring-[#ff5d2b]/90 bg-[#181a26] shadow-xl shadow-[#ff5d2b]/20"
                  : "border-[#202230] hover:border-[#2f3347]"
              }`}
            >
              {/* Top Meta Header: Track Number & Actions */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-300 bg-black/60 px-2 py-0.5 rounded-md border border-white/10 font-mono">
                    #{index + 1}
                  </span>
                  <span className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-[280px]">
                    {detail.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => toggleTrackLike(e, index)}
                    className={`p-1.5 rounded-lg hover:bg-[#202332] transition-colors cursor-pointer ${
                      isLiked ? "text-[#ff5d2b]" : "text-gray-500 hover:text-gray-300"
                    }`}
                    title={isLiked ? "Liked" : "Like"}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-[#ff5d2b]" : ""}`} />
                  </button>

                  {trackId && (
                    <a
                      href={`https://open.spotify.com/track/${trackId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-400 hover:text-emerald-400 p-1.5 rounded-lg hover:bg-[#202332] transition-colors"
                      title="Open full track in Spotify"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Official Spotify Embed Player - Full Width No Scrollbars */}
              <div className="rounded-xl overflow-hidden bg-[#0d0e14] h-[152px] w-full flex items-center justify-center border border-white/5 shadow-inner">
                {trackId ? (
                  <iframe
                    src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title={detail.name || `Track ${index + 1}`}
                    className="w-full h-[152px] rounded-xl border-0 overflow-hidden block"
                  />
                ) : (
                  <div className="text-center p-4 text-gray-500 text-xs">
                    Spotify Track Unavailable
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
