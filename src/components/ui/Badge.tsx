import React from "react";

type Variant = "accent" | "success" | "warning" | "info" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

const styles: Record<Variant, string> = {
  accent:  "bg-[var(--accent-subtle)]  text-[var(--accent)]   border-[var(--accent-border)]",
  success: "bg-[var(--success-subtle)] text-[var(--success)]  border-[rgba(46,158,107,0.22)]",
  warning: "bg-[var(--warning-subtle)] text-[var(--warning)]  border-[rgba(217,123,41,0.22)]",
  info:    "bg-[var(--info-subtle)]    text-[var(--info)]     border-[rgba(91,100,114,0.22)]",
  neutral: "bg-[var(--bg-subtle)]      text-[var(--text-2)]   border-[var(--border)]",
};

export default function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${styles[variant]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
