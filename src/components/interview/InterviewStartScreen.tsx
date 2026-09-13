import { ArrowRight, Clock, MessageSquare, BarChart2, Eye, Mic } from "lucide-react";

interface InterviewStartScreenProps {
  onStart: () => void;
  isLoading: boolean;
}

const FEATURES = [
  { icon: <Eye size={13} />, label: "Emotion detection" },
  { icon: <Mic size={13} />, label: "Speech analysis" },
  { icon: <MessageSquare size={13} />, label: "Grammar check" },
  { icon: <BarChart2 size={13} />, label: "AI coaching" },
  { icon: <Eye size={13} />, label: "Blink rate" },
];

const DIMENSIONS = [
  { num: 1, label: "Introduction", desc: "Confidence & self-presentation" },
  { num: 2, label: "Communication", desc: "Clarity & structure" },
  { num: 3, label: "Problem Solving", desc: "Analytical approach" },
  { num: 4, label: "Adaptability", desc: "Teamwork & change" },
  { num: 5, label: "Self-Awareness", desc: "Motivation & growth" },
];

export default function InterviewStartScreen({ onStart, isLoading }: InterviewStartScreenProps) {
  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-5 py-16 anim-fade">
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-6 border"
          style={{
            background: "var(--accent-subtle)",
            borderColor: "var(--accent-border)",
            color: "var(--accent)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
          AI Mock Interview
        </div>

        <h1
          className="text-4xl font-semibold tracking-tight text-[var(--text-1)] leading-tight mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Test your interview skills
          <br />
          <span style={{ color: "var(--accent)" }}>with AI coaching.</span>
        </h1>

        <p className="text-sm text-[var(--text-2)] leading-relaxed max-w-md mx-auto mb-3">
          Answer 5 behavioural questions on camera. Our AI analyzes your
          confidence, speech, body language, and content — then gives you a
          complete personalised report.
        </p>

        <div className="flex items-center justify-center gap-4 text-xs text-[var(--text-3)]">
          <span className="flex items-center gap-1.5">
            <Clock size={12} /> 10–15 minutes
          </span>
          <span className="w-px h-3 bg-[var(--border)]" />
          <span>5 questions</span>
          <span className="w-px h-3 bg-[var(--border)]" />
          <span>No account required</span>
        </div>
      </div>

      {/* Question dimensions */}
      <div className="card p-5 mb-8">
        <p className="text-[11px] text-[var(--text-3)] uppercase tracking-widest font-medium mb-4">
          What you'll be asked
        </p>
        <div className="space-y-2.5">
          {DIMENSIONS.map((d) => (
            <div key={d.num} className="flex items-center gap-3">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{
                  background: "var(--accent-subtle)",
                  color: "var(--accent)",
                  border: "1px solid var(--accent-border)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {d.num}
              </span>
              <div>
                <span className="text-sm font-medium text-[var(--text-1)]">{d.label}</span>
                <span className="text-xs text-[var(--text-3)] ml-2">— {d.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {FEATURES.map((f) => (
          <span
            key={f.label}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium text-[var(--text-2)] border border-[var(--border)] bg-[var(--bg-surface)]"
          >
            <span style={{ color: "var(--accent)" }}>{f.icon}</span>
            {f.label}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          id="start-interview-btn"
          onClick={onStart}
          disabled={isLoading}
          className="btn-primary px-8 py-3.5 text-sm gap-2"
        >
          {isLoading ? (
            <>
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              Preparing your interview…
            </>
          ) : (
            <>
              Start Interview
              <ArrowRight size={15} />
            </>
          )}
        </button>
        <p className="text-xs text-[var(--text-3)] mt-3">
          Camera and microphone access will be requested
        </p>
      </div>
    </div>
  );
}
