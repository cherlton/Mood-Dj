import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Custom hook with dual MediaRecorder audio capture + live Web Speech API real-time speech-to-text recognition.
 */
export function useVoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("");
  const [recorderError, setRecorderError] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const speechRecognitionRef = useRef(null);
  const fullTranscriptRef = useRef("");

  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      // Stop SpeechRecognition if running
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }

      const capturedText = fullTranscriptRef.current || "";

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          setRecording(false);
          resolve({ audioBlob, text: capturedText.trim() });
        };
        try {
          mediaRecorderRef.current.stop();
        } catch (err) {
          setRecording(false);
          resolve({ audioBlob: null, text: capturedText.trim() });
        }
      } else {
        setRecording(false);
        resolve({ audioBlob: null, text: capturedText.trim() });
      }
    });
  }, []);

  const startRecording = useCallback(async (onTranscriptUpdate) => {
    setRecorderError("");
    setLiveTranscript("");
    fullTranscriptRef.current = "";

    try {
      // 1. Microphone audio stream setup
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus"
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setRecording(true);
      setRecordingStatus("Listening... You can talk now!");

      // 2. Browser Real-time Speech Recognition (Web Speech API)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = "en-US";

          recognition.onresult = (event) => {
            let currentText = "";
            for (let i = 0; i < event.results.length; i++) {
              currentText += event.results[i][0].transcript;
            }
            if (currentText) {
              fullTranscriptRef.current = currentText;
              setLiveTranscript(currentText);
              if (onTranscriptUpdate) {
                onTranscriptUpdate(currentText);
              }
            }
          };

          recognition.onerror = (event) => {
            console.log("Speech recognition notice:", event.error);
          };

          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch (recErr) {
          console.warn("Web Speech recognition not available or failed to start:", recErr);
        }
      }
    } catch (err) {
      console.error("Failed to start voice recording:", err);
      setRecorderError("Microphone access wasn't granted. Please enable your microphone or type your vibe.");
      setRecording(false);
      setRecordingStatus("");
    }
  }, []);

  // Cleanup stream tracks on unmount
  useEffect(() => {
    return () => {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch (e) {}
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    recording,
    recordingStatus,
    setRecordingStatus,
    recorderError,
    setRecorderError,
    liveTranscript,
    startRecording,
    stopRecording,
  };
}

export default useVoiceRecorder;
