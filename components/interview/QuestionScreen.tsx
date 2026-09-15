"use client";
import { useRef, useState, useEffect } from "react";
import { Video, Square, RefreshCw, Camera, AlertTriangle, ChevronRight } from "lucide-react";
import type { QuestionItem } from "../../api/interviewClient";

interface QuestionScreenProps {
  question: QuestionItem;
  totalQuestions: number;
  isUploading: boolean;
  onSubmit: (videoBlob: Blob, mimeType: string) => void;
}

export default function QuestionScreen({
  question,
  totalQuestions,
  isUploading,
  onSubmit,
}: QuestionScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [permissionError, setPermissionError] = useState("");
  const [recordingMimeType, setRecordingMimeType] = useState("video/webm");
  const [timeLeft, setTimeLeft] = useState(60);

  // Revoke old preview URL on change
  useEffect(() => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl("");
    }
  }, [recordedBlob]);

  // Attach stream to video element
  useEffect(() => {
    if (stream && videoRef.current && !recordedBlob) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(console.error);
    }
  }, [stream, recordedBlob]);

  // Cleanup on unmount or question change
  useEffect(() => {
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);

  // Reset recorded state when question changes
  useEffect(() => {
    setRecordedBlob(null);
    setPreviewUrl("");
    setTimeLeft(60);
  }, [question.question_id]);

  // Handle 1-minute recording limit
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRecording && timeLeft === 0) {
      stopRecording();
    }
    return () => clearInterval(interval);
  }, [isRecording, timeLeft]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      setStream(mediaStream);
      setPermissionError("");
    } catch {
      setPermissionError(
        "Camera or microphone access was denied. Please allow access in your browser settings and try again."
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const startRecording = () => {
    if (!stream) return;
    let recorder: MediaRecorder;
    let mimeType = "video/webm";
    try {
      recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    } catch {
      try {
        recorder = new MediaRecorder(stream, { mimeType: "video/mp4" });
        mimeType = "video/mp4";
      } catch {
        recorder = new MediaRecorder(stream);
        mimeType = recorder.mimeType || "video/webm";
      }
    }

    setRecordingMimeType(mimeType);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      setRecordedBlob(blob);
      stopCamera();
    };

    recorder.start(500);
    setMediaRecorder(recorder);
    setIsRecording(true);
    setTimeLeft(60);
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const retake = () => {
    setRecordedBlob(null);
    startCamera();
  };

  const handleSubmit = () => {
    if (recordedBlob) {
      onSubmit(recordedBlob, recordingMimeType);
    }
  };

  const progress = question.question_number / totalQuestions;

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-5 py-10 anim-fade">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{
              background: "var(--accent-subtle)",
              color: "var(--accent)",
              border: "1px solid var(--accent-border)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Question {question.question_number} of {totalQuestions}
          </span>
          <span className="text-xs text-[var(--text-3)]" style={{ fontFamily: "var(--font-mono)" }}>
            {Math.round(progress * 100)}% complete
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden mb-6">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%`, background: "var(--accent)" }}
          />
        </div>

        {/* Question text */}
        <div className="card p-5 mb-5">
          <p className="text-[11px] text-[var(--text-3)] uppercase tracking-widest font-medium mb-2">
            Your question
          </p>
          <p
            className="text-lg font-medium text-[var(--text-1)] leading-snug"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {question.question_text}
          </p>
        </div>
      </div>

      {/* Camera / recording area */}
      {!stream && !recordedBlob ? (
        <div className="flex flex-col items-center justify-center p-10 text-center border border-dashed rounded-xl border-[var(--border)] bg-[var(--bg-surface)] h-72 anim-up">
          <Camera size={32} className="mb-4 text-[var(--text-3)]" />
          <p className="text-sm font-medium text-[var(--text-1)] mb-2">Ready to record?</p>
          <p className="text-xs text-[var(--text-2)] mb-6 max-w-xs leading-relaxed">
            Take a moment to compose yourself, then click below to start your camera.
          </p>
          {permissionError && (
            <div className="flex items-start gap-2 p-3 rounded-lg text-xs mb-4 text-left max-w-xs"
              style={{ background: "var(--warning-subtle)", color: "var(--warning)", border: "1px solid rgba(217,123,41,0.22)" }}>
              <AlertTriangle size={13} className="mt-px shrink-0" />
              {permissionError}
            </div>
          )}
          <button
            type="button"
            onClick={startCamera}
            disabled={isUploading}
            className="btn-primary px-6 py-2.5 text-sm"
          >
            Enable Camera
          </button>
        </div>
      ) : (
        <div
          className="relative w-full overflow-hidden rounded-xl bg-black border border-[var(--border)] anim-up"
          style={{ aspectRatio: "16/9" }}
        >
          {recordedBlob ? (
            <video key="preview" src={previewUrl} controls playsInline className="w-full h-full object-cover" />
          ) : (
            <video key="live" ref={videoRef} muted playsInline className="w-full h-full object-cover transform -scale-x-100" />
          )}

          {/* Live controls */}
          {!recordedBlob && (
            <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-4">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                  <Video size={16} className="text-red-500" /> Start Recording
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-red-600 transition-colors shadow-lg"
                >
                  <Square size={14} fill="currentColor" /> Stop Recording
                </button>
              )}
            </div>
          )}

          {/* REC badge with countdown */}
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-medium text-white tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
                REC
              </span>
              <span className="text-[11px] font-medium text-[var(--accent)] tracking-wider ml-2 border-l border-white/20 pl-2" style={{ fontFamily: "var(--font-mono)" }}>
                00:{timeLeft.toString().padStart(2, "0")}
              </span>
            </div>
          )}

          {/* Retake button */}
          {recordedBlob && !isUploading && (
            <div className="absolute top-4 left-4">
              <button
                type="button"
                onClick={retake}
                className="flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium transition-colors border border-white/20"
              >
                <RefreshCw size={13} /> Retake
              </button>
            </div>
          )}
        </div>
      )}

      {/* Submit */}
      {recordedBlob && (
        <div className="mt-5 flex justify-end anim-up">
          <button
            id={`submit-q${question.question_number}-btn`}
            onClick={handleSubmit}
            disabled={isUploading}
            className="btn-primary px-6 py-2.5 text-sm gap-2"
          >
            {isUploading ? (
              <>
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                Submitting…
              </>
            ) : (
              <>
                Submit Answer
                <ChevronRight size={15} />
              </>
            )}
          </button>
        </div>
      )}

      {/* Step indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: totalQuestions }).map((_, i) => {
          const qNum = i + 1;
          const isCurrent = qNum === question.question_number;
          const isDone = qNum < question.question_number;
          return (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: isCurrent ? "2rem" : "0.5rem",
                background: isDone
                  ? "var(--success)"
                  : isCurrent
                  ? "var(--accent)"
                  : "var(--border)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
