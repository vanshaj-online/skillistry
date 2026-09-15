import React from "react";

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({ icon, title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex items-center gap-3">
        
        <span
          className="w-7 h-7 rounded-[var(--r-sm)] flex items-center justify-center shrink-0 text-[var(--accent)]"
          style={{ background: "var(--accent-subtle)", border: "1px solid var(--accent-border)" }}
        >
          {icon}
        </span>
        <div>
          <h2
            className="text-sm font-semibold text-[var(--text-1)] leading-none"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11px] text-[var(--text-3)] mt-0.5 leading-none">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
