/**
 * Route wrapper for the interview report page.
 * Accepts report data from navigation state (passed by InterviewPage)
 * or fetches it from the backend if loaded directly via URL.
 */
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getInterviewReport } from "../../api/interviewClient";
import type { InterviewReportResponse } from "../../api/interviewClient";
import InterviewReportPage from "./InterviewReportPage";
import { LoadingOverlay } from "../ui/Spinner";
import { AlertTriangle } from "lucide-react";

export default function InterviewReportRoute() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [report, setReport] = useState<InterviewReportResponse | null>(
    (location.state as { report?: InterviewReportResponse } | null)?.report ?? null
  );
  const [loading, setLoading] = useState(!report);
  const [error, setError] = useState("");

  useEffect(() => {
    if (report || !sessionId) return;
    setLoading(true);
    getInterviewReport(sessionId)
      .then(setReport)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load report."))
      .finally(() => setLoading(false));
  }, [sessionId, report]);

  if (loading) {
    return <LoadingOverlay label="Loading your interview report…" />;
  }

  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh] gap-5 anim-up px-5">
        <div
          className="w-12 h-12 rounded-[var(--r-lg)] flex items-center justify-center"
          style={{ background: "var(--warning-subtle)", border: "1px solid rgba(217,123,41,0.22)" }}
        >
          <AlertTriangle size={20} style={{ color: "var(--warning)" }} />
        </div>
        <div className="text-center space-y-1.5 max-w-sm">
          <h2 className="text-sm font-semibold text-[var(--text-1)]">Could not load report</h2>
          <p className="text-xs text-[var(--text-2)]">{error || "Report not found."}</p>
        </div>
        <button onClick={() => navigate("/interview")} className="btn-primary text-sm px-5 py-2">
          Back to Interview
        </button>
      </div>
    );
  }

  return <InterviewReportPage report={report} />;
}
