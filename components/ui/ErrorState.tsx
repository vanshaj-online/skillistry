import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onAction?: () => void;
  actionText?: string;
  actionId?: string;
}

export default function ErrorState({ 
  title = "Something went wrong", 
  message, 
  onAction, 
  actionText = "Start over",
  actionId
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] gap-5 anim-up px-5">
      <div
        className="w-12 h-12 rounded-[var(--r-lg)] flex items-center justify-center"
        style={{ background: "var(--warning-subtle)", border: "1px solid rgba(217,123,41,0.22)" }}
      >
        <AlertTriangle size={20} style={{ color: "var(--warning)" }} />
      </div>
      <div className="text-center space-y-1.5 max-w-sm">
        <h2
          className="text-sm font-semibold text-[var(--text-1)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}
        </h2>
        <p className="text-xs text-[var(--text-2)] leading-relaxed">{message}</p>
      </div>
      {onAction && (
        <button id={actionId} onClick={onAction} className="btn-primary text-sm px-5 py-2">
          {actionText}
        </button>
      )}
    </div>
  );
}
