
import { useNavigate, useLocation } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="fixed top-6 w-full z-50 flex justify-center px-4 pointer-events-none">
      <header
        className="pointer-events-auto w-full max-w-4xl h-16 flex items-center justify-between px-6 rounded-full border border-[var(--border)] shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300"
        style={{ background: "rgba(255, 255, 255, 0.75)", backdropFilter: "blur(16px)" }}
      >
        
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

        <div className="flex items-center gap-4">
          {isHome && (
            <div className="flex items-center gap-3 md:ml-2">
              <button
                onClick={() => navigate("/analysis")}
                className="flex items-center gap-1.5 text-[13px] font-medium bg-[var(--text-1)] text-white hover:bg-black px-5 py-2 rounded-full transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:-translate-y-[1px]"
              >
                Start Analysis
              </button>
            </div>
          )}
        </div>

      </header>
    </div>
  );
}
