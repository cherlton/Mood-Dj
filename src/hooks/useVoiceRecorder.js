import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Custom hook encapsulating MediaRecorder setup, audio streaming, audio chunking, and state management.
 */
export function useVoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("");
  const [recorderError, setRecorderError] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          setRecording(false);
          resolve(audioBlob);
        };
        mediaRecorderRef.current.stop();
      } else {
        setRecording(false);
        resolve(null);
      }
    });
  }, []);

  const startRecording = useCallback(async () => {
    setRecorderError("");
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

      mediaRecorder.start();
      setRecording(true);
      setRecordingStatus("Recording...");
    } catch (err) {
      console.error("Failed to start voice recording:", err);
      setRecorderError("Microphone access denied or not available.");
      setRecording(false);
      setRecordingStatus("");
    }
  }, []);

  // Cleanup stream tracks on unmount
  useEffect(() => {
    return () => {
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
    startRecording,
    stopRecording,
  };
}

export default useVoiceRecorder;
