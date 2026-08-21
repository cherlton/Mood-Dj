import React, { useState, useEffect, useRef } from "react";
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
  Music,
  ExternalLink
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
  activeTrackName,
  activeArtistName,
  activeImage,
  previewUrl,
  mood = "Curated AI Mix"
}) {
  const [liked, setLiked] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(30);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  // Pure Spotify audio preview URL directly from the Spotify API
  const activeAudioSrc = previewUrl || "";

  // Initialize and handle real Spotify audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (activeAudioSrc) {
      audio.src = activeAudioSrc;
      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Spotify audio play notice:", err);
          });
        }
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
      audio.src = "";
    }
  }, [isPlaying, currentTrackIndex, activeAudioSrc]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Audio event listeners
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTimeSec(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDurationSec(audioRef.current.duration);
      }
    }
  };

  const handleAudioEnded = () => {
    if (repeatMode === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else if (onNext) {
      onNext();
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !durationSec) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = clickRatio * durationSec;
    audioRef.current.currentTime = targetTime;
    setCurrentTimeSec(targetTime);
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getRepeatIcon = () => {
    if (repeatMode === "one") return <Repeat1 className="w-3.5 h-3.5" />;
    return <Repeat className="w-3.5 h-3.5" />;
  };

  const getRepeatColor = () => {
    if (repeatMode === "one") return "text-emerald-400";
    if (repeatMode === "all") return "text-[#ff5d2b]";
    return "text-gray-500 hover:text-gray-300";
  };

  const displayName = activeTrackName || `Track #${currentTrackIndex + 1}`;
  const displayArtist = activeArtistName || mood || "Spotify Artist";
  const displayCover = activeImage || "";

  const spotifyTrackId = nowPlayingTrack ? nowPlayingTrack.replace("spotify:track:", "") : "";
  const spotifyOpenUrl = spotifyTrackId ? `https://open.spotify.com/track/${spotifyTrackId}` : null;

  const progressPercent = durationSec > 0 ? (currentTimeSec / durationSec) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-18 bg-[#0b0c10]/95 backdrop-blur-xl border-t border-[#1c1f2b] px-4 sm:px-6 flex items-center justify-between z-40 select-none py-2 shadow-2xl">
      {/* Real HTML5 Audio Element for Spotify preview audio */}
      {activeAudioSrc && (
        <audio
          ref={audioRef}
          src={activeAudioSrc}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleAudioEnded}
          preload="auto"
        />
      )}

      {/* Left: Track Cover & Details */}
      <div className="flex items-center gap-3 w-1/3 sm:w-1/4 min-w-0">
        <div className="w-11 h-11 rounded-lg bg-[#181a25] border border-white/10 flex items-center justify-center text-white flex-shrink-0 shadow-md relative overflow-hidden group">
          {displayCover ? (
            <img 
              src={displayCover} 
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <Music className="w-5 h-5 text-white/90" />
          )}

          {/* Equalizer animation when playing audio */}
          {isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5 backdrop-blur-[1px]">
              <div className="w-0.5 h-3 bg-[#ff7a45] rounded-full animate-bounce" style={{ animationDuration: '0.6s' }}></div>
              <div className="w-0.5 h-5 bg-white rounded-full animate-bounce" style={{ animationDuration: '0.4s' }}></div>
              <div className="w-0.5 h-2.5 bg-[#ff7a45] rounded-full animate-bounce" style={{ animationDuration: '0.8s' }}></div>
            </div>
          )}
        </div>

        <div className="truncate min-w-0">
          <p className="text-xs font-bold text-white truncate flex items-center gap-1.5">
            {displayName}
            {isPlaying && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
            )}
          </p>
          <p className="text-[11px] text-gray-400 capitalize truncate">
            {displayArtist}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setLiked(!liked)}
          className={`p-1.5 rounded-md hover:bg-[#181a25] transition-colors hidden md:block flex-shrink-0 ${liked ? "text-[#ff5d2b]" : "text-gray-500 hover:text-gray-300"}`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-[#ff5d2b]" : ""}`} />
        </button>

        {spotifyOpenUrl && (
          <a
            href={spotifyOpenUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md hover:bg-[#181a25] text-gray-400 hover:text-emerald-400 transition-colors hidden xl:block flex-shrink-0"
            title="Open in Spotify"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Center: Playback Controls & Timeline Scrubber */}
      <div className="flex flex-col items-center gap-1 w-2/4 max-w-xl px-2">
        {/* Buttons Row */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onShuffle}
            className={`p-1.5 rounded-md transition-colors ${
              isShuffled ? "text-emerald-400 bg-emerald-400/10" : "text-gray-500 hover:text-gray-300"
            }`}
            title={isShuffled ? "Shuffle active" : "Shuffle tracks"}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onPrevious}
            className="text-gray-400 hover:text-white transition-colors p-1"
            title="Previous track"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Master Play / Pause Button */}
          <button
            type="button"
            onClick={onPlayPause}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-200 text-black flex items-center justify-center shadow-lg transition-transform transform active:scale-95 cursor-pointer"
            title={isPlaying ? "Pause audio" : "Play audio"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={onNext}
            className="text-gray-400 hover:text-white transition-colors p-1"
            title="Next track"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onRepeat}
            className={`p-1.5 rounded-md transition-colors ${getRepeatColor()}`}
            title={`Repeat: ${repeatMode}`}
          >
            {getRepeatIcon()}
          </button>
        </div>

        {/* Timeline Bar synced with real audio */}
        <div className="w-full flex items-center gap-2 text-[10px] text-gray-500 font-mono">
          <span className="w-7 text-right">{formatTime(currentTimeSec)}</span>
          <div 
            className="flex-1 h-1 bg-[#202330] rounded-full overflow-hidden cursor-pointer relative group"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-gradient-to-r from-[#ff5d2b] to-[#ff8c42] rounded-full relative group-hover:bg-[#ff7a45] transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="w-7 text-left">{formatTime(durationSec)}</span>
        </div>
      </div>

      {/* Right: Volume & Spotify Launch */}
      <div className="flex items-center justify-end gap-3 w-1/4">
        {spotifyOpenUrl && (
          <a
            href={spotifyOpenUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-md border border-emerald-500/20 hidden md:flex items-center gap-1.5 transition-colors"
          >
            <span>Spotify</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
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
