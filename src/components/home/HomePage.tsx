import { ArrowRight, Video, BarChart2, Clock } from "lucide-react";
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
            Skillistry
          </div>

          <h1
            className="text-5xl sm:text-6xl font-semibold tracking-tight text-[var(--text-1)] leading-[1.08] mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Skillistry
            <br />
            <span style={{ color: "var(--accent)", fontSize: "0.6em" }}>AI powered mock interview platform</span>
          </h1>

          <p className="text-lg text-[var(--text-2)] leading-relaxed max-w-xl mx-auto mb-10">
            Complete a full AI mock interview and get personalised coaching on your confidence, speech, body language, and content.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <button
              id="home-start-interview-btn"
              onClick={() => navigate("/interview")}
              className="btn-primary px-7 py-3.5 text-sm gap-2"
            >
              Start Mock Interview
              <ArrowRight size={15} />
            </button>
          </div>

          <p className="text-xs text-[var(--text-3)] mt-2">
            Free to use · No account required · Results in ~60 seconds per question
          </p>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              {
                icon: <BarChart2 size={18} />,
                title: "Complete Interview Report",
                desc: "Overall score + dimension analysis + cross-question trend insights.",
              },
              {
                icon: <Clock size={18} />,
                title: "Real-time Feedback",
                desc: "Answer on camera and get detailed AI coaching instantly.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="card p-5 text-left"
              >
                <div
                  className="w-8 h-8 rounded-[var(--r-md)] flex items-center justify-center mb-3"
                  style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
                >
                  {f.icon}
                </div>
                <p className="text-sm font-semibold text-[var(--text-1)] mb-1">{f.title}</p>
                <p className="text-xs text-[var(--text-2)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
