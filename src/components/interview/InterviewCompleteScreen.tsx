import { Trophy, ArrowRight } from "lucide-react";

interface InterviewCompleteScreenProps {
  onViewReport: () => void;
  isGenerating: boolean;
}

export default function InterviewCompleteScreen({ onViewReport, isGenerating }: InterviewCompleteScreenProps) {
  return (
    <div className="flex-1 w-full max-w-md mx-auto px-5 py-24 flex flex-col items-center text-center anim-fade">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: "var(--accent-subtle)", border: "1px solid var(--accent-border)" }}
      >
        <Trophy size={30} style={{ color: "var(--accent)" }} />
      </div>

      <p
        className="text-3xl font-semibold text-[var(--text-1)] mb-3"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Interview Complete
      </p>

      <p className="text-sm text-[var(--text-2)] leading-relaxed mb-10 max-w-xs">
        You've answered all five questions. We've analyzed your confidence, speech,
        body language, and content across each response.
      </p>

      {isGenerating ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
          <p className="text-sm font-medium text-[var(--text-1)]">Generating your full report…</p>
          <p className="text-xs text-[var(--text-3)]">Synthesizing insights across all five answers</p>
        </div>
      ) : (
        <button
          id="view-report-btn"
          onClick={onViewReport}
          className="btn-primary px-8 py-3.5 text-sm gap-2"
        >
          View My Report
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}
