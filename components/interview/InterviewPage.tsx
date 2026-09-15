"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import {
  createInterview,
  submitQuestionResponse,
  pollQuestionResult,
  getInterviewReport,
} from "../../api/interviewClient";
import type { QuestionItem, QuestionResultResponse } from "../../api/interviewClient";
import InterviewStartScreen from "./InterviewStartScreen";
import QuestionScreen from "./QuestionScreen";
import QuestionTransition from "./QuestionTransition";
import InterviewCompleteScreen from "./InterviewCompleteScreen";

// ---------------------------------------------------------------------------
// State machine
// ---------------------------------------------------------------------------
type Phase =
  | "start"
  | "recording"       // camera active, user answering question N
  | "uploading"       // video being submitted
  | "transition"      // showing "Answer recorded ✓ / Analyzing…" between questions
  | "complete"        // all 5 done, generating final report
  | "error";

interface SessionState {
  sessionId: string;
  questions: QuestionItem[];
  currentIndex: number;                      // 0-based index into questions
  questionResults: QuestionResultResponse[]; // accumulated per-question results
  lastResult: QuestionResultResponse | null;
}

export default function InterviewPage() {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("start");
  const [session, setSession] = useState<SessionState | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // --------------------------------------------------------------------------
  // Start interview
  // --------------------------------------------------------------------------
  const handleStart = useCallback(async () => {
    setIsStarting(true);
    setErrorMsg("");
    try {
      const data = await createInterview();
      setSession({
        sessionId: data.session_id,
        questions: data.questions,
        currentIndex: 0,
        questionResults: [],
        lastResult: null,
      });
      setPhase("recording");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not create interview session.");
      setPhase("error");
    } finally {
      setIsStarting(false);
    }
  }, []);

  // --------------------------------------------------------------------------
  // Submit answer for current question
  // --------------------------------------------------------------------------
  const handleSubmitAnswer = useCallback(
    async (videoBlob: Blob, mimeType: string) => {
      if (!session) return;
      const currentQuestion = session.questions[session.currentIndex];
      if (!currentQuestion) return;

      setIsUploading(true);
      setPhase("uploading");

      const ext = mimeType.includes("mp4") ? "mp4" : "webm";

      try {
        await submitQuestionResponse(
          session.sessionId,
          currentQuestion.question_id,
          videoBlob,
          `response.${ext}`
        );

        // Upload done, start analyzing
        setSession((prev) => (prev ? { ...prev, lastResult: null } : prev));
        setPhase("transition");
        setIsUploading(false);

        const poll = async () => {
          try {
            const pollRes = await pollQuestionResult(session.sessionId, currentQuestion.question_id);
            if (pollRes.status === "completed" && pollRes.result) {
              setSession((prev) =>
                prev
                  ? {
                      ...prev,
                      questionResults: [...prev.questionResults, pollRes.result!],
                      lastResult: pollRes.result!,
                    }
                  : prev
              );
            } else if (pollRes.status === "failed") {
              setErrorMsg("Analysis failed on the server. Please start over.");
              setPhase("error");
            } else {
              // processing...
              setTimeout(poll, 3000);
            }
          } catch (e) {
            setErrorMsg("Error while checking analysis status.");
            setPhase("error");
          }
        };
        setTimeout(poll, 2000);
      } catch (err) {
        setIsUploading(false);
        setErrorMsg(
          err instanceof Error
            ? err.message
            : "Failed to submit your answer. Please try again."
        );
        setPhase("error");
      }
    },
    [session]
  );

  // --------------------------------------------------------------------------
  // User clicks "Next Question" or "View My Report"
  // --------------------------------------------------------------------------
  const handleContinue = useCallback(async () => {
    if (!session) return;
    const lastResult = session.lastResult;

    if (lastResult?.is_last_question) {
      // All done — navigate to report
      setPhase("complete");
      setIsGeneratingReport(true);

      try {
        // Poll until the backend has finished the overall analysis
        // (it runs synchronously during the last question submit, so
        //  it should already be done, but we fetch to confirm)
        const report = await getInterviewReport(session.sessionId);
        if (report.status === "completed") {
          router.push(`/interview/report/${session.sessionId}`);
        } else {
          // Rare: still processing — retry once after a delay
          await new Promise((r) => setTimeout(r, 3000));
          await getInterviewReport(session.sessionId);
          router.push(`/interview/report/${session.sessionId}`);
        }
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Could not load your report.");
        setPhase("error");
      } finally {
        setIsGeneratingReport(false);
      }
    } else {
      // Advance to next question
      setSession((prev) =>
        prev ? { ...prev, currentIndex: prev.currentIndex + 1, lastResult: null } : prev
      );
      setPhase("recording");
    }
  }, [session, router]);

  // --------------------------------------------------------------------------
  // View report from complete screen
  // --------------------------------------------------------------------------
  const handleViewReport = useCallback(async () => {
    if (!session) return;
    setIsGeneratingReport(true);
    try {
      await getInterviewReport(session.sessionId);
      router.push(`/interview/report/${session.sessionId}`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not load your report.");
      setPhase("error");
    } finally {
      setIsGeneratingReport(false);
    }
  }, [session, router]);

  // --------------------------------------------------------------------------
  // Reset
  // --------------------------------------------------------------------------
  const reset = () => {
    setPhase("start");
    setSession(null);
    setErrorMsg("");
  };

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------

  if (phase === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh] gap-5 anim-up px-5">
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
            Something went wrong
          </h2>
          <p className="text-xs text-[var(--text-2)] leading-relaxed">{errorMsg}</p>
        </div>
        <button id="interview-retry-btn" onClick={reset} className="btn-primary text-sm px-5 py-2">
          Start over
        </button>
      </div>
    );
  }

  if (phase === "start") {
    return <InterviewStartScreen onStart={handleStart} isLoading={isStarting} />;
  }

  if (!session) return null;

  const currentQuestion = session.questions[session.currentIndex];
  const totalQuestions = session.questions.length;

  if (phase === "recording" || phase === "uploading") {
    return (
      <QuestionScreen
        question={currentQuestion}
        totalQuestions={totalQuestions}
        isUploading={isUploading}
        onSubmit={handleSubmitAnswer}
      />
    );
  }

  if (phase === "transition") {
    // If we have a lastResult, analysis is complete.
    // Otherwise, we're still polling.
    const isAnalyzing = !session.lastResult;
    const result = session.lastResult;
    
    return (
      <QuestionTransition
        completedQuestionNumber={currentQuestion.question_number}
        totalQuestions={totalQuestions}
        nextQuestion={result?.next_question ?? null}
        isLast={result?.is_last_question ?? false}
        isAnalyzing={isAnalyzing}
        onContinue={handleContinue}
      />
    );
  }

  if (phase === "complete") {
    return (
      <InterviewCompleteScreen
        onViewReport={handleViewReport}
        isGenerating={isGeneratingReport}
      />
    );
  }

  return null;
}
