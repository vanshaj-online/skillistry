"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy, ChevronDown, ChevronUp, TrendingUp, Lightbulb, Target, BarChart2,
} from "lucide-react";
import type { InterviewReportResponse, QuestionDetail, OverallAnalysis } from "../../api/interviewClient";
import Card from "../ui/Card";
import ScoreRing from "../ui/ScoreRing";
import SectionHeader from "../ui/SectionHeader";
import ConfidenceCard from "../results/ConfidenceCard";
import ContentCard from "../results/ContentCard";
import SpeechCard from "../results/SpeechCard";
import TranscriptCard from "../results/TranscriptCard";
import EmotionChart from "../results/EmotionChart";
import Badge from "../ui/Badge";

interface InterviewReportPageProps {
  report: InterviewReportResponse;
}

// ---------------------------------------------------------------------------
// Dimension score bar
// ---------------------------------------------------------------------------

function DimensionBar({ label, score, delay = 0 }: { label: string; score: number; delay?: number }) {
  const color =
    score >= 70 ? "var(--success)" : score >= 45 ? "var(--accent)" : "var(--warning)";

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-[var(--text-2)] font-medium">{label}</span>
        <span className="text-[var(--text-1)] font-semibold" style={{ fontFamily: "var(--font-mono)" }}>
          {Math.round(score)}
        </span>
      </div>
      <div className="h-2 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full stat-bar"
          style={{ width: `${score}%`, background: color, animationDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cross-question trend sparkline
// ---------------------------------------------------------------------------

function TrendSparkline({ values, label }: { values: number[]; label: string }) {
  if (!values.length) return null;
  const max = Math.max(...values, 100);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const W = 160;
  const H = 40;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1 || 1)) * W;
    const y = H - ((v - min) / range) * H;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] text-[var(--text-3)] uppercase tracking-wide">{label}</span>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        <polyline
          points={polyline}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {values.map((v, _i) => {
          const x = (_i / (values.length - 1 || 1)) * W;
          const y = H - ((v - min) / range) * H;
          return (
            <circle key={_i} cx={x} cy={y} r={3} fill="var(--accent)" />
          );
        })}
      </svg>
      <div className="flex justify-between text-[9px] text-[var(--text-3)]" style={{ fontFamily: "var(--font-mono)" }}>
        {values.map((v, i) => <span key={i}>{Math.round(v)}</span>)}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overall section
// ---------------------------------------------------------------------------

function OverallSection({ oa }: { oa: OverallAnalysis }) {
  const dimensions = [
    { label: "Communication", score: oa.communication_score, delay: 0 },
    { label: "Confidence", score: oa.confidence_score, delay: 60 },
    { label: "Speech", score: oa.speech_score, delay: 120 },
    { label: "Body Language", score: oa.body_language_score, delay: 180 },
    { label: "Content", score: oa.content_score, delay: 240 },
  ];

  const hasInvalidAnswers = oa.question_scores.some(score => score === 0);
  
  return (
    <div className="space-y-6">
      {hasInvalidAnswers && (
        <div className="flex items-center gap-3 p-4 rounded-[var(--r-md)] border border-[var(--warning)] bg-orange-500/10">
          <Target className="text-[var(--warning)] shrink-0" size={18} />
          <div>
            <p className="text-sm font-semibold text-[var(--text-1)]">
              Incomplete Evaluation
            </p>
            <p className="text-xs text-[var(--text-2)] mt-0.5">
              One or more questions did not contain a meaningful spoken response, which has lowered your overall score.
            </p>
          </div>
        </div>
      )}

      {/* Score header */}
      <Card className="flex flex-col sm:flex-row items-center gap-8 p-6">
        <div className="shrink-0">
          <ScoreRing score={oa.overall_score} size={120} label="Overall Score" strokeWidth={8} />
        </div>
        <div className="flex-1 space-y-3 w-full">
          {dimensions.map((d) => (
            <DimensionBar key={d.label} label={d.label} score={d.score} delay={d.delay} />
          ))}
        </div>
      </Card>

      {/* Trends sparklines */}
      {(oa.confidence_trend.length > 1 || oa.speech_trend.length > 1) && (
        <Card className="space-y-4">
          <SectionHeader
            icon={<TrendingUp size={15} />}
            title="Cross-Question Trends"
            subtitle="How your performance evolved across the 5 questions"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {oa.confidence_trend.length > 1 && (
              <TrendSparkline values={oa.confidence_trend} label="Confidence" />
            )}
            {oa.speech_trend.length > 1 && (
              <TrendSparkline values={oa.speech_trend} label="Speech" />
            )}
            {oa.content_trend.length > 1 && (
              <TrendSparkline values={oa.content_trend} label="Content" />
            )}
          </div>
        </Card>
      )}

      {/* Qualitative insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strengths */}
        <Card className="space-y-3">
          <SectionHeader icon={<Trophy size={15} />} title="Your Strengths" />
          <ul className="space-y-2">
            {oa.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-2)]">
                <span className="text-[var(--success)] mt-0.5 shrink-0">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </Card>

        {/* Areas to improve */}
        <Card className="space-y-3">
          <SectionHeader icon={<Target size={15} />} title="Areas to Improve" />
          <ul className="space-y-2">
            {oa.areas_to_improve.map((a, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-2)]">
                <span className="text-[var(--warning)] mt-0.5 shrink-0">→</span>
                {a}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Recommendations */}
      {oa.recommendations.length > 0 && (
        <Card>
          <SectionHeader
            icon={<Lightbulb size={15} />}
            title="Personal Recommendations"
            subtitle="Specific next steps to improve your interview performance"
          />
          <div
            className="feedback-stripe-accent rounded-[var(--r-lg)] border border-[var(--accent-border)] p-4 space-y-3"
          >
            <ul className="space-y-2.5">
              {oa.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-[var(--text-2)] leading-relaxed">
                  <span
                    className="text-[var(--accent)] font-semibold shrink-0 w-4 mt-px"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {i + 1}.
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* Behavioural trends */}
      {oa.trends.length > 0 && (
        <Card className="space-y-3">
          <SectionHeader
            icon={<BarChart2 size={15} />}
            title="Behavioural Observations"
            subtitle="Observable patterns across your 5 responses"
          />
          <div className="space-y-2">
            {oa.trends.map((t, i) => (
              <div key={i} className="rounded-[var(--r-md)] border border-[var(--border)] p-3 text-xs">
                <span
                  className="font-medium text-[var(--accent)] capitalize mr-2"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {t.metric.replace(/_/g, " ")}:
                </span>
                <span className="text-[var(--text-2)]">{t.observation}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Per-question accordion item
// ---------------------------------------------------------------------------

function QuestionAccordion({
  question,
  index,
}: {
  question: QuestionDetail;
  index: number;
}) {
  const [open, setOpen] = useState(index === 0);

  const scoreColor =
    question.score >= 70
      ? "var(--success)"
      : question.score >= 45
      ? "var(--accent)"
      : "var(--warning)";

  const dims = [
    { label: "Confidence", score: question.confidence_score },
    { label: "Body Language", score: question.body_language_score },
    { label: "Speech", score: question.speech_score },
    { label: "Content", score: question.content_score },
  ];

  return (
    <div className="card overflow-hidden">
      {/* Accordion header */}
      <button
        className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--bg-subtle)] transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-4">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{
              background: "var(--accent-subtle)",
              color: "var(--accent)",
              border: "1px solid var(--accent-border)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {question.question_number}
          </span>
          <div>
            <p className="text-sm font-medium text-[var(--text-1)] leading-snug">
              {question.question_text}
            </p>
            <p className="text-[11px] text-[var(--text-3)] mt-0.5">
              Question {question.question_number}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span
            className="text-lg font-semibold"
            style={{ color: scoreColor, fontFamily: "var(--font-mono)" }}
          >
            {Math.round(question.score)}
          </span>
          <span className="text-xs text-[var(--text-3)]">/100</span>
          {open ? <ChevronUp size={16} className="text-[var(--text-3)]" /> : <ChevronDown size={16} className="text-[var(--text-3)]" />}
        </div>
      </button>

      {/* Accordion body */}
      {open && (
        <div className="border-t border-[var(--border)] p-5 space-y-5 anim-fade">
          {/* Dimension mini-scores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {dims.map((d) => (
              <div
                key={d.label}
                className="rounded-[var(--r-md)] bg-[var(--bg-subtle)] border border-[var(--border)] px-3.5 py-2.5 text-center"
              >
                <p
                  className="text-base font-semibold text-[var(--text-1)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {Math.round(d.score)}
                </p>
                <p className="text-[10px] text-[var(--text-3)] mt-0.5">{d.label}</p>
              </div>
            ))}
          </div>

          {/* Analysis cards */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-3 space-y-4">
              <TranscriptCard transcription={question.transcription} />
              <ContentCard data={question.content_analysis} validity={question.answer_validity} />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <ConfidenceCard data={question.confidence_analysis} />
              <EmotionChart emotionPercentages={question.confidence_analysis.emotion_percentages} />
              <SpeechCard issues={question.speech_analysis} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main report page
// ---------------------------------------------------------------------------

type Tab = "overall" | "questions";

export default function InterviewReportPage({ report }: InterviewReportPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overall");

  const tabs: { key: Tab; label: string }[] = [
    { key: "overall", label: "Overall Interview" },
    { key: "questions", label: "Question-by-Question" },
  ];

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-5 py-14 space-y-8 anim-fade">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <p className="text-[11px] text-[var(--text-3)] uppercase tracking-widest mb-1.5 font-medium">
            Interview Report
          </p>
          <p
            className="text-2xl font-semibold text-[var(--text-1)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Your complete analysis
          </p>
          <p className="text-xs text-[var(--text-3)] mt-1" style={{ fontFamily: "var(--font-mono)" }}>
            Session: {report.session_id.split("-")[0]}…
          </p>
        </div>

        {report.overall_analysis && (
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center">
              <p
                className="text-3xl font-semibold"
                style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
              >
                {Math.round(report.overall_analysis.overall_score)}
              </p>
              <p className="text-[11px] text-[var(--text-3)]">Overall Score</p>
            </div>
            <Badge variant="accent">
              {report.questions.length} questions analyzed
            </Badge>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-[var(--bg-surface)] border border-[var(--border)] rounded-full p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            id={`tab-${tab.key}`}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-[var(--text-1)] text-white shadow-sm"
                : "text-[var(--text-2)] hover:text-[var(--text-1)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overall" && (
        <div className="anim-fade">
          {report.overall_analysis ? (
            <OverallSection oa={report.overall_analysis} />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-40 gap-3">
              <div className="flex items-center gap-2">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
              <p className="text-sm text-[var(--text-2)]">Generating overall analysis…</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "questions" && (
        <div className="space-y-4 anim-fade">
          {report.questions.map((q, i) => (
            <QuestionAccordion key={q.question_id} question={q} index={i} />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="text-center pt-4">
        <button
          id="start-new-interview-btn"
          onClick={() => router.push("/interview")}
          className="btn-ghost text-sm"
        >
          ← Start a new interview
        </button>
      </div>
    </div>
  );
}
