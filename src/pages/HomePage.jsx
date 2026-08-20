import React, { useState } from "react";
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
  onNavigate,
  onTrackChange,
  onPlaybackStateChange
}) {
  const { currentTheme, currentTime } = useTheme();

  // Default curated tracks when app first loads to match screenshot immediately
  const initialDefaultTracks = [
    "spotify:track:4iV5W9uYEdYUVa79Axb7Rh", // Vocal Studies
    "spotify:track:1Je1IMUlBXcx1Fz0WE7oPT", // Temples
    "spotify:track:6f70bfcMKEyc4DsCI5e8SI", // Earth Tones
    "spotify:track:0VjIjW4GlUZAMYd2vXMi3b", // Kollections 06
    "spotify:track:3n3Ppam7vgaVa1iaRUc9Lp", // Mr. Brightside
    "spotify:track:7qiZfU4dY1lWllzX7mPBI3", // Shape of You
    "spotify:track:2Fxmhks0bxVhyJocqXuqQ2", // Bad Guy
    "spotify:track:0V3wPSX9ygBnCm8psDIegu"  // Blinding Lights
  ];

  const activeTracks = tracks && tracks.length > 0 ? tracks : initialDefaultTracks;
  const activeMood = mood || "R&B Hits";

  return (
    <div className="space-y-6 pb-20">
      {/* AI Prompt Station & Voice Input (Compact & Pro Studio Design) */}
      <MoodForm 
        setMood={(m) => {
          setMood(m);
          setShowResults(true);
        }} 
        setTracks={(t) => {
          setTracks(t);
          setShowResults(true);
        }}
        onGenerated={(m, t) => {
          setMood(m);
          setTracks(t);
          setShowResults(true);
        }}
      />

      {/* Playlist Hero Banner & Matched Grid */}
      <PlaylistResult 
        mood={activeMood} 
        tracks={activeTracks}
        onTrackChange={onTrackChange}
        onPlaybackStateChange={onPlaybackStateChange}
      />
    </div>
  );
}
