import type { AnalysisResponse } from "../../api/client";
import ConfidenceCard from "./ConfidenceCard";
import ContentCard from "./ContentCard";
import EmotionChart from "./EmotionChart";
import SpeechCard from "./SpeechCard";
import TranscriptCard from "./TranscriptCard";

interface ResultsPageProps {
  data: AnalysisResponse;
  onReset: () => void;
}

export default function ResultsPage({ data, onReset }: ResultsPageProps) {
  const { confidence_analysis: ca, content_analysis: co } = data;

  return (
    <div className="space-y-6 anim-fade">

      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <p className="text-[11px] text-[var(--text-3)] uppercase tracking-widest mb-1.5 font-medium">
            Analysis complete
          </p>
          <p className="text-2xl font-semibold text-[var(--text-1)]" style={{ fontFamily: "var(--font-heading)" }}>
            <span style={{ fontFamily: "var(--font-mono)" }}>
              {Math.round(ca.confidence_score)}
            </span>
            <span className="text-sm text-[var(--text-3)] font-normal ml-1.5">/ 100 confidence</span>
          </p>
          <p
            className="text-[11px] text-[var(--text-3)] mt-0.5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ID: {data.video_id}
          </p>
        </div>

        
        <div className="flex items-center gap-6 sm:gap-8">
          {[
            { label: "Words",          value: co.word_count },
            { label: "Speech issues",  value: data.speech_analysis.length },
            { label: "Grammar issues", value: co.grammar.length },
          ].map(({ label, value }, i, arr) => (
            <div key={label} className="text-center">
              <p
                className="text-xl font-semibold text-[var(--text-1)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {value}
              </p>
              <p className="text-[11px] text-[var(--text-3)]">{label}</p>
              {i < arr.length - 1 && <span className="sr-only"> · </span>}
            </div>
          ))}
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-5">
          <TranscriptCard transcription={data.transcription} />
          <ContentCard data={co} />
        </div>
        <div className="lg:col-span-2 space-y-5">
          <ConfidenceCard data={ca} />
          <EmotionChart emotionPercentages={ca.emotion_percentages} />
          <SpeechCard issues={data.speech_analysis} />
        </div>
      </div>

      
      <div className="text-center pt-4">
        <button id="analyze-another-btn" onClick={onReset} className="btn-ghost text-sm">
          ← Analyze another video
        </button>
      </div>
    </div>
  );
}
