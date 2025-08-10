import React, { useState, useEffect } from "react";
import MoodForm from "./components/MoodForm";
import PlaylistResult from "./components/PlaylistResult";

export default function App() {
  const [mood, setMood] = useState("");
  const [tracks, setTracks] = useState([]);
  const [theme, setTheme] = useState("morning");
  const [showResults, setShowResults] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Get current time and set theme (consistent across all components)
  useEffect(() => {
    const updateTimeAndTheme = () => {
      const now = new Date();
      const hours = now.getHours();
      
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      
      if (hours >= 6 && hours < 10) {
        setTheme("morning");
      } else if (hours >= 10 && hours < 15) {
        setTheme("midday");
      } else if (hours >= 15 && hours < 20) {
        setTheme("sunset");
      } else {
        setTheme("night");
      }
    };
    
    updateTimeAndTheme();
    const interval = setInterval(updateTimeAndTheme, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Show results when mood and tracks are available
  useEffect(() => {
    if (mood && tracks.length > 0) {
      setShowResults(true);
    }
  }, [mood, tracks]);

  // Theme configurations
  const themes = {
    morning: {
      background: "bg-gradient-to-br from-sky-400 via-sky-300 to-orange-200",
      glass: "bg-white/20 backdrop-blur-lg border border-white/30",
      text: "text-slate-800",
      accent: "text-sky-600",
      icon: "☀️",
      greeting: "Good Morning"
    },
    midday: {
      background: "bg-gradient-to-br from-orange-400 via-yellow-300 to-amber-200",
      glass: "bg-white/25 backdrop-blur-lg border border-white/40",
      text: "text-slate-800",
      accent: "text-orange-600",
      icon: "🌞",
      greeting: "Good Afternoon"
    },
    sunset: {
      background: "bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300",
      glass: "bg-white/20 backdrop-blur-lg border border-white/30",
      text: "text-slate-800",
      accent: "text-purple-600",
      icon: "🌅",
      greeting: "Good Evening"
    },
    night: {
      background: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800",
      glass: "bg-white/10 backdrop-blur-lg border border-white/20",
      text: "text-white",
      accent: "text-blue-400",
      icon: "🌙",
      greeting: "Good Evening"
    }
  };

  const currentTheme = themes[theme];

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
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/2 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {!showResults ? (
          // Main Form View
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center max-w-4xl mx-auto">
              {/* Hero Section */}
              <div className="mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="text-6xl animate-bounce">{currentTheme.icon}</span>
                  <div className="text-left">
                    <h1 className={`text-5xl md:text-6xl font-bold ${currentTheme.text} mb-2`}>
                      AI Mood DJ
                    </h1>
                    <p className={`text-xl ${currentTheme.accent} font-medium`}>
                      {currentTheme.greeting}! Let's find your perfect playlist
                    </p>
                  </div>
                </div>
                
                <p className={`text-lg ${currentTheme.text} opacity-80 max-w-2xl mx-auto leading-relaxed`}>
                  Share how you're feeling, and our AI will curate the perfect soundtrack for your mood. 
                  Whether you're happy, sad, energetic, or contemplative - we've got the vibe.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
                <div className={`${currentTheme.glass} rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-300`}>
                  <div className="text-3xl mb-2">🎵</div>
                  <div className={`text-2xl font-bold ${currentTheme.text}`}>1M+</div>
                  <div className={`text-sm ${currentTheme.accent}`}>Songs Analyzed</div>
                </div>
                <div className={`${currentTheme.glass} rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-300`}>
                  <div className="text-3xl mb-2">🤖</div>
                  <div className={`text-2xl font-bold ${currentTheme.text}`}>AI</div>
                  <div className={`text-sm ${currentTheme.accent}`}>Powered Matching</div>
                </div>
                <div className={`${currentTheme.glass} rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-300`}>
                  <div className="text-3xl mb-2">⚡</div>
                  <div className={`text-2xl font-bold ${currentTheme.text}`}>Instant</div>
                  <div className={`text-sm ${currentTheme.accent}`}>Playlist Generation</div>
                </div>
              </div>

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
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
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
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                  </svg>
                </button>
                
                <button
                  className={`${currentTheme.glass} ${currentTheme.text} p-4 rounded-2xl shadow-lg hover:scale-110 transition-all duration-300`}
                  title="Share Playlist"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.50-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                  </svg>
                </button>
              </div>
            </div>

            <PlaylistResult mood={mood} tracks={tracks} />
          </div>
        )}
      </div>

      {/* Loading Overlay (if needed for transitions) */}
      {showResults && (
        <div 
          className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 pointer-events-none ${
            showResults ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}
    </div>
  );
}