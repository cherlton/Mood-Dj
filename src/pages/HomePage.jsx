import React from "react";
import MoodForm from "../components/mood/MoodForm";
import PlaylistResult from "../components/playlist/PlaylistResult";
import useTheme from "../hooks/useTheme";

export default function HomePage({
  mood,
  setMood,
  tracks = [],
  setTracks,
  trackDetails = [],
  setTrackDetails,
  showResults,
  setShowResults,
  onNavigate,
  onTrackChange,
  onPlaybackStateChange
}) {
  const { currentTheme, currentTime } = useTheme();

  return (
    <div className="space-y-6 pb-20">
      {/* AI Prompt Station & Voice Input */}
      <MoodForm 
        setMood={(m) => {
          setMood(m);
          setShowResults(true);
        }} 
        setTracks={(t) => {
          setTracks(t);
          setShowResults(true);
        }}
        setTrackDetails={(d) => {
          if (setTrackDetails) setTrackDetails(d);
        }}
        onGenerated={(m, t, d) => {
          setMood(m);
          setTracks(t);
          if (setTrackDetails && d) setTrackDetails(d);
          setShowResults(true);
        }}
      />

      {/* Playlist Hero Banner & Matched 8-Track Grid */}
      <PlaylistResult 
        mood={mood} 
        tracks={tracks}
        trackDetails={trackDetails}
        onTrackChange={onTrackChange}
        onPlaybackStateChange={onPlaybackStateChange}
      />
    </div>
  );
}
