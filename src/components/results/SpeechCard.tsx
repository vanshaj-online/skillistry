import { Check, Mic } from "lucide-react";
import type { PronunciationIssue } from "../../api/interviewClient";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import SectionHeader from "../ui/SectionHeader";

interface SpeechCardProps { issues: PronunciationIssue[]; }

export default function SpeechCard({ issues }: SpeechCardProps) {
  const empty = issues.length === 0;
  return (
    <Card id="speech-card">
      <SectionHeader
        icon={<Mic size={15} />}
        title="Speech Analysis"
        subtitle="Pronunciation issues detected"
        action={
          <Badge variant={empty ? "success" : "warning"}>
            {empty ? "No issues" : `${issues.length} issue${issues.length > 1 ? "s" : ""}`}
          </Badge>
        }
      />

      {empty ? (
        <div className="flex items-center gap-2 py-3 text-xs text-[var(--success)]">
          <Check size={13} />
          No pronunciation issues detected.
        </div>
      ) : (
        <div className="space-y-2">
          {issues.map((issue, i) => (
            <div
              key={i}
              className="rounded-[var(--r-md)] border border-[var(--border)] overflow-hidden text-xs"
            >
              
              <div className="feedback-stripe-needs-work grid grid-cols-3 gap-3 px-3.5 py-2.5">
                <div>
                  <p className="text-[var(--text-3)] mb-0.5 text-[10px] uppercase tracking-wide">Spoken</p>
                  <p
                    className="font-medium text-[var(--warning)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    "{issue.word}"
                  </p>
                </div>
                <div>
                  <p className="text-[var(--text-3)] mb-0.5 text-[10px] uppercase tracking-wide">Correction</p>
                  <p
                    className="font-medium text-[var(--success)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {issue.correction}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--text-3)] mb-0.5 text-[10px] uppercase tracking-wide">Phonetic</p>
                  <p
                    className="text-[var(--text-2)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {issue.phonetic || "—"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
