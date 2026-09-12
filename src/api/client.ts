const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";


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

export interface AnalysisResponse {
  video_id: string;
  transcription: string;
  confidence_analysis: ConfidenceAnalysis;
  speech_analysis: PronunciationIssue[];
  content_analysis: ContentAnalysis;
}

export interface ApiError {
  detail: string;
}




export async function uploadVideo(
  file: File,
  question: string
): Promise<AnalysisResponse> {
  const form = new FormData();
  form.append("video", file);
  form.append("question", question);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err: ApiError = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail ?? `Server error ${res.status}`);
  }

  return res.json() as Promise<AnalysisResponse>;
}
