import { useRef, useState, useEffect } from "react";
import { Video, Square, RefreshCw, Camera } from "lucide-react";

interface RecordVideoProps {
  onRecordComplete: (file: File | null) => void;
  disabled?: boolean;
}

export default function RecordVideo({ onRecordComplete, disabled }: RecordVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [permissionError, setPermissionError] = useState("");

  useEffect(() => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl("");
    }
  }, [recordedBlob]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      setPermissionError("");
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setPermissionError("Camera or microphone access denied. Please allow access to record.");
    }
  };

  useEffect(() => {
    if (stream && videoRef.current && !recordedBlob) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(console.error);
    }
  }, [stream, recordedBlob]);


  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Ensure camera stops when component unmounts
  useEffect(() => {
    return () => stopCamera();
  }, [stream]);

  const startRecording = () => {
    if (!stream) return;
    
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    } catch (e) {
      recorder = new MediaRecorder(stream);
    }
    
    const chunksRef: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunksRef.push(e.data);
      }
    };

    recorder.onstop = () => {
      const finalMimeType = recorder.mimeType || 'video/webm';
      const blob = new Blob(chunksRef, { type: finalMimeType });
      setRecordedBlob(blob);
      stopCamera();
      
      let ext = "webm";
      if (finalMimeType.includes("mp4")) ext = "mp4";
      const file = new File([blob], `recorded-interview.${ext}`, { type: finalMimeType });
      onRecordComplete(file);
    };

    recorder.start(500);
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const retake = () => {
    setRecordedBlob(null);
    onRecordComplete(null);
    startCamera();
  };

  if (!stream && !recordedBlob) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl border-[var(--border)] bg-[var(--bg-surface)] w-full max-w-xl mx-auto anim-up h-[320px]">
        <Camera size={32} className="mb-4 text-[var(--text-3)]" />
        <p className="text-sm font-medium text-[var(--text-1)] mb-2">Record your answer</p>
        <p className="text-xs text-[var(--text-2)] mb-6 max-w-xs">
          Use your camera and microphone to record your interview response directly in the browser.
        </p>
        {permissionError && (
          <p className="text-xs text-[var(--warning)] mb-4 bg-[var(--warning-subtle)] p-2 rounded-md">{permissionError}</p>
        )}
        <button
          type="button"
          onClick={startCamera}
          disabled={disabled}
          className="btn-primary px-6 py-2.5 text-sm font-medium"
        >
          Enable Camera
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-xl mx-auto overflow-hidden rounded-xl bg-black border border-[var(--border)] anim-up" style={{ aspectRatio: '16/9' }}>
      {recordedBlob ? (
        <video
          key="preview"
          src={previewUrl}
          controls
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <video
          key="live"
          ref={videoRef}
          muted
          playsInline
          className="w-full h-full object-cover transform -scale-x-100"
        />
      )}

      {/* Controls Overlay for Live Preview & Recording */}
      {!recordedBlob && (
        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-4">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors shadow-lg"
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
      
      {/* Retake Button (Top Right during playback) */}
      {recordedBlob && (
        <div className="absolute top-4 right-4">
          <button
            type="button"
            onClick={retake}
            className="flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium transition-colors border border-white/20 shadow-lg"
          >
            <RefreshCw size={14} /> Retake
          </button>
        </div>
      )}
      
      {isRecording && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[11px] font-medium text-white font-mono tracking-wider">REC</span>
        </div>
      )}
    </div>
  );
}
