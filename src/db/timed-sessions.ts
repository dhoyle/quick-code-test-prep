import { createClient } from "@/lib/supabase/server";

export async function getTimedSessions(userId: string, trackId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("track_id", trackId)
    .eq("mode", "timed")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const sessions: Record<string, any[]> = {};

  for (const row of data ?? []) {
    const sessionId = row.session_id;

    if (!sessionId) continue;

    if (!sessions[sessionId]) {
      sessions[sessionId] = [];
    }

    sessions[sessionId].push(row);
  }

  return Object.entries(sessions).map(([sessionId, attempts]) => {
    const scores = attempts.map((a) => a.result?.score ?? 0);

    const overall =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    return {
      sessionId,
      createdAt: attempts[0].created_at,
      overallScore: overall,
      attempts,
    };
  });
}