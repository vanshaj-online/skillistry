import { ArrowRight, Video } from "lucide-react";
import PulseBadge from "../ui/PulseBadge";

interface InterviewStartScreenProps {
  onStart: () => void;
  isLoading: boolean;
}

const DIMENSIONS = [
  { num: "01", label: "Introduction", desc: "Confidence & self-presentation" },
  { num: "02", label: "Communication", desc: "Clarity & structure" },
  { num: "03", label: "Problem Solving", desc: "Analytical approach" },
  { num: "04", label: "Adaptability", desc: "Teamwork & change" },
  { num: "05", label: "Self-Awareness", desc: "Motivation & growth" },
];

export default function InterviewStartScreen({ onStart, isLoading }: InterviewStartScreenProps) {
  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-5 py-10 md:py-16 flex flex-col items-center text-center anim-fade">
      
      {/* Header */}
      <PulseBadge>AI Mock Interview</PulseBadge>

      <h1
        className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text-1)] mb-4 leading-tight"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Test your interview skills with AI coaching.
      </h1>

      <p className="text-base text-[var(--text-2)] leading-relaxed max-w-lg mb-6">
        Answer 5 behavioural questions on camera and receive a personalized report based on your responses.
      </p>

      {/* Meta Info */}
      <div className="flex items-center justify-center gap-2 text-xs font-medium text-[var(--text-3)] mb-12">
        <span>10–15 minutes</span>
        <span>·</span>
        <span>5 questions</span>
        <span>·</span>
        <span>No account required</span>
      </div>

      {/* Dimensions List */}
      <div className="w-full max-w-sm mx-auto text-left mb-14">
        <div className="space-y-5">
          {DIMENSIONS.map((d) => (
            <div key={d.num} className="flex items-start gap-4">
              <span 
                className="text-sm font-semibold text-[var(--text-3)] mt-0.5" 
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {d.num}
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--text-1)] mb-0.5">{d.label}</p>
                <p className="text-xs text-[var(--text-2)]">{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis & CTA */}
      <div className="max-w-md w-full mx-auto text-center border-t border-[var(--border)] pt-10">
        <p className="text-sm text-[var(--text-2)] mb-8">
          Your responses will be analyzed for <span className="font-semibold text-[var(--text-1)]">speech, body language, confidence, and content.</span>
        </p>

        <button
          id="start-interview-btn"
          onClick={onStart}
          disabled={isLoading}
          className="btn-primary px-10 py-3.5 text-sm gap-2 shadow-sm w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              Preparing...
            </>
          ) : (
            <>
              Start Interview
              <ArrowRight size={16} />
            </>
          )}
        </button>
        <p className="text-[11px] text-[var(--text-3)] mt-4 flex items-center justify-center gap-1.5">
          <Video size={13} /> Camera and microphone access will be requested
        </p>
      </div>

    </div>
  );
}
