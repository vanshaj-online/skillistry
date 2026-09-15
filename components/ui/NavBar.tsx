"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = pathname === "/";
  const isInterview = pathname.startsWith("/interview");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`fixed w-full z-50 flex justify-center px-4 pointer-events-none transition-all duration-300 ${isScrolled ? "top-3" : "top-6"}`}>
      <header
        className={`pointer-events-auto w-full ${isInterview ? "max-w-2xl" : "max-w-4xl"} flex items-center justify-between px-6 rounded-full border transition-all duration-300 ${
          isScrolled
            ? "h-14 border-[var(--border)] shadow-[0_8px_32px_rgba(0,0,0,0.1)] bg-white/85 backdrop-blur-xl"
            : "h-16 border-transparent shadow-none bg-white/50 backdrop-blur-md"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2.5 group"
            aria-label="Home"
          >
            <img
              src="/logo.png"
              alt="Skillistry Logo"
              className="h-7 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span
              className="text-base font-semibold text-[var(--text-1)] tracking-tight transition-colors group-hover:text-[var(--accent)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Skillistry
            </span>
          </button>
        </div>

        {/* Nav actions */}
        <div className="flex items-center gap-3">
          {/* Mock Interview link — visible everywhere except during an active interview and homepage */}
          {!isInterview && !isHome && (
            <button
              id="nav-mock-interview-btn"
              onClick={() => router.push("/interview")}
              className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-2)] hover:text-[var(--accent)] px-3 py-2 rounded-full transition-colors"
            >
              Mock Interview
            </button>
          )}

          {isHome && (
            <button
              id="nav-start-interview-btn"
              onClick={() => router.push("/interview")}
              className="flex items-center gap-1.5 text-[13px] font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] px-5 py-2 rounded-full transition-all hover:shadow-[0_4px_12px_rgba(61,79,224,0.28)] hover:-translate-y-[1px]"
            >
              Start Interview
            </button>
          )}

          {isInterview && (
            <button
              id="nav-exit-interview-btn"
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-3)] hover:text-[var(--text-1)] px-3 py-2 rounded-full transition-colors"
            >
              Exit
            </button>
          )}
        </div>
      </header>
    </div>
  );
}
