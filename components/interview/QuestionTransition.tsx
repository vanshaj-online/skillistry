import { CheckCircle2, ChevronRight } from "lucide-react";
import type { QuestionItem } from "../../api/interviewClient";
import { AnalyzingSteps } from "../ui/Spinner";

interface QuestionTransitionProps {
  completedQuestionNumber: number;
  totalQuestions: number;
  nextQuestion: QuestionItem | null;
  isLast: boolean;
  isAnalyzing: boolean;
  onContinue: () => void;
}

export default function QuestionTransition({
  completedQuestionNumber,
  totalQuestions,
  nextQuestion,
  isLast,
  isAnalyzing,
  onContinue,
}: QuestionTransitionProps) {
  return (
    <div className="flex-1 w-full max-w-lg mx-auto px-5 py-20 flex flex-col items-center text-center anim-fade">
      {/* Success icon */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
        style={{ background: "var(--success-subtle)", border: "1px solid rgba(46,158,107,0.22)" }}
      >
        <CheckCircle2 size={26} style={{ color: "var(--success)" }} />
      </div>

      <p
        className="text-2xl font-semibold text-[var(--text-1)] mb-2"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Answer recorded ✓
      </p>

      <p className="text-sm text-[var(--text-2)] mb-8">
        Question {completedQuestionNumber} of {totalQuestions} submitted.
      </p>

      {isAnalyzing ? (
        <AnalyzingSteps label="Analyzing your response…" />
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs text-[var(--success)] font-medium mb-2">Analysis complete</p>

          <button
            id="continue-to-next-btn"
            onClick={onContinue}
            className="btn-primary px-7 py-3 text-sm gap-2"
          >
            {isLast ? (
              "View My Report"
            ) : (
              <>
                Next: Question {(nextQuestion?.question_number) ?? completedQuestionNumber + 1}
                <ChevronRight size={15} />
              </>
            )}
          </button>
        </div>
      )}

      {/* Step indicators */}
      <div className="flex justify-center gap-2 mt-12">
        {Array.from({ length: totalQuestions }).map((_, i) => {
          const qNum = i + 1;
          const isDone = qNum <= completedQuestionNumber;
          return (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: "0.5rem",
                background: isDone ? "var(--success)" : "var(--border)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
