import React, { useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Volume2, 
  VolumeX, 
  Heart, 
  Maximize2,
  ExternalLink,
  Music
} from "lucide-react";

export default function BottomPlayer({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffle,
  isShuffled,
  onRepeat,
  repeatMode = "off",
  currentTrackIndex = 0,
  totalTracks = 0,
  nowPlayingTrack,
  mood = "Curated AI Mix"
}) {
  const [liked, setLiked] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(25);
  const [isMuted, setIsMuted] = useState(false);

  // Progress simulation for aesthetic playback bar
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const getRepeatIcon = () => {
    if (repeatMode === "one") return <Repeat1 className="w-3.5 h-3.5" />;
    return <Repeat className="w-3.5 h-3.5" />;
  };

  const getRepeatColor = () => {
    if (repeatMode === "one") return "text-emerald-400";
    if (repeatMode === "all") return "text-[#ff5d2b]";
    return "text-gray-500 hover:text-gray-300";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-18 bg-[#0b0c10]/95 backdrop-blur-xl border-t border-[#1c1f2b] px-4 sm:px-6 flex items-center justify-between z-40 select-none py-2 shadow-2xl">
      {/* Left: Track Details */}
      <div className="flex items-center gap-3 w-1/4 min-w-0">
        <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-[#ff5d2b] to-[#7928ca] flex items-center justify-center text-white flex-shrink-0 shadow-md relative overflow-hidden group">
          <Music className="w-5 h-5 text-white/90" />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-0.5">
              <div className="w-0.5 h-3 bg-white rounded-full animate-bounce" style={{ animationDuration: '0.6s' }}></div>
              <div className="w-0.5 h-4 bg-white rounded-full animate-bounce" style={{ animationDuration: '0.4s' }}></div>
              <div className="w-0.5 h-2 bg-white rounded-full animate-bounce" style={{ animationDuration: '0.8s' }}></div>
            </div>
          )}
        </div>

        <div className="truncate hidden sm:block">
          <p className="text-xs font-bold text-white truncate flex items-center gap-1.5">
            {totalTracks > 0 ? `Track #${currentTrackIndex + 1}` : "AI Soundscape"}
            {isPlaying && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </p>
          <p className="text-[11px] text-gray-400 capitalize truncate">
            {mood || "Mood-DJ Curated Mix"}
          </p>
        </div>

        <button
          onClick={() => setLiked(!liked)}
          className={`p-1.5 rounded-md hover:bg-[#181a25] transition-colors hidden md:block ${liked ? "text-[#ff5d2b]" : "text-gray-500 hover:text-gray-300"}`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-[#ff5d2b]" : ""}`} />
        </button>
      </div>

      {/* Center: Controls + Timeline Scrubber */}
      <div className="flex flex-col items-center gap-1 w-2/4 max-w-xl">
        {/* Buttons Row */}
        <div className="flex items-center gap-4">
          <button
            onClick={onShuffle}
            className={`p-1.5 rounded-md transition-colors ${
              isShuffled ? "text-emerald-400 bg-emerald-400/10" : "text-gray-500 hover:text-gray-300"
            }`}
            title={isShuffled ? "Shuffle active" : "Shuffle tracks"}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onPrevious}
            className="text-gray-400 hover:text-white transition-colors p-1"
            title="Previous track"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onPlayPause}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-200 text-black flex items-center justify-center shadow-lg transition-transform transform active:scale-95"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={onNext}
            className="text-gray-400 hover:text-white transition-colors p-1"
            title="Next track"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={onRepeat}
            className={`p-1.5 rounded-md transition-colors ${getRepeatColor()}`}
            title={`Repeat: ${repeatMode}`}
          >
            {getRepeatIcon()}
          </button>
        </div>

        {/* Timeline Bar */}
        <div className="w-full flex items-center gap-2 text-[10px] text-gray-500 font-mono">
          <span className="w-7 text-right">0:{Math.floor(progress * 1.8).toString().padStart(2, '0')}</span>
          <div 
            className="flex-1 h-1 bg-[#202330] rounded-full overflow-hidden cursor-pointer relative group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPos = (e.clientX - rect.left) / rect.width;
              setProgress(clickPos * 100);
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-[#ff5d2b] to-[#ff8c42] rounded-full relative group-hover:bg-[#ff7a45] transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="w-7 text-left">3:00</span>
        </div>
      </div>

      {/* Right: Volume & Options */}
      <div className="flex items-center justify-end gap-3 w-1/4">
        {totalTracks > 0 && (
          <span className="text-[11px] font-medium text-gray-400 bg-[#161822] px-2 py-0.5 rounded border border-[#232736] hidden lg:inline-block">
            {currentTrackIndex + 1} / {totalTracks}
          </span>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-16 sm:w-20 h-1 bg-[#202330] rounded-lg appearance-none cursor-pointer accent-[#ff5d2b] hidden sm:block"
          />
        </div>
      </div>
    </div>
  );
}
