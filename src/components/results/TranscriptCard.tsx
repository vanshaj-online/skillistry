import { MessageSquare } from "lucide-react";
import Card from "../ui/Card";
import SectionHeader from "../ui/SectionHeader";

interface TranscriptCardProps { transcription: string; }

export default function TranscriptCard({ transcription }: TranscriptCardProps) {
  const empty = !transcription?.trim();
  return (
    <Card id="transcript-card">
      <SectionHeader
        icon={<MessageSquare size={15} />}
        title="Transcription"
        subtitle="Audio-to-text from your interview"
      />
      {empty ? (
        <p className="text-xs text-[var(--text-3)] py-4 text-center">No speech detected.</p>
      ) : (
        
        <p className="text-sm leading-7 text-[var(--text-2)] border-l-[3px] border-[var(--accent)] pl-4 py-1">
          {transcription}
        </p>
      )}
    </Card>
  );
}
