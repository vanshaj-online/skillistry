import { FileText, Check, Lightbulb } from "lucide-react";
import type { ContentAnalysis, GrammarIssue } from "../../api/client";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import SectionHeader from "../ui/SectionHeader";

interface ContentCardProps { data: ContentAnalysis; }

type ToneVariant = "success" | "info" | "warning";
function toneMeta(score: number): { variant: ToneVariant; label: string } {
  if (score >= 0.5)  return { variant: "success", label: "Positive" };
  if (score >= 0.1)  return { variant: "info",    label: "Slightly positive" };
  if (score >= -0.1) return { variant: "info",    label: "Neutral" };
  if (score >= -0.5) return { variant: "warning", label: "Slightly negative" };
  return               { variant: "warning", label: "Negative" };
}

function Row({ label, value }: { label: string; value: string }) {
  const na = !value || value === "N/A";
  return (
    <div className="py-2.5 border-b border-[var(--border)] last:border-0 flex items-start gap-3">
      <span className="text-[11px] text-[var(--text-3)] w-24 shrink-0 pt-px">{label}</span>
      <span className={na ? "text-xs leading-relaxed text-[var(--text-3)] italic" : "text-xs leading-relaxed text-[var(--text-2)]"}>
        {na ? "Not evaluated" : value}
      </span>
    </div>
  );
}

function GrammarList({ issues }: { issues: GrammarIssue[] }) {
  if (issues.length === 0) {
    return (
      <p className="flex items-center gap-1.5 text-xs text-[var(--success)] py-1">
        <Check size={12} /> No grammar issues.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {issues.map((item, i) => (
        <div key={i} className="rounded-[var(--r-md)] overflow-hidden border border-[var(--border)] text-xs">
          <div className="feedback-stripe-needs-work flex items-start gap-2.5 px-3.5 py-2.5">
            <span
              className="font-mono font-semibold shrink-0 text-[var(--warning)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ✕
            </span>
            <span className="text-[var(--text-1)] leading-relaxed">{item.issue}</span>
          </div>
          <div className="feedback-stripe-positive flex items-start gap-2.5 px-3.5 py-2.5">
            <span
              className="font-mono font-semibold shrink-0 text-[var(--success)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ✓
            </span>
            <span className="text-[var(--text-1)] leading-relaxed">{item.correction}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SuggestionCard({ suggestions }: { suggestions: string }) {
  if (!suggestions || suggestions === "N/A") return null;

  const lines = suggestions
    .split(/\n|(?=\d+\.\s)/)
    .map(s => s.trim())
    .filter(Boolean);

  return (
    <div
      id="suggestion-card"
      className="feedback-stripe-accent rounded-[var(--r-lg)] border border-[var(--accent-border)] p-4 space-y-3"
    >
      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        <Lightbulb size={13} />
        Coaching suggestions
      </div>
      <ul className="space-y-2.5">
        {lines.map((line, i) => (
          <li key={i} className="flex items-start gap-3 text-xs text-[var(--text-2)] leading-relaxed">
            <span
              className="text-[var(--accent)] font-semibold shrink-0 w-4 mt-px"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {i + 1}.
            </span>
            {line.replace(/^\d+\.\s*/, "")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ContentCard({ data }: ContentCardProps) {
  const tone = toneMeta(data.tone.score);
  const tonePct = (((data.tone.score + 1) / 2) * 100).toFixed(0);

  return (
    <Card id="content-card" className="space-y-4">
      <SectionHeader
        icon={<FileText size={15} />}
        title="Content Analysis"
        subtitle="LLM evaluation of your answer"
        action={
          <span
            className="text-[11px] text-[var(--text-3)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {data.word_count} words
          </span>
        }
      />

      
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[var(--text-3)]">
            Tone —{" "}
            <span style={{ fontFamily: "var(--font-mono)" }}>{tonePct}%</span>
          </span>
          <Badge variant={tone.variant}>{tone.label}</Badge>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
          <div
            className="h-full stat-bar rounded-full"
            style={{ width: `${tonePct}%`, background: "var(--accent)" }}
          />
        </div>
        <p className="text-[11px] text-[var(--text-3)]">{data.tone.appropriateness}</p>
      </div>

      
      <div className="rounded-[var(--r-md)] bg-[var(--bg-subtle)] border border-[var(--border)] px-3.5">
        <Row label="Clarity"        value={data.clarity} />
        <Row label="Engagement"     value={data.engagement} />
        <Row label="Structure"      value={data.structure} />
        <Row label="Relevance"      value={data.relevance} />
        <Row label="Answer quality" value={data.answer_quality} />
      </div>

      
      {data.grammar.length > 0 && (
        <div>
          <p className="text-[11px] text-[var(--text-3)] mb-2 font-medium uppercase tracking-wide">Grammar</p>
          <GrammarList issues={data.grammar} />
        </div>
      )}

      
      <SuggestionCard suggestions={data.suggestions} />
    </Card>
  );
}
