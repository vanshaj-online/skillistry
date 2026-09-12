import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="anim-fade h-full">
      
      <section className="relative flex flex-col items-center justify-center min-h-[100dvh] pt-32 pb-24 px-5 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(61,79,224,0.07) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-4xl mx-auto text-center relative">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-8 border"
            style={{
              background: "var(--accent-subtle)",
              borderColor: "var(--accent-border)",
              color: "var(--accent)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
            AI-Powered Interview Coach
          </div>

          <h1
            className="text-5xl sm:text-6xl font-semibold tracking-tight text-[var(--text-1)] leading-[1.08] mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Turn every practice
            <br />
            <span style={{ color: "var(--accent)" }}>into progress.</span>
          </h1>

          <p className="text-lg text-[var(--text-2)] leading-relaxed max-w-xl mx-auto mb-10">
            Upload a video of your interview answer. Get detailed, precise coaching
            on confidence, speech, and content — no sign-up, no judgment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate("/analysis")}
              className="btn-primary px-7 py-3.5 text-sm gap-2"
            >
              Analyze your interview
              <ArrowRight size={15} />
            </button>
          </div>

          <p className="text-xs text-[var(--text-3)] mt-5">
            Free to use · Results in ~60 seconds · No account required
          </p>
        </div>
      </section>

    </div>
  );
}
