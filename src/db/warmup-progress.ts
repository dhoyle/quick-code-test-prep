import { createClient } from "@/lib/supabase/server";

export type WarmupProgressMap = Record<
  string,
  {
    bestScore: number;
    isComplete: boolean;
  }
>;

export async function getWarmupProgress(
  userId: string,
  trackId: string
): Promise<WarmupProgressMap> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attempts")
    .select("question_slug, result")
    .eq("user_id", userId)
    .eq("track_id", trackId)
    .eq("mode", "warmup");

  if (error) {
    throw new Error(`Failed to load warmup progress: ${error.message}`);
  }

  const progress: WarmupProgressMap = {};

  for (const row of data ?? []) {
    const questionSlug = row.question_slug as string | null;
    const result = row.result as { score?: number; isCorrect?: boolean } | null;

    if (!questionSlug || !result) continue;

    const score = typeof result.score === "number" ? result.score : 0;
    const isCorrect = !!result.isCorrect;

    if (!progress[questionSlug]) {
      progress[questionSlug] = {
        bestScore: score,
        isComplete: isCorrect,
      };
      continue;
    }

    progress[questionSlug].bestScore = Math.max(
      progress[questionSlug].bestScore,
      score
    );
    progress[questionSlug].isComplete =
      progress[questionSlug].isComplete || isCorrect;
  }

  return progress;
}