"use client";
import React, { useRef, useState } from "react";
import { AlertTriangle, FileVideo, Upload, Video as VideoIcon } from "lucide-react";
import Spinner from "../ui/Spinner";
import RecordVideo from "./RecordVideo";

const ALLOWED_TYPES = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"];
const ALLOWED_EXT   = [".mp4", ".mov", ".avi", ".webm"];
const MAX_BYTES = 500 * 1024 * 1024;

interface UploadFormProps {
  onSubmit: (file: File, question: string) => Promise<void>;
  isLoading: boolean;
}

function fmt(b: number) {
  return b < 1_048_576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1_048_576).toFixed(1)} MB`;
}

export default function UploadForm({ onSubmit, isLoading }: UploadFormProps) {
  const [file, setFile]           = useState<File | null>(null);
  const [question, setQuestion]   = useState("");
  const [dragOver, setDragOver]   = useState(false);
  const [fileError, setFileError] = useState("");
  const [mode, setMode]           = useState<"upload" | "record">("upload");
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (f: File): string => {
    if (!ALLOWED_TYPES.includes(f.type) && !ALLOWED_EXT.some(e => f.name.toLowerCase().endsWith(e)))
      return "Unsupported file type. Upload an MP4, MOV, AVI, or WEBM video.";
    if (f.size > MAX_BYTES) return `File too large (${fmt(f.size)}). Max 500 MB.`;
    return "";
  };

  const pick = (f: File) => {
    const err = validate(f);
    setFileError(err);
    if (!err) setFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) pick(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || isLoading) return;
    await onSubmit(file, question.trim());
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      
      {/* Tabs */}
      <div className="flex bg-[var(--bg-surface)] border border-[var(--border)] rounded-full p-1 mx-auto w-fit anim-up">
        <button
          onClick={() => { setMode("upload"); setFileError(""); setFile(null); }}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
            mode === "upload" ? "bg-[var(--text-1)] text-white shadow-sm" : "text-[var(--text-2)] hover:text-[var(--text-1)]"
          }`}
        >
          <Upload size={15} /> Upload File
        </button>
        <button
          onClick={() => { setMode("record"); setFileError(""); setFile(null); }}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${
            mode === "record" ? "bg-[var(--text-1)] text-white shadow-sm" : "text-[var(--text-2)] hover:text-[var(--text-1)]"
          }`}
        >
          <VideoIcon size={15} /> Record Video
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 anim-up">
        
        {mode === "upload" ? (
          <div
            id="drop-zone"
            className={`drop-zone p-12 text-center cursor-pointer select-none ${dragOver ? "drag-over" : ""}`.trim()}
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            role="button"
            tabIndex={0}
            aria-label="Upload video file"
            onKeyDown={e => e.key === "Enter" && inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              id="video-file-input"
              type="file"
              accept=".mp4,.mov,.avi,.webm,video/*"
              className="sr-only"
              onChange={e => { const f = e.target.files?.[0]; if (f) pick(f); }}
              disabled={isLoading}
            />

            {file ? (
              <div className="space-y-2">
                <FileVideo size={28} className="mx-auto" style={{ color: "var(--accent)" }} />
                <p className="text-sm font-medium text-[var(--text-1)]">{file.name}</p>
                <p
                  className="text-xs text-[var(--text-3)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {fmt(file.size)}
                </p>
                <button
                  type="button"
                  className="text-xs font-medium mt-1 transition-opacity hover:opacity-70"
                  style={{ color: "var(--accent)" }}
                  onClick={e => {
                    e.stopPropagation();
                    setFile(null);
                    setFileError("");
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                >
                  Change file
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <Upload size={28} className="mx-auto text-[var(--text-3)]" />
                <div>
                  <p className="text-sm text-[var(--text-2)]">
                    Drop your video here, or{" "}
                    <span className="font-semibold" style={{ color: "var(--accent)" }}>browse</span>
                  </p>
                  <p className="text-xs text-[var(--text-3)] mt-1">MP4 · MOV · AVI · WEBM · max 500 MB</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <RecordVideo 
            disabled={isLoading}
            onRecordComplete={(f) => {
              setFile(f);
              setFileError("");
            }}
          />
        )}

        {fileError && (
          <div
            className="flex items-start gap-2 p-3 rounded-[var(--r-md)] text-xs anim-fade"
            style={{
              background: "var(--warning-subtle)",
              border: "1px solid rgba(217,123,41,0.22)",
              color: "var(--warning)",
            }}
          >
            <AlertTriangle size={13} className="mt-px shrink-0" />
            {fileError}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="interview-question" className="block text-xs font-medium text-[var(--text-2)]">
            Interview question <span className="text-[var(--text-3)]">(optional)</span>
          </label>
          <textarea
            id="interview-question"
            rows={3}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="e.g. Tell me about a time you solved a difficult problem under pressure."
            disabled={isLoading}
            className="w-full rounded-[var(--r-lg)] bg-[var(--bg-surface)] border border-[var(--border)] px-3.5 py-2.5 text-sm text-[var(--text-1)] placeholder:text-[var(--text-3)] resize-none focus:outline-none transition-colors duration-[180ms] disabled:opacity-40"
            style={{ fontFamily: "var(--font-body)" }}
            onFocus={e => e.target.style.borderColor = "var(--accent)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
          />
          <p className="text-[11px] text-[var(--text-3)]">
            Providing the question improves relevance and quality scoring.
          </p>
        </div>

        <button
          id="submit-analysis-btn"
          type="submit"
          disabled={!file || isLoading || !!fileError}
          className="btn-primary w-full py-3"
        >
          {isLoading ? (
            <><Spinner size={14} className="text-white/70" /> Analyzing…</>
          ) : (
            "Analyze Interview"
          )}
        </button>
      </form>
    </div>
  );
}
