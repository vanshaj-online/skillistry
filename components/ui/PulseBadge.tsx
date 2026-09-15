interface PulseBadgeProps {
  children: React.ReactNode;
}

export default function PulseBadge({ children }: PulseBadgeProps) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border"
      style={{
        background: "var(--accent-subtle)",
        borderColor: "var(--accent-border)",
        color: "var(--accent)",
        fontFamily: "var(--font-mono)",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
      {children}
    </div>
  );
}
