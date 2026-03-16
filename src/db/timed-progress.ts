import { createClient } from "@/lib/supabase/server";

export async function getBestTimedScore(
  userId: string,
  trackId: string
): Promise<number | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attempts")
    .select("session_id, result")
    .eq("user_id", userId)
    .eq("track_id", trackId)
    .eq("mode", "timed");

  if (error) {
    throw new Error(`Failed to load timed progress: ${error.message}`);
  }

  const sessions: Record<string, number[]> = {};

  for (const row of data ?? []) {
    const sessionId = row.session_id as string | null;
    const score =
      row.result && typeof row.result === "object" && "score" in row.result
        ? Number((row.result as { score?: number }).score ?? 0)
        : 0;

    if (!sessionId) continue;

    if (!sessions[sessionId]) {
      sessions[sessionId] = [];
    }

    sessions[sessionId].push(score);
  }

  const averages = Object.values(sessions).map((scores) =>
    scores.length > 0
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 0
  );

  if (averages.length === 0) {
    return null;
  }

  return Math.max(...averages);
}