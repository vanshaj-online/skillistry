"use client";
/**
 * Route wrapper for the interview report page.
 * Accepts report data from navigation state (passed by InterviewPage)
 * or fetches it from the backend if loaded directly via URL.
 */
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getInterviewReport } from "../../api/interviewClient";
import type { InterviewReportResponse } from "../../api/interviewClient";
import InterviewReportPage from "./InterviewReportPage";
import { LoadingOverlay } from "../ui/Spinner";
import ErrorState from "../ui/ErrorState";

export default function InterviewReportRoute() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const router = useRouter();

  const [report, setReport] = useState<InterviewReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
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
      <ErrorState 
        title="Could not load report" 
        message={error || "Report not found."} 
        onAction={() => router.push("/interview")} 
        actionText="Back to Interview" 
      />
    );
  }

  return <InterviewReportPage report={report} />;
}
