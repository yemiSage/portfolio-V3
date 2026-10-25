import { useCallback, useEffect, useRef, useState } from "react";

// Longest recording we send; Whisper and the request size limit are both comfortable here.
const MAX_RECORDING_MS = 60000;
const PREFERRED_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];

export const isVoiceInputSupported = () =>
  typeof window !== "undefined" &&
  typeof window.MediaRecorder !== "undefined" &&
  Boolean(navigator.mediaDevices?.getUserMedia);

// Records from the microphone and returns the transcript via /api/transcribe.
// status: "idle" | "recording" | "transcribing"
export function useVoiceInput({ onText, onError }) {
  const [status, setStatus] = useState("idle");
  const [levels, setLevels] = useState(Array(18).fill(0));
  const analyserCleanup = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const stopTimerRef = useRef(null);
  const handlersRef = useRef({ onText, onError });
  handlersRef.current = { onText, onError };

  const releaseMic = (recorder) => {
    analyserCleanup.current?.(); analyserCleanup.current = null;
    recorder?.stream?.getTracks().forEach(track => track.stop());
  };

  const transcribe = async (blob) => {
    setStatus("transcribing");
    try {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": blob.type || "audio/webm" },
        body: blob,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Voice input failed. Please type your question.");
      if (data.text) handlersRef.current.onText(data.text);
      else handlersRef.current.onError("Didn't catch that. Please try again.");
    } catch (err) {
      handlersRef.current.onError(err.message || "Voice input failed. Please type your question.");
    } finally {
      setStatus("idle");
    }
  };

  const stop = useCallback(() => {
    clearTimeout(stopTimerRef.current);
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") recorder.stop();
  }, []);

  const start = useCallback(async () => {
    if (!isVoiceInputSupported()) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const context = new AudioContext();
        const source = context.createMediaStreamSource(stream);
        const analyser = context.createAnalyser(); analyser.fftSize = 128;
        source.connect(analyser);
        const samples = new Uint8Array(analyser.frequencyBinCount);
        const timer = setInterval(() => {
          analyser.getByteFrequencyData(samples);
          setLevels(Array.from({ length: 18 }, (_, i) => samples[i * 2] / 255));
        }, 70);
        analyserCleanup.current = () => { clearInterval(timer); source.disconnect(); void context.close(); };
      } catch { /* Recording remains available without the visual analyser. */ }
      const mimeType = PREFERRED_TYPES.find((type) => MediaRecorder.isTypeSupported?.(type));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        releaseMic(recorder);
        recorderRef.current = null;
        const blob = new Blob(chunksRef.current, { type: (recorder.mimeType || "audio/webm").split(";")[0] });
        if (blob.size > 0) transcribe(blob);
        else setStatus("idle");
      };
      recorderRef.current = recorder;
      recorder.start();
      setStatus("recording");
      stopTimerRef.current = setTimeout(stop, MAX_RECORDING_MS);
    } catch {
      setStatus("idle");
      handlersRef.current.onError("Microphone access was blocked. Allow it in your browser to speak.");
    }
  }, [stop]);

  // Release the microphone if the chat closes mid-recording.
  useEffect(
    () => () => {
      clearTimeout(stopTimerRef.current);
      const recorder = recorderRef.current;
      if (recorder) {
        recorder.onstop = null;
        if (recorder.state !== "inactive") recorder.stop();
        releaseMic(recorder);
      }
    },
    []
  );

  return { status, start, stop, levels };
}
