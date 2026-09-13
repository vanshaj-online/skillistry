import { useNavigate, useLocation } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isInterview = location.pathname.startsWith("/interview");

  return (
    <div className="fixed top-6 w-full z-50 flex justify-center px-4 pointer-events-none">
      <header
        className="pointer-events-auto w-full max-w-4xl h-16 flex items-center justify-between px-6 rounded-full border border-[var(--border)] shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300"
        style={{ background: "rgba(255, 255, 255, 0.75)", backdropFilter: "blur(16px)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate("/")}
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
          {/* Mock Interview link — visible everywhere except during an active interview */}
          {!isInterview && (
            <button
              id="nav-mock-interview-btn"
              onClick={() => navigate("/interview")}
              className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-2)] hover:text-[var(--accent)] px-3 py-2 rounded-full transition-colors"
            >
              Mock Interview
            </button>
          )}

          {isHome && (
            <button
              id="nav-start-interview-btn"
              onClick={() => navigate("/interview")}
              className="flex items-center gap-1.5 text-[13px] font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] px-5 py-2 rounded-full transition-all hover:shadow-[0_4px_12px_rgba(61,79,224,0.28)] hover:-translate-y-[1px]"
            >
              Start Interview
            </button>
          )}
        </div>
      </header>
    </div>
  );
}
