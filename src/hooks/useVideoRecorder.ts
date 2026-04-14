"use client";

import { useState, useRef, useCallback } from "react";

interface UseVideoRecorderReturn {
  isRecording: boolean;
  recordedVideo: Blob | null;
  startRecording: (canvas: HTMLCanvasElement) => Promise<void>;
  stopRecording: () => void;
  downloadVideo: () => void;
  clearRecording: () => void;
}

export function useVideoRecorder(): UseVideoRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async (canvas: HTMLCanvasElement) => {
    try {
      // Get canvas stream
      const stream = canvas.captureStream(30); // 30 FPS

      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setRecordedVideo(blob);
        setIsRecording(false);
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Stop all tracks to release camera
      const stream = mediaRecorderRef.current.stream;
      stream.getTracks().forEach(track => track.stop());
    }
  }, [isRecording]);

  const downloadVideo = useCallback(() => {
    if (!recordedVideo) return;

    const url = URL.createObjectURL(recordedVideo);
    const a = document.createElement("a");
    a.href = url;
    a.download = `makeup-tutorial-${new Date().toISOString().slice(0, 10)}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [recordedVideo]);

  const clearRecording = useCallback(() => {
    setRecordedVideo(null);
    chunksRef.current = [];
  }, []);

  return {
    isRecording,
    recordedVideo,
    startRecording,
    stopRecording,
    downloadVideo,
    clearRecording,
  };
}
