import { Eye } from "lucide-react";
import type { ConfidenceAnalysis } from "../../api/interviewClient";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import ScoreRing from "../ui/ScoreRing";
import SectionHeader from "../ui/SectionHeader";

interface ConfidenceCardProps { data: ConfidenceAnalysis; }

const BLINK_VARIANTS: Record<string, "success" | "info" | "warning" | "neutral"> = {
  very_low: "info", low: "success", normal: "success", high: "warning", very_high: "warning",
};
const blinkVariant = (cat: string): "success" | "info" | "warning" | "neutral" =>
  BLINK_VARIANTS[cat] ?? "neutral";

const blinkLabel: Record<string, string> = {
  very_low:  "Very low — highly focused",
  low:       "Low — focused",
  normal:    "Normal — relaxed",
  high:      "High — slightly nervous",
  very_high: "High — anxious",
};

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[var(--r-md)] bg-[var(--bg-subtle)] border border-[var(--border)] px-3.5 py-2.5">
      
      <p
        className="text-base font-semibold text-[var(--text-1)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {value}
      </p>
      <p className="text-[11px] text-[var(--text-3)] mt-px">{label}</p>
    </div>
  );
}

export default function ConfidenceCard({ data }: ConfidenceCardProps) {
  const coverage = data.total_frames > 0
    ? Math.round((data.frames_analyzed / data.total_frames) * 100)
    : 0;

  return (
    <Card id="confidence-card">
      <SectionHeader
        icon={<Eye size={15} />}
        title="Confidence"
        subtitle="Facial expressions + blink rate"
      />
      <div className="flex items-start gap-6">
        <ScoreRing score={data.confidence_score} size={100} label="Score" />
        <div className="flex-1 grid grid-cols-2 gap-2">
          <Stat label="Frames analyzed" value={data.frames_analyzed} />
          <Stat label="Coverage" value={`${coverage}%`} />
          <Stat label="Blinks / min" value={data.blinks_per_minute.toFixed(1)} />
          <div className="rounded-[var(--r-md)] bg-[var(--bg-subtle)] border border-[var(--border)] px-3.5 py-2.5">
            <Badge variant={blinkVariant(data.blink_rate_category)} className="mb-1">
              {blinkLabel[data.blink_rate_category] ?? data.blink_rate_category}
            </Badge>
            <p className="text-[11px] text-[var(--text-3)]">Blink rate</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
