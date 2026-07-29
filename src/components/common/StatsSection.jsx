import React from "react";

/**
 * Modularized Stats Cards component.
 */
export default function StatsSection({ currentTheme }) {
  const stats = [
    { icon: "🎵", value: "1M+", label: "Songs Analyzed" },
    { icon: "🤖", value: "AI", label: "Powered Matching" },
    { icon: "⚡", value: "Instant", label: "Playlist Generation" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`${currentTheme.glass} rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-300`}
        >
          <div className="text-3xl mb-2">{stat.icon}</div>
          <div className={`text-2xl font-bold ${currentTheme.text}`}>{stat.value}</div>
          <div className={`text-sm ${currentTheme.accent}`}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
