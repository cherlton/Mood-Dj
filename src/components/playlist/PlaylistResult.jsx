import React, { useState, useEffect, useRef } from "react";
import { Shuffle, Repeat, Repeat1, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import useTheme from "../../hooks/useTheme";

export default function PlaylistResult({
  mood = "happy",
  tracks = [
    "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
    "spotify:track:1Je1IMUlBXcx1Fz0WE7oPT",
    "spotify:track:6f70bfcMKEyc4DsCI5e8SI"
  ]
}) {
  const { currentTheme, currentTime, themeKey } = useTheme();
  const [showTracks, setShowTracks] = useState(false);
  const [shuffledTracks, setShuffledTracks] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); // "off", "all", "one"
  const [displayTracks, setDisplayTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nowPlayingTrack, setNowPlayingTrack] = useState(null);

  // Refs for iframe control
  const iframeRefs = useRef([]);

  useEffect(() => {
    // Animate tracks appearance
    const timer = setTimeout(() => setShowTracks(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Initialize tracks when component mounts or tracks change
  useEffect(() => {
    if (tracks && tracks.length > 0) {
      setDisplayTracks(tracks);
      setNowPlayingTrack(tracks[0]);
      const shuffled = [...tracks].sort(() => Math.random() - 0.5);
      setShuffledTracks(shuffled);
      iframeRefs.current = new Array(tracks.length);
    }
  }, [tracks]);

  // Update now playing when display tracks or current track changes
  useEffect(() => {
    if (displayTracks && displayTracks.length > 0 && currentTrack < displayTracks.length) {
      setNowPlayingTrack(displayTracks[currentTrack]);
    }
  }, [displayTracks, currentTrack]);

  // Control iframe playback
  const controlIframePlayback = (action) => {
    const currentIframe = iframeRefs.current[currentTrack];
    if (currentIframe && currentIframe.contentWindow) {
      try {
        currentIframe.contentWindow.postMessage(
          { command: action },
          'https://open.spotify.com'
        );
      } catch (e) {
        console.log('Cannot control iframe directly due to CORS');
      }
    }
  };

  // Handle shuffle toggle
  const handleShuffle = () => {
    setIsShuffled(!isShuffled);
    if (!isShuffled) {
      setDisplayTracks(shuffledTracks);
      const currentTrackInShuffled = shuffledTracks.findIndex(track => track === nowPlayingTrack);
      if (currentTrackInShuffled !== -1) {
        setCurrentTrack(currentTrackInShuffled);
      }
    } else {
      setDisplayTracks(tracks);
      const currentTrackInOriginal = tracks.findIndex(track => track === nowPlayingTrack);
      if (currentTrackInOriginal !== -1) {
        setCurrentTrack(currentTrackInOriginal);
      }
    }
  };

  // Handle repeat mode cycling
  const handleRepeat = () => {
    const modes = ["off", "all", "one"];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  // Handle play/pause
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    controlIframePlayback(isPlaying ? 'pause' : 'play');
  };

  // Handle play all
  const handlePlayAll = () => {
    setCurrentTrack(0);
    setIsPlaying(true);
    setNowPlayingTrack(displayTracks[0]);
    setTimeout(() => controlIframePlayback('play'), 100);
  };

  // Handle previous track
  const handlePrevious = () => {
    if (currentTrack > 0) {
      setCurrentTrack(currentTrack - 1);
    } else if (repeatMode === "all") {
      setCurrentTrack(displayTracks.length - 1);
    }
    if (isPlaying) {
      setTimeout(() => controlIframePlayback('play'), 100);
    }
  };

  // Handle next track
  const handleNext = () => {
    if (repeatMode === "one") {
      controlIframePlayback('play');
      return;
    }

    if (currentTrack < displayTracks.length - 1) {
      setCurrentTrack(currentTrack + 1);
    } else if (repeatMode === "all") {
      setCurrentTrack(0);
    } else {
      setIsPlaying(false);
      return;
    }

    if (isPlaying) {
      setTimeout(() => controlIframePlayback('play'), 100);
    }
  };

  // Handle track selection
  const handleTrackSelect = (index) => {
    setCurrentTrack(index);
    setIsPlaying(true);
    setTimeout(() => controlIframePlayback('play'), 100);
  };

  // Get repeat icon and color based on mode
  const getRepeatIcon = () => {
    switch (repeatMode) {
      case "one":
        return <Repeat1 className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "all":
        return <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  const getRepeatColor = () => {
    switch (repeatMode) {
      case "one":
        return "text-green-400 bg-green-400/20 border-green-400/30";
      case "all":
        return "text-blue-400 bg-blue-400/20 border-blue-400/30";
      default:
        return `${currentTheme.accent} bg-white/10 border-white/20`;
    }
  };

  // Mood emojis for different moods
  const getMoodEmoji = (moodText) => {
    const moodLower = moodText ? moodText.toLowerCase() : "";
    if (moodLower.includes('happy') || moodLower.includes('joy')) return "😊";
    if (moodLower.includes('sad') || moodLower.includes('melancholy')) return "😢";
    if (moodLower.includes('excited') || moodLower.includes('energetic')) return "🚀";
    if (moodLower.includes('calm') || moodLower.includes('peaceful')) return "🧘";
    if (moodLower.includes('love') || moodLower.includes('romantic')) return "💕";
    if (moodLower.includes('angry') || moodLower.includes('frustrated')) return "😤";
    if (moodLower.includes('nostalgic') || moodLower.includes('memories')) return "🌅";
    if (moodLower.includes('confident') || moodLower.includes('powerful')) return "💪";
    return "🎵";
  };

  if (!mood || !tracks || tracks.length === 0) {
    return null;
  }

  return (
    <div className={`min-h-screen ${currentTheme.background} transition-all duration-1000 ease-in-out`}>
      <div className="flex items-start justify-center min-h-screen p-4 sm:p-6 lg:p-8 pt-8 sm:pt-12">
        <div className={`${currentTheme.glass} rounded-3xl p-6 sm:p-8 lg:p-10 w-full max-w-sm sm:max-w-4xl lg:max-w-6xl xl:max-w-7xl shadow-2xl`}>
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl lg:text-5xl">{currentTheme.icon}</span>
              <div>
                <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${currentTheme.text}`}>
                  Your AI Curated Playlist
                </h1>
                <p className={`text-xs sm:text-sm lg:text-base ${currentTheme.accent} font-medium mt-1`}>
                  {currentTime} • Personalized just for you
                </p>
              </div>
            </div>

            {/* Mood Badge */}
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <div className={`${currentTheme.moodBadge} text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-lg`}>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xl sm:text-2xl">{getMoodEmoji(mood)}</span>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm opacity-90">Current Mood</p>
                    <p className="text-lg sm:text-xl font-bold capitalize">{mood}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Now Playing Section */}
            <div className={`${currentTheme.cardGlass} rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-white/30`}>
              <div className="flex items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className={`text-xs sm:text-sm font-semibold ${currentTheme.text}`}>
                    {isPlaying ? 'Now Playing' : 'Paused'}
                  </span>
                </div>
                <div className={`text-xs sm:text-sm ${currentTheme.accent}`}>
                  Track {currentTrack + 1} of {displayTracks.length}
                </div>
              </div>

              {/* Main Player Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                <button
                  onClick={handlePlayAll}
                  className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 transform ${currentTheme.moodBadge} text-sm sm:text-base`}
                  title="Play all tracks from beginning"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Play All</span>
                </button>

                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={handlePrevious}
                    disabled={currentTrack === 0 && repeatMode !== "all"}
                    className={`p-2 sm:p-3 rounded-xl backdrop-blur-md border transition-all duration-300 hover:scale-105 ${currentTrack === 0 && repeatMode !== "all" ? 'opacity-50 cursor-not-allowed' : ''} ${currentTheme.accent} bg-white/10 border-white/20`}
                    title="Previous track"
                  >
                    <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>

                  <button
                    onClick={handlePlayPause}
                    className={`p-3 sm:p-4 rounded-xl backdrop-blur-md border-2 transition-all duration-300 hover:scale-105 transform ${isPlaying ? 'animate-pulse' : ''} ${currentTheme.accent} bg-white/20 border-white/30`}
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-6 h-6 sm:w-7 sm:h-7" /> : <Play className="w-6 h-6 sm:w-7 sm:h-7" />}
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={currentTrack === displayTracks.length - 1 && repeatMode === "off"}
                    className={`p-2 sm:p-3 rounded-xl backdrop-blur-md border transition-all duration-300 hover:scale-105 ${currentTrack === displayTracks.length - 1 && repeatMode === "off" ? 'opacity-50 cursor-not-allowed' : ''} ${currentTheme.accent} bg-white/10 border-white/20`}
                    title="Next track"
                  >
                    <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              {/* Secondary Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={handleShuffle}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl backdrop-blur-md border transition-all duration-300 hover:scale-105 text-sm sm:text-base ${
                    isShuffled
                      ? 'text-green-400 bg-green-400/20 border-green-400/30'
                      : `${currentTheme.accent} bg-white/10 border-white/20`
                  }`}
                  title={isShuffled ? "Turn off shuffle" : "Shuffle playlist"}
                >
                  <Shuffle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">
                    {isShuffled ? "Shuffled" : "Shuffle"}
                  </span>
                </button>

                <button
                  onClick={handleRepeat}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl backdrop-blur-md border transition-all duration-300 hover:scale-105 text-sm sm:text-base ${getRepeatColor()}`}
                  title={
                    repeatMode === "off" ? "Repeat off" :
                    repeatMode === "all" ? "Repeat all" : "Repeat one"
                  }
                >
                  {getRepeatIcon()}
                  <span className="text-xs sm:text-sm font-medium">
                    <span className="hidden sm:inline">
                      {repeatMode === "off" ? "No Repeat" :
                       repeatMode === "all" ? "Repeat All" : "Repeat One"}
                    </span>
                    <span className="sm:hidden">
                      {repeatMode === "off" ? "None" :
                       repeatMode === "all" ? "All" : "One"}
                    </span>
                  </span>
                </button>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-6 sm:mb-8"></div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className={`${currentTheme.cardGlass} rounded-2xl p-3 sm:p-4`}>
                <div className={`text-xl sm:text-2xl font-bold ${currentTheme.text}`}>{tracks.length}</div>
                <div className={`text-xs sm:text-sm ${currentTheme.accent}`}>Total Tracks</div>
              </div>
              <div className={`${currentTheme.cardGlass} rounded-2xl p-3 sm:p-4`}>
                <div className={`text-xl sm:text-2xl font-bold ${currentTheme.text}`}>{currentTrack + 1}</div>
                <div className={`text-xs sm:text-sm ${currentTheme.accent}`}>Now Playing</div>
              </div>
              <div className={`${currentTheme.cardGlass} rounded-2xl p-3 sm:p-4`}>
                <div className={`text-lg sm:text-xl ${currentTheme.text}`}>
                  {isShuffled ? "🔀" : "📋"}
                </div>
                <div className={`text-xs sm:text-sm ${currentTheme.accent}`}>
                  {isShuffled ? "Shuffled" : "Original"}
                </div>
              </div>
              <div className={`${currentTheme.cardGlass} rounded-2xl p-3 sm:p-4`}>
                <div className={`text-lg sm:text-xl ${currentTheme.text}`}>
                  {repeatMode === "off" ? "🔄" : repeatMode === "all" ? "🔁" : "🔂"}
                </div>
                <div className={`text-xs sm:text-sm ${currentTheme.accent}`}>
                  <span className="hidden sm:inline">
                    {repeatMode === "off" ? "No Repeat" : repeatMode === "all" ? "Repeat All" : "Repeat One"}
                  </span>
                  <span className="sm:hidden">
                    {repeatMode === "off" ? "None" : repeatMode === "all" ? "All" : "One"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tracks Grid */}
          <div className={`transition-all duration-1000 ${showTracks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayTracks.map((uri, index) => (
                <div
                  key={`${uri}-${index}-${isShuffled}`}
                  className={`${currentTheme.cardGlass} rounded-2xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                    index === currentTrack ? 'ring-2 ring-green-400 ring-opacity-50 bg-green-400/10' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: showTracks ? 'slideInUp 0.6s ease-out forwards' : 'none'
                  }}
                  onClick={() => handleTrackSelect(index)}
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <iframe
                      ref={(el) => (iframeRefs.current[index] = el)}
                      src={`https://open.spotify.com/embed/track/${uri.split(":")[2]}?utm_source=generator&theme=${themeKey === 'night' ? '0' : '1'}&autoplay=0&show_cover_art=true`}
                      width="100%"
                      height="152"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      title={`Track ${index + 1}`}
                      className={`rounded-xl transition-opacity duration-300 ${index === currentTrack && isPlaying ? '' : 'opacity-80'}`}
                      style={{
                        pointerEvents: index === currentTrack ? 'auto' : 'none'
                      }}
                    />

                    {/* Track number overlay */}
                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                      #{index + 1}
                    </div>

                    {/* Current playing indicator */}
                    {index === currentTrack && (
                      <div className="absolute top-2 right-2 bg-green-500 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        {isPlaying ? (
                          <>
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                            <span className="hidden sm:inline">LIVE</span>
                            <span className="sm:hidden">●</span>
                          </>
                        ) : (
                          <>
                            <Pause className="w-2 h-2 sm:w-3 sm:h-3" />
                            <span className="hidden sm:inline">PAUSED</span>
                            <span className="sm:hidden">||</span>
                          </>
                        )}
                      </div>
                    )}

                    {/* Shuffle indicator */}
                    {isShuffled && index !== currentTrack && (
                      <div className="absolute top-2 right-2 bg-blue-500/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <Shuffle className="w-2 h-2 sm:w-3 sm:h-3" />
                        <span className="hidden sm:inline">🔀</span>
                      </div>
                    )}

                    {/* Click to play overlay for non-current tracks */}
                    {index !== currentTrack && (
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3">
                          <Play className="w-4 h-4 sm:w-6 sm:h-6 text-black" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Track info */}
                  <div className="mt-2 sm:mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${index === currentTrack && isPlaying ? 'bg-green-400 animate-pulse' : index === currentTrack ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
                      <span className={`text-xs ${currentTheme.accent} font-medium`}>
                        <span className="hidden sm:inline">
                          {index === currentTrack ? (isPlaying ? 'Now Playing' : 'Current Track') : 'Click to Play'}
                        </span>
                        <span className="sm:hidden">
                          {index === currentTrack ? (isPlaying ? 'Playing' : 'Current') : 'Play'}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      {repeatMode === "one" && index === currentTrack && (
                        <div className="text-green-400" title="This track will repeat">
                          <Repeat1 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                      )}
                      <button
                        className={`text-xs ${currentTheme.accent} hover:opacity-75 transition-opacity`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <svg width="12" height="12" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 sm:mt-12">
            <div className={`${currentTheme.cardGlass} rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6`}>
              <p className={`${currentTheme.text} text-base sm:text-lg mb-2`}>
                🎧 Enjoying your personalized playlist experience?
              </p>
              <p className={`${currentTheme.accent} text-sm mb-2 sm:mb-3`}>
                {isPlaying ? '🎵 Music is playing! Use the controls to pause, skip, or shuffle.' : '🎮 Click Play to start your musical journey, or select any track below.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <span className={`${currentTheme.text} opacity-75 flex items-center gap-1`}>
                  {isPlaying && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>}
                  {isShuffled && <Shuffle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />}
                  {repeatMode !== "off" && (
                    repeatMode === "all" ?
                      <Repeat className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" /> :
                      <Repeat1 className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                  )}
                  <span className="hidden sm:inline">
                    {isPlaying ? '🎵 Playing' : '⏸️ Paused'} • {displayTracks.length} tracks loaded
                  </span>
                  <span className="sm:hidden">
                    {isPlaying ? '🎵' : '⏸️'} • {displayTracks.length} tracks
                  </span>
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">
              <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></span>
              <span className={`${currentTheme.text} opacity-75`}>
                <span className="hidden sm:inline">
                  Powered by MoodTunes AI • Spotify Integration {isPlaying ? '• Live Playback' : ''}
                </span>
                <span className="sm:hidden">
                  MoodTunes AI {isPlaying ? '• Live' : ''}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
