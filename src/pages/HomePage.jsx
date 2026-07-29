import React from "react";
import Header from "../components/common/Header";
import StatsSection from "../components/common/StatsSection";
import MoodForm from "../components/mood/MoodForm";
import PlaylistResult from "../components/playlist/PlaylistResult";
import useTheme from "../hooks/useTheme";

export default function HomePage({
  mood,
  setMood,
  tracks,
  setTracks,
  showResults,
  setShowResults,
  onNavigate
}) {
  const { currentTheme, currentTime } = useTheme();

  const handleNewSearch = () => {
    setMood("");
    setTracks([]);
    setShowResults(false);
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} transition-all duration-1000 ease-in-out overflow-hidden`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/2 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {!showResults ? (
          // Main Form View
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center max-w-4xl mx-auto">
              {/* Hero Section Header */}
              <Header currentTheme={currentTheme} />

              {/* Stats Cards */}
              <StatsSection currentTheme={currentTheme} />

              {/* MoodForm */}
              <div className="flex justify-center">
                <MoodForm setMood={setMood} setTracks={setTracks} />
              </div>

              {/* Footer Info */}
              <div className="mt-16 text-center">
                <div className={`inline-flex items-center gap-2 ${currentTheme.glass} px-6 py-3 rounded-full`}>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className={`${currentTheme.text} opacity-75 text-sm`}>
                    {currentTime} • AI Ready • Spotify Connected
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Results View
          <div className="relative">
            {/* Back Button */}
            <div className="absolute top-6 left-6 z-20">
              <button
                onClick={handleNewSearch}
                className={`${currentTheme.glass} ${currentTheme.text} p-4 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 group`}
              >
                <div className="flex items-center gap-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="group-hover:-translate-x-1 transition-transform duration-300"
                  >
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                  </svg>
                  <span className="font-medium">New Search</span>
                </div>
              </button>
            </div>

            {/* Floating Controls */}
            <div className="fixed bottom-6 right-6 z-20">
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleNewSearch}
                  className={`${currentTheme.glass} text-white p-4 rounded-2xl shadow-lg hover:scale-110 transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500`}
                  title="Try Another Mood"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                  </svg>
                </button>
              </div>
            </div>

            <PlaylistResult mood={mood} tracks={tracks} />
          </div>
        )}
      </div>
    </div>
  );
}
