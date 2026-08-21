import React, { useState, useEffect } from "react";
import { Mic, MicOff, Sparkles, AlertCircle, Loader2, Volume2 } from "lucide-react";
import useTheme from "../../hooks/useTheme";
import useVoiceRecorder from "../../hooks/useVoiceRecorder";
import moodService from "../../services/moodService";

export default function MoodForm({ setMood, setTracks, setTrackDetails, onGenerated }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { currentTheme, currentTime } = useTheme();
  const {
    recording,
    recordingStatus,
    setRecordingStatus,
    recorderError,
    setRecorderError,
    liveTranscript,
    startRecording,
    stopRecording,
  } = useVoiceRecorder();

  // Stream live transcription into textarea while speaking
  useEffect(() => {
    if (recording && liveTranscript) {
      setText(liveTranscript);
    }
  }, [recording, liveTranscript]);

  const clearError = () => {
    if (error) setError("");
    if (recorderError && setRecorderError) setRecorderError("");
  };

  const presetMoods = [
    "🔥 Energetic Hip-Hop & Trap",
    "🌙 Late Night R&B Slow Jams",
    "🧘 Deep Focus & Ambient Chill",
    "✨ Euphoric Electronic Dance",
    "🎸 Nostalgic Indie Rock",
    "☕ Smooth Jazz & Soul"
  ];

  // Helper to convert technical errors to human-friendly language for text / Spotify curation
  const getFriendlyErrorMessage = (err) => {
    if (!err) return "Something went wrong while curating your mix. Please try again.";
    
    const message = (err.message || err.toString() || "");
    const lower = message.toLowerCase();

    if (err.code === "ECONNABORTED" || lower.includes("timeout")) {
      return "Connection timed out. Please check your network and try again.";
    }
    if (lower.includes("failed to fetch") || lower.includes("network error") || err.status === 0) {
      return "Unable to connect to the backend server. Please make sure the server is running.";
    }
    if (err.status === 429 || lower.includes("rate limit")) {
      return "Spotify/AI is receiving high traffic right now. Please wait a moment and try again.";
    }
    
    // Display specific backend / Spotify error message directly
    if (message && message.length > 5) {
      return message;
    }
    
    return "Couldn't curate playlist for this prompt. Try a different mood keyword or artist name!";
  };

  const executeCurate = async (promptToUse) => {
    setLoading(true);
    setError("");
    if (setRecorderError) setRecorderError("");

    try {
      // 1. Analyze mood via Gemini AI
      let detectedMood = promptToUse;
      try {
        const moodData = await moodService.analyzeMood(promptToUse);
        if (moodData && moodData.mood) {
          detectedMood = moodData.mood;
        }
      } catch (aiErr) {
        console.warn("Using text directly for playlist curation:", aiErr);
      }

      if (setMood) setMood(detectedMood);

      // 2. Query Spotify live API
      const playlistData = await moodService.getPlaylist(detectedMood);
      const fetchedTracks = playlistData?.tracks || [];
      const fetchedDetails = playlistData?.track_details || [];

      if (setTracks) setTracks(fetchedTracks);
      if (setTrackDetails) setTrackDetails(fetchedDetails);

      if (onGenerated) {
        onGenerated(detectedMood, fetchedTracks, fetchedDetails);
      }
    } catch (err) {
      console.error("Error curating playlist:", err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, customPrompt) => {
    if (e) e.preventDefault();
    clearError();
    const promptToUse = (typeof customPrompt === "string" ? customPrompt : text).trim();
    if (!promptToUse) {
      setError("Please describe how you're feeling or tap one of the vibe tags below!");
      return;
    }

    await executeCurate(promptToUse);
  };

  const handleVoiceToggle = async () => {
    clearError();

    if (recording) {
      setRecordingStatus("Processing voice...");
      const result = await stopRecording();
      const audioBlob = result?.audioBlob;
      const spokenText = (result?.text || text || "").trim();

      // If live transcription in browser captured text, use it directly!
      if (spokenText) {
        setText(spokenText);
        setRecordingStatus("Curating mix from speech...");
        await executeCurate(spokenText);
        setRecordingStatus("");
        return;
      }

      // If no live text was captured, try backend audio analysis if audio blob exists
      if (audioBlob) {
        setRecordingStatus("Transcribing with AssemblyAI...");
        setLoading(true);

        try {
          const voiceRes = await moodService.analyzeVoice(audioBlob);
          const { transcription, mood: detectedMood } = voiceRes || {};

          if (transcription) {
            setText(transcription);
            const activeMood = detectedMood || transcription;
            await executeCurate(activeMood);
            setRecordingStatus("Complete!");
            setTimeout(() => setRecordingStatus(""), 2000);
          } else {
            throw new Error("No speech detected. Please speak clearly into your mic.");
          }
        } catch (err) {
          console.warn("Backend voice analysis notice:", err);
          setError(getFriendlyErrorMessage(err));
          setRecordingStatus("");
        } finally {
          setLoading(false);
        }
      } else {
        setError("No audio detected. Please click the mic and speak clearly!");
        setRecordingStatus("");
      }
    } else {
      await startRecording((liveText) => {
        setText(liveText);
      });
    }
  };

  // Only show mic error if recording action was explicitly triggered and failed
  const activeError = error || recorderError;

  return (
    <div className="w-full bg-[#13141c] border border-[#222534] rounded-xl p-4 shadow-xl select-none transition-all">
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#ff5d2b]/15 text-[#ff7a45] flex items-center justify-center font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
              AI Mood Prompt Station
            </h3>
            <p className="text-[10px] text-gray-400">
              Type your feelings, vibe, or speak into the mic to curate a mix
            </p>
          </div>
        </div>

        {/* Live status badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1c1f2c] border border-white/5 text-[10px] text-gray-300">
          <span className={`w-2 h-2 rounded-full ${recording ? "bg-red-500 animate-ping" : loading ? "bg-amber-400 animate-spin" : "bg-emerald-400"}`}></span>
          <span className="font-medium">
            {recording ? "🎙️ Listening... Speak now!" : loading ? "Curating Mix..." : "Ready"}
          </span>
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
          placeholder={recording ? "🎙️ Listening to you... Speak now about your vibe!" : "e.g. 'Energetic Hip-Hop & Trap' or 'Summer Walker late night slow jams'..."}
          className={`w-full bg-[#0d0e14] hover:bg-[#101118] focus:bg-[#101118] text-white placeholder-gray-500 text-xs rounded-lg p-3 pr-24 border transition-all resize-none ${
            recording 
              ? "border-red-500/60 ring-1 ring-red-500/30 bg-[#12080a]" 
              : "border-[#222535] focus:border-[#ff5d2b]/70 focus:outline-none"
          }`}
        />

        {/* Voice recording feedback text */}
        {recordingStatus && (
          <div className="absolute top-2 right-3 text-[10px] font-semibold text-[#ff7a45] bg-black/60 px-2 py-0.5 rounded border border-[#ff5d2b]/30 flex items-center gap-1 backdrop-blur-sm animate-pulse">
            <Volume2 className="w-3 h-3" />
            <span>{recordingStatus}</span>
          </div>
        )}
      </div>

      {/* Error alert message bar */}
      {activeError && (
        <div className="mt-2.5 p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span className="leading-snug">{activeError}</span>
        </div>
      )}

      {/* Preset Mood Pills & Actions */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {presetMoods.map((preset) => {
            const cleanText = preset.replace(/^[^\w]+/, "").trim();
            return (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setText(cleanText);
                  clearError();
                  handleSubmit(null, cleanText);
                }}
                disabled={loading || recording}
                className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#1a1c27] hover:bg-[#252838] hover:text-[#ff7a45] text-gray-300 border border-[#262a3d] transition-all cursor-pointer transform active:scale-95 disabled:opacity-50"
              >
                {preset}
              </button>
            );
          })}
        </div>

        {/* Voice & Submit Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            id="voice-record-btn"
            onClick={handleVoiceToggle}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              recording
                ? "bg-red-500/20 text-red-400 border-red-500/50 animate-pulse shadow-lg shadow-red-500/20"
                : "bg-[#1c1f2c] hover:bg-[#252838] text-gray-300 border-[#2b2f42] hover:text-white"
            }`}
          >
            {recording ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5 text-[#ff7a45]" />}
            <span>{recording ? "Stop Recording" : "Voice"}</span>
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e)}
            disabled={loading || recording}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#ff5d2b] to-[#ff7a45] hover:from-[#f0501d] hover:to-[#ff6830] text-white px-4 py-1.5 rounded-lg font-bold text-xs shadow-lg shadow-[#ff5d2b]/20 transition-transform transform active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Curating...</span>
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
