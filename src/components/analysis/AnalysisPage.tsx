import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import type { AnalysisResponse } from "../../api/client";
import { uploadVideo } from "../../api/client";
import UploadForm from "../upload/UploadForm";
import ResultsPage from "../results/ResultsPage";
import { LoadingOverlay } from "../ui/Spinner";

export default function AnalysisPage() {
  const [status, setStatus] = useState<"upload" | "loading" | "results" | "error">("upload");
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [errorMsg, setError] = useState("");

  const handleSubmit = async (file: File, question: string) => {
    setStatus("loading");
    setError("");
    try {
      const data = await uploadVideo(file, question);
      setResults(data);
      setStatus("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setStatus("error");
    }
  };

  const reset = () => {
    setResults(null);
    setError("");
    setStatus("upload");
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-5 py-14">
      {(status === "upload" || status === "loading") && (
        <div className="space-y-10">
          <div className="text-center space-y-3 max-w-lg mx-auto">
            <h1
              className="text-[2rem] font-semibold tracking-tight text-[var(--text-1)] leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Interview Analyzer
            </h1>
            <p className="text-sm text-[var(--text-2)] leading-relaxed">
              Upload a video response and receive coaching on confidence, speech patterns, and answer quality.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {["Emotion detection", "Speech analysis", "Grammar check", "AI coaching", "Blink rate"].map(f => (
              <span
                key={f}
                className="px-3 py-1 rounded-full text-[11px] font-medium text-[var(--text-2)] border border-[var(--border)] bg-[var(--bg-surface)] tracking-wide"
              >
                {f}
              </span>
            ))}
          </div>

          {status === "loading" ? (
            <LoadingOverlay />
          ) : (
            <UploadForm onSubmit={handleSubmit} isLoading={false} />
          )}
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center min-h-[55vh] gap-5 anim-up">
          <div
            className="w-12 h-12 rounded-[var(--r-lg)] flex items-center justify-center"
            style={{ background: "var(--warning-subtle)", border: "1px solid rgba(217,123,41,0.22)" }}
          >
            <AlertTriangle size={20} style={{ color: "var(--warning)" }} />
          </div>
          <div className="text-center space-y-1.5 max-w-sm">
            <h2
              className="text-sm font-semibold text-[var(--text-1)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Analysis failed
            </h2>
            <p className="text-xs text-[var(--text-2)] leading-relaxed">{errorMsg}</p>
          </div>
          <button id="retry-btn" onClick={reset} className="btn-primary text-sm px-5 py-2">
            Try again
          </button>
        </div>
      )}

      {status === "results" && results && (
        <ResultsPage data={results} onReset={reset} />
      )}
    </div>
  );
}
