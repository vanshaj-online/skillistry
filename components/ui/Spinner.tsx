import { Loader2 } from "lucide-react";

interface SpinnerProps { size?: number; className?: string; }

export default function Spinner({ size = 16, className = "" }: SpinnerProps) {
  return (
    <Loader2
      size={size}
      className={`animate-spin text-[var(--text-2)] ${className}`.trim()}
      aria-label="Loading"
    />
  );
}


export function LoadingOverlay({ label = "Analyzing your interview…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[58vh] gap-7 anim-fade">

      
      <div className="flex items-center gap-2">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>

      <div className="text-center space-y-1.5">
        <p
          className="text-sm font-semibold text-[var(--text-1)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {label}
        </p>
        <p className="text-xs text-[var(--text-3)]">This may take 30–90 s</p>
      </div>

      
      <ul className="space-y-2.5 text-xs text-[var(--text-3)] text-left w-56">
        {[
          "Transcribing audio",
          "Analyzing speech patterns",
          "Evaluating facial expressions",
          "Generating coaching feedback",
        ].map((step, i) => (
          <li key={step} className="flex items-center gap-3">
            <span
              className="text-[var(--accent)] opacity-60 animate-pulse"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                animationDelay: `${i * 0.35}s`,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
