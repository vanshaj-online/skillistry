import React from "react";
import { BarChart2 } from "lucide-react";
import Card from "../ui/Card";
import SectionHeader from "../ui/SectionHeader";

interface EmotionChartProps {
  emotionPercentages: Record<string, number>;
}

const LABELS: Record<string, string> = {
  happy: "Happy", neutral: "Neutral", surprise: "Surprise",
  angry: "Angry", disgust: "Disgust", fear: "Fear", sad: "Sad",
};

export default function EmotionChart({ emotionPercentages }: EmotionChartProps) {
  const entries = Object.entries(emotionPercentages)
    .sort(([, a], [, b]) => b - a)
    .filter(([, v]) => v > 0.1);

  return (
    <Card id="emotion-chart-card">
      <SectionHeader
        icon={<BarChart2 size={15} />}
        title="Emotion Breakdown"
        subtitle="Distribution across analyzed frames"
      />
      {entries.length === 0 ? (
        <p className="text-xs text-[var(--text-3)] py-4 text-center">No emotion data.</p>
      ) : (
        <div className="space-y-3">
          {entries.map(([emotion, pct], i) => {
            const opacity = Math.max(0.30, 1 - i * 0.1);
            return (
              <div key={emotion}>
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-[var(--text-2)] font-medium">{LABELS[emotion] ?? emotion}</span>
                  <span
                    className="text-[var(--text-3)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {pct.toFixed(1)}%
                  </span>
                </div>
                
                <div className="h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                  <div
                    className="h-full rounded-full stat-bar"
                    style={{
                      width: `${pct}%`,
                      background: `rgba(61, 79, 224, ${opacity})`, 
                      animationDelay: `${i * 60}ms`,
                    } as React.CSSProperties}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
