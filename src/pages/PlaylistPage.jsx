import React from "react";
import PlaylistResult from "../components/playlist/PlaylistResult";
import useTheme from "../hooks/useTheme";

export default function PlaylistPage({ mood, tracks, onBack }) {
  const { currentTheme } = useTheme();

  return (
    <div className={`min-h-screen ${currentTheme.background} transition-all duration-1000 ease-in-out`}>
      <div className="relative z-10">
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={onBack}
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
              <span className="font-medium">Back to Generator</span>
            </div>
          </button>
        </div>

        <PlaylistResult mood={mood} tracks={tracks} />
      </div>
    </div>
  );
}
