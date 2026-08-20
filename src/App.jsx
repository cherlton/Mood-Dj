import React, { useState, useEffect } from "react";
import ROUTES from "./routes";
import useTheme from "./hooks/useTheme";
import Sidebar from "./components/common/Sidebar";
import TopNav from "./components/common/TopNav";
import RightPanel from "./components/common/RightPanel";
import BottomPlayer from "./components/common/BottomPlayer";
import moodService from "./services/moodService";

export default function App() {
  const [currentPath, setCurrentPath] = useState("/");
  const [mood, setMood] = useState("R&B Hits");
  const [tracks, setTracks] = useState([]);
  const [trackDetails, setTrackDetails] = useState([]);
  const [showResults, setShowResults] = useState(true);

  // Playback state across components
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");
  const [activeTab, setActiveTab] = useState("Curated");
  const [searchQuery, setSearchQuery] = useState("");

  const { currentTheme, currentTime } = useTheme();

  // Load default 8 random curated discovery tracks on initial mount
  useEffect(() => {
    const fetchDefaultPlaylist = async () => {
      try {
        const data = await moodService.getPlaylist("");
        if (data && data.tracks && data.tracks.length > 0) {
          setTracks(data.tracks.slice(0, 8));
          if (data.track_details) {
            setTrackDetails(data.track_details.slice(0, 8));
          }
          if (data.mood) {
            setMood(data.mood);
          }
        }
      } catch (err) {
        console.log("Could not load initial Spotify playlist:", err);
      }
    };

    fetchDefaultPlaylist();
  }, []);

  // Handle browser URL hash or path changes
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.hash.replace("#", "") || "/";
      setCurrentPath(path);
    };

    window.addEventListener("hashchange", handleLocationChange);
    handleLocationChange();

    return () => window.removeEventListener("hashchange", handleLocationChange);
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
    setCurrentPath(path);
  };

  const handleSelectMood = async (selectedMood) => {
    setMood(selectedMood);
    try {
      const data = await moodService.getPlaylist(selectedMood);
      if (data && data.tracks && data.tracks.length > 0) {
        setTracks(data.tracks.slice(0, 8));
        if (data.track_details) {
          setTrackDetails(data.track_details.slice(0, 8));
        }
        setCurrentTrackIndex(0);
      }
    } catch (e) {
      console.log("Could not load playlist for mood:", e);
    }
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) return;
    await handleSelectMood(searchQuery);
  };

  const handleTrackChange = (index, trackUri) => {
    setCurrentTrackIndex(index);
  };

  const handlePlaybackStateChange = (playing, shuffled, repeat, trackIdx) => {
    setIsPlaying(playing);
    setIsShuffled(shuffled);
    setRepeatMode(repeat);
    setCurrentTrackIndex(trackIdx);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    } else if (repeatMode === "all") {
      setCurrentTrackIndex(tracks.length - 1);
    }
  };

  const handleNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else if (repeatMode === "all") {
      setCurrentTrackIndex(0);
    }
  };

  const handleShuffleToggle = () => {
    setIsShuffled(!isShuffled);
  };

  const handleRepeatToggle = () => {
    const modes = ["off", "all", "one"];
    const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const activeDetail = trackDetails[currentTrackIndex] || {
    name: `Track #${currentTrackIndex + 1}`,
    artist: "Spotify Audio Stream",
    image: null
  };

  // Find active route or fallback
  const activeRoute = ROUTES.find((r) => r.path === currentPath) || ROUTES.find((r) => r.isDefault);
  const ActiveComponent = activeRoute ? activeRoute.component : ROUTES[0].component;

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e1e4ea] flex flex-col font-sans">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Only matching backend endpoints) */}
        <Sidebar
          currentPath={currentPath}
          onNavigate={navigate}
          onSelectMood={handleSelectMood}
          activeMood={mood}
          onOpenVoice={() => {
            const voiceBtn = document.getElementById("voice-record-btn");
            if (voiceBtn) voiceBtn.click();
          }}
        />

        {/* Center Main Work Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0e0f14] overflow-y-auto">
          {/* Top Navigation */}
          <TopNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onBack={() => navigate("/")}
            currentTime={currentTime}
            onQuickShuffle={handleShuffleToggle}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            showBackButton={currentPath !== "/"}
          />

          {/* Dynamic Main Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-7xl w-full mx-auto">
            <ActiveComponent
              mood={mood}
              setMood={setMood}
              tracks={tracks}
              setTracks={setTracks}
              trackDetails={trackDetails}
              setTrackDetails={setTrackDetails}
              showResults={showResults}
              setShowResults={setShowResults}
              onNavigate={navigate}
              onBack={() => navigate("/")}
              onTrackChange={handleTrackChange}
              onPlaybackStateChange={handlePlaybackStateChange}
            />
          </main>
        </div>

        {/* Right Widget Panel */}
        <RightPanel
          nowPlayingTrack={tracks[currentTrackIndex]}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          tracks={tracks}
          trackDetails={trackDetails}
          currentTrackIndex={currentTrackIndex}
          onSelectTrack={(idx) => setCurrentTrackIndex(idx)}
          mood={mood}
        />
      </div>

      {/* Sticky Bottom Dock Player */}
      <BottomPlayer
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onShuffle={handleShuffleToggle}
        isShuffled={isShuffled}
        onRepeat={handleRepeatToggle}
        repeatMode={repeatMode}
        currentTrackIndex={currentTrackIndex}
        totalTracks={tracks.length}
        nowPlayingTrack={tracks[currentTrackIndex]}
        activeTrackName={activeDetail.name}
        activeArtistName={activeDetail.artist}
        activeImage={activeDetail.image}
        mood={mood}
      />
    </div>
  );
}