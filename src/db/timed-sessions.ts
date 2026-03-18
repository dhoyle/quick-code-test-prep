import { createClient } from "@/lib/supabase/server";

type AttemptResult = {
  isCorrect?: boolean;
  score?: number;
  missing?: string[];
  forbiddenMatched?: string[];
  unexpectedColumns?: string[];
} | null;

type TimedAttemptRow = {
  id: string;
  session_id: string | null;
  prompt_title: string;
  result: AttemptResult;
  created_at: string;
};

type TimedSessionRow = {
  session_id: string | null;
  started_at: string;
  overall_score: number | null;
};

export type TimedSessionSummary = {
  sessionId: string;
  createdAt: string;
  overallScore: number;
  attempts: Array<{
    id: string;
    prompt_title: string;
    result: AttemptResult;
    created_at: string;
  }>;
};

export async function getTimedSessions(
  userId: string,
  trackId: string
): Promise<TimedSessionSummary[]> {
  const supabase = await createClient();

  const { data: sessionData, error: sessionError } = await supabase
    .from("timed_sessions")
    .select("session_id, started_at, overall_score")
    .eq("user_id", userId)
    .eq("track_id", trackId)
    .eq("status", "completed")
    .order("started_at", { ascending: false });

  if (sessionError) {
    throw new Error(`Failed to load timed sessions: ${sessionError.message}`);
  }

  const sessions = (sessionData ?? []) as TimedSessionRow[];

  const validSessions = sessions.filter(
    (row): row is TimedSessionRow & { session_id: string } =>
      typeof row.session_id === "string" && row.session_id.length > 0
  );

  if (validSessions.length === 0) {
    return [];
  }

  const sessionIds = validSessions.map((row) => row.session_id);

  const { data: attemptData, error: attemptError } = await supabase
    .from("attempts")
    .select("id, session_id, prompt_title, result, created_at")
    .eq("user_id", userId)
    .eq("track_id", trackId)
    .eq("mode", "timed")
    .in("session_id", sessionIds)
    .order("created_at", { ascending: true });

  if (attemptError) {
    throw new Error(`Failed to load timed attempts: ${attemptError.message}`);
  }

  const attempts = (attemptData ?? []) as TimedAttemptRow[];

  const attemptsBySessionId = new Map<string, TimedAttemptRow[]>();

  for (const attempt of attempts) {
    if (!attempt.session_id) continue;

    const existing = attemptsBySessionId.get(attempt.session_id) ?? [];
    existing.push(attempt);
    attemptsBySessionId.set(attempt.session_id, existing);
  }

  return validSessions.map((session) => ({
    sessionId: session.session_id,
    createdAt: session.started_at,
    overallScore:
      typeof session.overall_score === "number" ? session.overall_score : 0,
    attempts: attemptsBySessionId.get(session.session_id) ?? [],
  }));
}