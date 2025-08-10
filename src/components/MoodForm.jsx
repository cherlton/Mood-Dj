import React, { useState, useRef, useEffect } from "react";

export default function MoodForm({ setMood, setTracks }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const [recordingStatus, setRecordingStatus] = useState("");
  const [theme, setTheme] = useState("morning");
  const [currentTime, setCurrentTime] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Get current time and set theme
  useEffect(() => {
    const updateTimeAndTheme = () => {
      const now = new Date();
      const hours = now.getHours();
      
      // Update time display
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      
      // Set theme based on time
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
    const interval = setInterval(updateTimeAndTheme, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Theme configurations
  const themes = {
    morning: {
      background: "bg-gradient-to-br from-sky-400 via-sky-300 to-orange-200",
      glass: "bg-white/20 backdrop-blur-lg border border-white/30",
      button: "bg-gradient-to-r from-sky-500 to-orange-400 hover:from-sky-600 hover:to-orange-500",
      recordButton: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600",
      recordButtonActive: "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600",
      text: "text-slate-800",
      placeholder: "placeholder:text-slate-600",
      accent: "text-sky-600",
      icon: "☀️"
    },
    midday: {
      background: "bg-gradient-to-br from-orange-400 via-yellow-300 to-amber-200",
      glass: "bg-white/25 backdrop-blur-lg border border-white/40",
      button: "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600",
      recordButton: "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600",
      recordButtonActive: "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600",
      text: "text-slate-800",
      placeholder: "placeholder:text-slate-700",
      accent: "text-orange-600",
      icon: "🌞"
    },
    sunset: {
      background: "bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300",
      glass: "bg-white/20 backdrop-blur-lg border border-white/30",
      button: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
      recordButton: "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600",
      recordButtonActive: "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600",
      text: "text-slate-800",
      placeholder: "placeholder:text-slate-700",
      accent: "text-purple-600",
      icon: "🌅"
    },
    night: {
      background: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800",
      glass: "bg-white/10 backdrop-blur-lg border border-white/20",
      button: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
      recordButton: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
      recordButtonActive: "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700",
      text: "text-white",
      placeholder: "placeholder:text-slate-300",
      accent: "text-blue-400",
      icon: "🌙"
    }
  };

  const currentTheme = themes[theme];

  // Clear error when user starts typing or recording
  const clearError = () => {
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please enter some text or record your voice");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Analyze mood
      const moodRes = await fetch("http://192.168.1.101:5000/analyze_mood", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const moodData = await moodRes.json();
      const mood = moodData.mood;
      setMood(mood);

      // Get playlist
      const playlistRes = await fetch("http://192.168.1.101:5000/get_playlist", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood })
      });
      const playlistData = await playlistRes.json();
      setTracks(playlistData.tracks);
    } catch (err) {
      console.error("Error analyzing mood or getting playlist:", err);
      setError("Failed to analyze mood or get playlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecord = async () => {
    if (recording) {
      // Stop recording
      mediaRecorderRef.current.stop();
      setRecording(false);
      setRecordingStatus("Processing...");
    } else {
      // Start recording
      clearError();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });
        
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          setRecordingStatus("Transcribing...");
          try {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            const formData = new FormData();
            formData.append("audio", audioBlob, "recording.webm");
            formData.append("language", "en");

            setLoading(true);

            const response = await fetch("http://192.168.1.101:5000/analyze-voice", {
              method: 'POST',
              body: formData,
              timeout: 60000,
            });

            const data = await response.json();
            const { transcription, mood } = data;

            if (transcription) {
              setText(transcription);
              setMood(mood);

              const playlistRes = await fetch("http://192.168.1.101:5000/get_playlist", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mood })
              });
              const playlistData = await playlistRes.json();
              setTracks(playlistData.tracks);

              setRecordingStatus("Complete!");
              setTimeout(() => setRecordingStatus(""), 2000);
            } else {
              throw new Error("No transcription found.");
            }

          } catch (err) {
            console.error("Transcription error:", err);

            if (err.code === 'ECONNABORTED') {
              setError("Transcription timeout. Please try with a shorter recording.");
            } else if (response?.status === 400) {
              setError("Invalid audio file. Please try recording again.");
            } else if (response?.status === 500) {
              const errorMsg = data?.message || "Server error during transcription";
              setError(`Transcription failed: ${errorMsg}`);
            } else {
              setError("Failed to transcribe audio. Please check your connection and try again.");
            }

            setRecordingStatus("");
          } finally {
            setLoading(false);
            stream.getTracks().forEach(track => track.stop());
          }
        };

        mediaRecorder.start(1000);
        setRecording(true);
        setRecordingStatus("Recording...");
        
      } catch (err) {
        console.error("Microphone error:", err);
        setError("Could not access microphone. Please check permissions and try again.");
        setRecordingStatus("");
      }
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} transition-all duration-1000 ease-in-out`}>
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        <div className={`${currentTheme.glass} rounded-3xl p-6 sm:p-8 lg:p-10 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl shadow-2xl`}>
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <span className="text-3xl sm:text-4xl lg:text-5xl">{currentTheme.icon}</span>
              <div>
                <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${currentTheme.text}`}>
                  MoodTunes AI
                </h1>
                <p className={`text-xs sm:text-sm lg:text-base ${currentTheme.accent} font-medium`}>
                  {currentTime} • {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </p>
              </div>
            </div>
            <div className={`h-px bg-gradient-to-r from-transparent via-white/30 to-transparent`}></div>
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

            {error && (
              <div className="bg-red-500/20 backdrop-blur-md border border-red-400/30 text-red-100 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-lg">
                <div className="flex items-start gap-2">
                  <span className="text-red-300 flex-shrink-0">⚠️</span>
                  <span className="text-sm sm:text-base">{error}</span>
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
                onClick={handleRecord}
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

          {/* Recording indicator */}
          {recording && (
            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 text-red-300">
              <div className="flex gap-1">
                <div className="w-1.5 h-4 sm:w-2 sm:h-6 bg-red-400 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-3 sm:w-2 sm:h-4 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1.5 h-6 sm:w-2 sm:h-8 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1.5 h-2 sm:w-2 sm:h-3 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <div className="w-1.5 h-5 sm:w-2 sm:h-7 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
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
      </div>
    </div>
  );
}