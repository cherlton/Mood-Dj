import React, { useState } from "react";
import { Mic, MicOff, Sparkles, Send, Music, AlertCircle, Radio, Loader2 } from "lucide-react";
import useTheme from "../../hooks/useTheme";
import useVoiceRecorder from "../../hooks/useVoiceRecorder";
import moodService from "../../services/moodService";

export default function MoodForm({ setMood, setTracks, onGenerated }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { currentTheme, currentTime, themeKey } = useTheme();
  const {
    recording,
    recordingStatus,
    setRecordingStatus,
    recorderError,
    startRecording,
    stopRecording,
  } = useVoiceRecorder();

  const clearError = () => {
    if (error) setError("");
  };

  const presetMoods = [
    "🔥 Energetic Hip-Hop & Trap",
    "🌙 Late Night R&B Slow Jams",
    "🧘 Deep Focus & Ambient Chill",
    "✨ Euphoric Electronic Dance",
    "🎸 Nostalgic Indie Rock",
    "☕ Smooth Jazz & Soul"
  ];

  const handleSubmit = async (e, customPrompt) => {
    if (e) e.preventDefault();
    const promptToUse = (typeof customPrompt === "string" ? customPrompt : text).trim();
    if (!promptToUse) {
      setError("Please describe how you are feeling or record your voice");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Analyze mood
      const moodData = await moodService.analyzeMood(promptToUse);
      const detectedMood = moodData.mood;
      setMood(detectedMood);

      // 2. Get playlist
      const playlistData = await moodService.getPlaylist(detectedMood);
      const fetchedTracks = playlistData.tracks || [];
      setTracks(fetchedTracks);

      if (onGenerated) {
        onGenerated(detectedMood, fetchedTracks);
      }
    } catch (err) {
      console.error("Error analyzing mood or getting playlist:", err);
      setError(err.message || "Failed to analyze mood or get playlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecordToggle = async () => {
    if (recording) {
      setRecordingStatus("Processing...");
      const audioBlob = await stopRecording();

      if (!audioBlob) {
        setRecordingStatus("");
        return;
      }

      setRecordingStatus("Transcribing...");
      setLoading(true);
      clearError();

      try {
        const voiceRes = await moodService.analyzeVoice(audioBlob);
        const { transcription, mood: detectedMood } = voiceRes;

        if (transcription) {
          setText(transcription);
          setMood(detectedMood);

          const playlistData = await moodService.getPlaylist(detectedMood);
          const fetchedTracks = playlistData.tracks || [];
          setTracks(fetchedTracks);

          setRecordingStatus("Complete!");
          if (onGenerated) {
            onGenerated(detectedMood, fetchedTracks);
          }
          setTimeout(() => setRecordingStatus(""), 2000);
        } else {
          throw new Error("No transcription found.");
        }
      } catch (err) {
        console.error("Voice analysis error:", err);
        if (err.code === 'ECONNABORTED') {
          setError("Transcription timeout. Please try with a shorter recording.");
        } else if (err.status === 400) {
          setError("Invalid audio file. Please try recording again.");
        } else if (err.status === 500) {
          setError(err.message || "Server error during transcription.");
        } else {
          setError(err.message || "Failed to transcribe audio. Please check your connection and try again.");
        }
        setRecordingStatus("");
      } finally {
        setLoading(false);
      }
    } else {
      clearError();
      await startRecording();
    }
  };

  const activeError = error || recorderError;

  return (
    <div className="w-full bg-[#13141c] border border-[#222534] rounded-xl p-4 shadow-xl select-none transition-all">
      {/* Top Header Row of the Input Card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#ff5d2b]/15 text-[#ff7a45] flex items-center justify-center font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide">
              AI Mood Prompt Station
            </h3>
            <p className="text-[10px] text-gray-400">
              Type your feelings, vibe, or record live voice to curate a mix
            </p>
          </div>
        </div>

        {/* Live status badge */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1c1f2c] border border-white/5 text-[10px] text-gray-300">
          <span className={`w-1.5 h-1.5 rounded-full ${recording ? "bg-red-500 animate-ping" : loading ? "bg-amber-400 animate-spin" : "bg-emerald-400"}`}></span>
          <span>{recording ? "Recording Mic" : loading ? "Curating..." : "Ready"}</span>
        </div>
      </div>

      {/* Input Box */}
      <div className="relative">
        <textarea
          rows={2}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            clearError();
          }}
          disabled={loading || recording}
          placeholder="e.g. 'Feeling relaxed after a long day with a warm cup of coffee under rainy skies'..."
          className="w-full bg-[#0d0e14] hover:bg-[#101118] focus:bg-[#101118] text-white placeholder-gray-500 text-xs rounded-lg p-3 pr-24 border border-[#222535] focus:border-[#ff5d2b]/70 focus:outline-none resize-none transition-all"
        />

        {/* Recording status pill overlay inside textarea */}
        {recordingStatus && (
          <div className="absolute top-2.5 right-2.5 bg-[#1b1e2a] border border-[#ff5d2b]/40 text-[#ff7a45] px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1.5 shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5d2b] animate-pulse"></span>
            <span>{recordingStatus}</span>
          </div>
        )}
      </div>

      {/* Error message if any */}
      {activeError && (
        <div className="mt-2.5 p-2 bg-red-950/40 border border-red-500/30 rounded-lg text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <span className="truncate">{activeError}</span>
        </div>
      )}

      {/* Action Controls & Preset Vibe Tags */}
      <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Preset Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {presetMoods.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setText(preset.replace(/^[^\w]+/, ''));
                clearError();
              }}
              className="flex-shrink-0 px-2.5 py-1 rounded-md bg-[#181a25] hover:bg-[#222536] hover:text-white border border-[#242736] text-gray-400 text-[10px] font-medium transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Buttons Row */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Voice Record Button */}
          <button
            type="button"
            onClick={handleRecordToggle}
            disabled={loading}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              recording
                ? "bg-red-600 text-white animate-pulse shadow-md shadow-red-600/30"
                : "bg-[#1d202d] hover:bg-[#282c3f] text-gray-300 hover:text-white border border-[#2a2e42]"
            }`}
            title={recording ? "Stop Voice Recording" : "Record Voice Mood"}
          >
            {recording ? (
              <>
                <MicOff className="w-3.5 h-3.5 text-white" />
                <span>Stop Voice</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-[#ff7a45]" />
                <span>Voice</span>
              </>
            )}
          </button>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || recording || !text.trim()}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#ff5d2b] to-[#ff7a45] hover:from-[#f0501d] hover:to-[#ff6830] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-md shadow-[#ff5d2b]/20 transition-all transform active:scale-95 flex-1 sm:flex-initial"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curate Playlist</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
