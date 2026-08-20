import React, { useState, useEffect, useRef } from "react";
import { 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Play, 
  Pause, 
  Heart, 
  Sparkles, 
  Music, 
  ExternalLink,
  Volume2
} from "lucide-react";
import useTheme from "../../hooks/useTheme";

export default function PlaylistResult({
  mood = "R&B Hits",
  tracks = [],
  trackDetails = [],
  onTrackChange,
  onPlaybackStateChange
}) {
  const { currentTheme } = useTheme();
  const [shuffledTracks, setShuffledTracks] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); // "off", "all", "one"
  const [displayTracks, setDisplayTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedMap, setLikedMap] = useState({});
  const [activeEmbedIndex, setActiveEmbedIndex] = useState(null);

  const iframeRefs = useRef([]);

  // Curated fallback metadata for the 8 tracks
  const defaultMeta = [
    { name: "Vocal Studies & Uprock", artist: "Prefuse 73", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80" },
    { name: "Temples of Light", artist: "Lone Echo", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80" },
    { name: "Earth Tones (Original)", artist: "Lenzman", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80" },
    { name: "Kollections 06 Club", artist: "VA Summer Sessions", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80" },
    { name: "Blinding Lights", artist: "The Weeknd", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&q=80" },
    { name: "Mr. Brightside", artist: "The Killers", image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&q=80" },
    { name: "Shape of You", artist: "Ed Sheeran", image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&q=80" },
    { name: "Starboy", artist: "The Weeknd ft. Daft Punk", image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&q=80" }
  ];

  // Initialize tracks (limit to 8)
  useEffect(() => {
    const list = tracks && tracks.length > 0 ? tracks.slice(0, 8) : [];
    setDisplayTracks(list);
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    setShuffledTracks(shuffled);
    iframeRefs.current = new Array(list.length);
  }, [tracks]);

  // Update current track change
  useEffect(() => {
    if (displayTracks.length > 0 && currentTrack < displayTracks.length) {
      if (onTrackChange) onTrackChange(currentTrack, displayTracks[currentTrack]);
    }
  }, [displayTracks, currentTrack, onTrackChange]);

  useEffect(() => {
    if (onPlaybackStateChange) {
      onPlaybackStateChange(isPlaying, isShuffled, repeatMode, currentTrack);
    }
  }, [isPlaying, isShuffled, repeatMode, currentTrack, onPlaybackStateChange]);

  // Handle shuffle
  const handleShuffle = () => {
    const nextState = !isShuffled;
    setIsShuffled(nextState);
    if (nextState) {
      setDisplayTracks(shuffledTracks);
      setCurrentTrack(0);
    } else {
      setDisplayTracks(tracks.slice(0, 8));
      setCurrentTrack(0);
    }
  };

  // Handle repeat mode cycling
  const handleRepeat = () => {
    const modes = ["off", "all", "one"];
    const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  // Handle play/pause
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle play all
  const handlePlayAll = () => {
    setCurrentTrack(0);
    setIsPlaying(true);
    setActiveEmbedIndex(0);
  };

  const handleTrackSelect = (index) => {
    setCurrentTrack(index);
    setIsPlaying(true);
    setActiveEmbedIndex(index);
  };

  const toggleTrackLike = (e, index) => {
    e.stopPropagation();
    setLikedMap(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const formattedMoodTitle = mood
    ? mood.charAt(0).toUpperCase() + mood.slice(1)
    : "R&B Hits";

  return (
    <div className="space-y-5 select-none">
      {/* 1. Curated Hero Banner (Warm Coral/Orange Studio Gradient) */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-[#ff5d2b] via-[#f7521e] to-[#d63d0f] p-5 sm:p-7 text-white shadow-xl flex flex-col justify-between border border-white/10 group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-white/90 bg-black/25 px-2.5 py-0.5 rounded backdrop-blur-sm inline-block border border-white/10">
              CURATED PLAYLIST
            </span>
            <span className="text-[10px] text-white/80 bg-white/10 px-2 py-0.5 rounded font-mono">
              8 Tracks Selected
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            {formattedMoodTitle}
          </h2>

          <p className="text-xs text-white/85 font-medium leading-relaxed line-clamp-2 max-w-lg">
            AI-matched Spotify audio selection synchronized with your emotional prompt and vibe frequency.
          </p>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/90">
            <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded border border-white/10">
              <Heart className="w-3.5 h-3.5 fill-white text-white" />
              <span>50,056 Likes</span>
            </div>
            <span>•</span>
            <span>8 Songs, ~26 min</span>
            
            <button
              onClick={handlePlayAll}
              className="ml-auto bg-white text-black hover:bg-gray-100 px-4 py-1.5 rounded-lg font-bold text-xs shadow flex items-center gap-1.5 transition-transform transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Play All</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Controls Header Bar */}
      <div className="flex items-center justify-between gap-3 bg-[#13141c] border border-[#222534] rounded-lg px-3.5 py-2 text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#ff7a45]" />
          <span className="font-bold text-white">
            Matched Tracks (8)
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400">
            Active: #{currentTrack + 1}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors text-xs ${
              isShuffled
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-semibold"
                : "bg-[#181a25] hover:bg-[#202332] text-gray-400 border-[#252838]"
            }`}
          >
            <Shuffle className="w-3 h-3" />
            <span>Shuffle</span>
          </button>

          <button
            onClick={handleRepeat}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors text-xs ${
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

      {/* 3. 8-Track Grid Cards (4 columns x 2 rows) with High-Quality Artwork */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {displayTracks.map((uri, index) => {
          const trackId = uri.split(":")[2] || uri;
          const detail = (trackDetails && trackDetails[index]) || defaultMeta[index % defaultMeta.length];
          const isCurrent = index === currentTrack;
          const isLiked = likedMap[index];
          const showIframe = activeEmbedIndex === index;

          return (
            <div
              key={`${uri}-${index}-${isShuffled}`}
              onClick={() => handleTrackSelect(index)}
              className={`group relative rounded-xl bg-[#14151d] hover:bg-[#191b26] border p-2.5 transition-all duration-200 cursor-pointer shadow-md flex flex-col justify-between space-y-2 ${
                isCurrent
                  ? "border-[#ff5d2b] ring-1 ring-[#ff5d2b]/50 bg-[#181a26]"
                  : "border-[#202230] hover:border-[#2f3347]"
              }`}
            >
              {/* Artwork & Audio Player Container */}
              <div className="relative rounded-lg overflow-hidden bg-[#0d0e14] aspect-[16/10] flex items-center justify-center">
                {showIframe ? (
                  <iframe
                    ref={(el) => (iframeRefs.current[index] = el)}
                    src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0&autoplay=1`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title={detail.name}
                    className="w-full h-full rounded-lg"
                  />
                ) : (
                  <>
                    <img 
                      src={detail.image || defaultMeta[index % defaultMeta.length].image} 
                      alt={detail.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Track Number Badge */}
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/10">
                      #{index + 1}
                    </div>

                    {/* Playing State Badge */}
                    {isCurrent && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-[#ff5d2b] to-[#ff7a45] text-white text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow">
                        {isPlaying ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                            <span>LIVE</span>
                          </>
                        ) : (
                          <>
                            <Pause className="w-2.5 h-2.5" />
                            <span>PAUSED</span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Hover Play Button */}
                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff5d2b] to-[#ff8c42] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        {isCurrent && isPlaying ? (
                          <Volume2 className="w-4 h-4 text-white animate-bounce" />
                        ) : (
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Title & Artist & Favorite */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="truncate pr-2">
                  <p className="text-xs font-bold text-white truncate group-hover:text-[#ff7a45] transition-colors">
                    {detail.name}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {detail.artist}
                  </p>
                </div>

                <button
                  onClick={(e) => toggleTrackLike(e, index)}
                  className={`p-1.5 rounded-md hover:bg-[#202332] transition-colors flex-shrink-0 ${
                    isLiked ? "text-[#ff5d2b]" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-[#ff5d2b]" : ""}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
