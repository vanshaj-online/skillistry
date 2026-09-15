"use client";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import PulseBadge from "../ui/PulseBadge";

export default function HomePage() {
  const router = useRouter();
  return (
    <div className="anim-fade h-full">

      {/* Hero Section */}
      <section className="relative flex flex-col justify-center min-h-[90dvh] pt-28 pb-16 px-5 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(61,79,224,0.07) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
            
            {/* Left Column: Text Content */}
            <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
              <PulseBadge>AI MOCK INTERVIEW</PulseBadge>

              <h1
                className="max-w-[500px] text-5xl sm:text-[3.5rem] lg:text-[4rem] font-semibold tracking-tight text-[var(--text-1)] leading-[1.05] mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Master your next <span style={{ color: "var(--accent)" }}>interview.</span>
              </h1>

              <p className="text-lg text-[var(--text-2)] leading-relaxed max-w-[480px] mb-8">
                Get instant, AI-powered feedback on your speech, confidence, and delivery.
              </p>

              <div className="flex flex-col items-center lg:items-start gap-3 w-full">
                <button
                  id="home-start-interview-btn"
                  onClick={() => router.push("/interview")}
                  className="btn-primary px-8 py-4 text-sm gap-2"
                >
                  Start Mock Interview
                  <ArrowRight size={15} />
                </button>
                <p className="text-xs text-[var(--text-3)]">
                  Free to use · No account required · Results in ~60 seconds per question
                </p>
              </div>
            </div>

            {/* Right Column: Graphic */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0">
              <img 
                src="/woman-siting-on-stairs.svg" 
                alt="Candidate preparing for interview" 
                className="w-full max-w-[450px] lg:max-w-none lg:w-[115%] h-auto object-contain anim-up mix-blend-multiply opacity-95 drop-shadow-md transform lg:translate-x-8" 
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
