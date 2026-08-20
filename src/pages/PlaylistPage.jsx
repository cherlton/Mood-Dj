import React from "react";
import PlaylistResult from "../components/playlist/PlaylistResult";
import useTheme from "../hooks/useTheme";

export default function PlaylistPage({ mood, tracks, onBack, onTrackChange, onPlaybackStateChange }) {
  const { currentTheme } = useTheme();

  const initialDefaultTracks = [
    "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
    "spotify:track:1Je1IMUlBXcx1Fz0WE7oPT",
    "spotify:track:6f70bfcMKEyc4DsCI5e8SI",
    "spotify:track:0VjIjW4GlUZAMYd2vXMi3b"
  ];

  return (
    <div className="space-y-6 pb-20">
      <PlaylistResult 
        mood={mood || "Curated Hits"} 
        tracks={tracks && tracks.length > 0 ? tracks : initialDefaultTracks} 
        onTrackChange={onTrackChange}
        onPlaybackStateChange={onPlaybackStateChange}
      />
    </div>
  );
}
