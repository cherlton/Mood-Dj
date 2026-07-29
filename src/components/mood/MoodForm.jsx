import React, { useState } from "react";
import useTheme from "../../hooks/useTheme";
import useVoiceRecorder from "../../hooks/useVoiceRecorder";
import moodService from "../../services/moodService";

export default function MoodForm({ setMood, setTracks }) {
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

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim()) {
      setError("Please enter some text or record your voice");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Analyze mood
      const moodData = await moodService.analyzeMood(text);
      const mood = moodData.mood;
      setMood(mood);

      // 2. Get playlist
      const playlistData = await moodService.getPlaylist(mood);
      setTracks(playlistData.tracks || []);
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
        const { transcription, mood } = voiceRes;

        if (transcription) {
          setText(transcription);
          setMood(mood);

          const playlistData = await moodService.getPlaylist(mood);
          setTracks(playlistData.tracks || []);

          setRecordingStatus("Complete!");
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
    <div className={`${currentTheme.glass} rounded-3xl p-6 sm:p-8 lg:p-10 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl shadow-2xl transition-all duration-300`}>
      {/* Header inside form container if needed, or sub-header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <span className="text-3xl sm:text-4xl lg:text-5xl">{currentTheme.icon}</span>
          <div>
            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${currentTheme.text}`}>
              MoodTunes AI
            </h2>
            <p className={`text-xs sm:text-sm lg:text-base ${currentTheme.accent} font-medium`}>
              {currentTime} • {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
            </p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="relative group">
          <textarea
            className={`${currentTheme.glass} ${currentTheme.text} ${currentTheme.placeholder} p-4 sm:p-6 lg:p-8 rounded-2xl w-full resize-none focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 text-base sm:text-lg lg:text-xl leading-relaxed`}
            rows="3"
            placeholder="How are you feeling today? Share your mood..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              clearError();
            }}
            disabled={loading || recording}
          />
          {recordingStatus && (
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/20 backdrop-blur-md text-white px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-white/30">
              <div className="flex items-center gap-1 sm:gap-2">
                {recordingStatus === "Recording..." && (
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full animate-pulse"></div>
                )}
                {recordingStatus === "Processing..." && (
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-spin"></div>
                )}
                {recordingStatus === "Transcribing..." && (
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce"></div>
                )}
                {recordingStatus === "Complete!" && (
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></div>
                )}
                <span className="hidden sm:inline">{recordingStatus}</span>
                <span className="sm:hidden">{recordingStatus.split('...')[0]}</span>
              </div>
            </div>
          )}
        </div>

        {activeError && (
          <div className="bg-red-500/20 backdrop-blur-md border border-red-400/30 text-red-100 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-lg">
            <div className="flex items-start gap-2">
              <span className="text-red-300 flex-shrink-0">⚠️</span>
              <span className="text-sm sm:text-base">{activeError}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || recording || !text.trim()}
            className={`${currentTheme.button} text-white py-3 sm:py-4 lg:py-5 px-4 sm:px-6 lg:px-8 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex-1 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg text-sm sm:text-base lg:text-lg`}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  <span className="hidden sm:inline">Generating...</span>
                  <span className="sm:hidden">Gen...</span>
                </>
              ) : (
                <>
                  <span className="text-sm sm:text-base">🎵</span>
                  <span className="hidden sm:inline">Generate Playlist</span>
                  <span className="sm:hidden">Generate</span>
                </>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={handleRecordToggle}
            disabled={loading}
            className={`${recording ? currentTheme.recordButtonActive : currentTheme.recordButton} text-white py-3 sm:py-4 lg:py-5 px-4 sm:px-6 lg:px-8 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-initial transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${recording ? 'animate-pulse' : ''} text-sm sm:text-base lg:text-lg`}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              {recording ? (
                <>
                  <span className="text-lg sm:text-xl">🔴</span>
                  Stop
                </>
              ) : (
                <>
                  <span className="text-lg sm:text-xl">🎤</span>
                  Record
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Recording animation indicator */}
      {recording && (
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 text-red-300">
          <div className="flex gap-1">
            <div className="w-1.5 h-4 sm:w-2 sm:h-6 bg-red-400 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-3 sm:w-2 sm:h-4 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1.5 h-6 sm:w-2 sm:h-8 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-2 sm:w-2 sm:h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-1.5 h-5 sm:w-2 sm:h-7 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className="font-medium text-sm sm:text-base">Listening...</span>
        </div>
      )}

      {/* Loading indicator */}
      {loading && !recording && (
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
          <div className="relative">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <span className={`font-medium text-sm sm:text-base ${currentTheme.text}`}>
            Analyzing your mood...
          </span>
        </div>
      )}

      {/* AI Badge */}
      <div className="text-center mt-6 sm:mt-8">
        <div className="inline-flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className={`${currentTheme.text} opacity-75`}>Powered by AI</span>
        </div>
      </div>
    </div>
  );
}
