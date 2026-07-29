import React from "react";

/**
 * Modularized Header component for Hero section.
 */
export default function Header({ currentTheme }) {
  return (
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
  );
}
