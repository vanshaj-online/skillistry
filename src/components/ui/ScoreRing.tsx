interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

function arcColor(score: number): string {
  if (score >= 70) return "var(--success)";
  if (score >= 45) return "var(--accent)";
  if (score >= 25) return "var(--warning)";
  return "var(--warning)";
}

export default function ScoreRing({ score, size = 112, strokeWidth = 7, label }: ScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - clamped / 100);
  const color = arcColor(clamped);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />
          
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="score-ring-arc"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          
          <span
            className="text-xl font-semibold font-mono"
            style={{ color, fontFamily: "var(--font-mono)" }}
          >
            {Math.round(clamped)}
          </span>
          <span
            className="text-[10px] text-[var(--text-3)] font-medium"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            /100
          </span>
        </div>
      </div>
      {label && (
        <p className="text-xs font-medium text-[var(--text-2)]">{label}</p>
      )}
    </div>
  );
}
