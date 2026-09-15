/**
 * API client for the session-based AI mock interview endpoints.
 *
 * This file is separate from client.ts so the legacy /upload flow
 * remains completely unchanged.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface ApiError {
  detail: string;
}

// ---------------------------------------------------------------------------
// Interview session types
// ---------------------------------------------------------------------------

export interface QuestionItem {
  question_id: string;
  question_number: number;
  question_text: string;
  category: string;
  dimension: string;
}

export interface CreateSessionResponse {
  session_id: string;
  status: string;
  questions: QuestionItem[];
}

export interface SessionStatusResponse {
  session_id: string;
  status: string;
  questions_answered: number;
  total_questions: number;
}

export interface QuestionProcessingStatusResponse {
  status: string;
  message: string;
}

export interface QuestionPollResponse {
  status: string; // "processing", "completed", "failed"
  result?: QuestionResultResponse;
}

// ---------------------------------------------------------------------------
// Per-question result types
// ---------------------------------------------------------------------------

export interface QuestionScore {
  confidence_score: number;
  body_language_score: number;
  speech_score: number;
  content_score: number;
  question_score: number;
}

export interface ToneModel {
  score: number;
  appropriateness: string;
}

export interface GrammarIssue {
  issue: string;
  correction: string;
}

export interface PronunciationIssue {
  word: string;
  correction: string;
  phonetic: string;
}

export type AnswerStatus = "VALID" | "NO_SPEECH" | "INSUFFICIENT_RESPONSE" | "TRANSCRIPTION_FAILED";

export interface AnswerValidity {
  status: AnswerStatus;
  speech_detected: boolean;
  speech_duration: number;
  transcript_available: boolean;
  transcript_word_count: number;
  meaningful_answer: boolean;
  reason: string | null;
}

export interface ContentAnalysis {
  word_count: number;
  clarity: string;
  engagement: string;
  structure: string;
  grammar: GrammarIssue[];
  tone: ToneModel;
  relevance: string;
  answer_quality: string;
  suggestions: string;
}

export interface ConfidenceAnalysis {
  confidence_score: number;
  frames_analyzed: number;
  total_frames: number;
  blinks_per_minute: number;
  blink_rate_category: string;
  emotion_percentages: Record<string, number>;
  frame_details: Array<{
    frame: number;
    dominant_emotion: string;
    weighted_score: number;
  }>;
}

export interface QuestionResultResponse {
  session_id: string;
  question_id: string;
  question_number: number;
  question_text: string;
  score: QuestionScore;
  transcription: string;
  confidence_analysis: ConfidenceAnalysis;
  speech_analysis: PronunciationIssue[];
  content_analysis: ContentAnalysis;
  answer_validity: AnswerValidity | null;
  is_last_question: boolean;
  next_question: QuestionItem | null;
}

// ---------------------------------------------------------------------------
// Overall report types
// ---------------------------------------------------------------------------

export interface TrendItem {
  metric: string;
  observation: string;
}

export interface OverallAnalysis {
  overall_score: number;
  communication_score: number;
  confidence_score: number;
  speech_score: number;
  body_language_score: number;
  content_score: number;
  strengths: string[];
  areas_to_improve: string[];
  recommendations: string[];
  trends: TrendItem[];
  question_scores: number[];
  confidence_trend: number[];
  speech_trend: number[];
  content_trend: number[];
}

export interface QuestionDetail {
  question_id: string;
  question_number: number;
  question_text: string;
  score: number;
  confidence_score: number;
  body_language_score: number;
  speech_score: number;
  content_score: number;
  transcription: string;
  confidence_analysis: ConfidenceAnalysis;
  speech_analysis: PronunciationIssue[];
  content_analysis: ContentAnalysis;
  answer_validity: AnswerValidity | null;
}

export interface InterviewReportResponse {
  session_id: string;
  status: string;
  overall_analysis: OverallAnalysis | null;
  questions: QuestionDetail[];
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err: ApiError = await res.json().catch(() => ({ detail: `Server error ${res.status}` }));
    throw new Error(err.detail ?? `Server error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** Create a new interview session and get the 5 questions. */
export async function createInterview(): Promise<CreateSessionResponse> {
  const res = await fetch(`${BASE_URL}/interviews`, { method: "POST" });
  return handleResponse<CreateSessionResponse>(res);
}

/** Get the status of an existing session. */
export async function getInterviewStatus(sessionId: string): Promise<SessionStatusResponse> {
  const res = await fetch(`${BASE_URL}/interviews/${sessionId}/status`);
  return handleResponse<SessionStatusResponse>(res);
}

/** Upload the recorded video answer for a specific question. */
export async function submitQuestionResponse(
  sessionId: string,
  questionId: string,
  videoBlob: Blob,
  filename: string = "response.webm"
): Promise<QuestionProcessingStatusResponse> {
  const form = new FormData();
  form.append("video", videoBlob, filename);

  const res = await fetch(
    `${BASE_URL}/interviews/${sessionId}/questions/${questionId}/response`,
    { method: "POST", body: form }
  );
  return handleResponse<QuestionProcessingStatusResponse>(res);
}

/** Poll for the result of a specific question. */
export async function pollQuestionResult(
  sessionId: string,
  questionId: string
): Promise<QuestionPollResponse> {
  const res = await fetch(`${BASE_URL}/interviews/${sessionId}/questions/${questionId}/result`);
  return handleResponse<QuestionPollResponse>(res);
}

/** Get the full interview report (call after all 5 questions are submitted). */
export async function getInterviewReport(sessionId: string): Promise<InterviewReportResponse> {
  const res = await fetch(`${BASE_URL}/interviews/${sessionId}`);
  return handleResponse<InterviewReportResponse>(res);
}
