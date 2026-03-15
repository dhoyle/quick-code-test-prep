import { createClient } from "@/lib/supabase/server";

export type AttemptResult = {
  isCorrect?: boolean;
  score?: number;
  matched?: string[];
  missing?: string[];
};

export type Attempt = {
  id: string;
  user_answer: string;
  created_at: string;
  result: AttemptResult | null;
};

export async function getRecentAttempts(
  userId: string,
  trackId: string,
  questionSlug: string,
  limit = 10
): Promise<Attempt[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("attempts")
    .select("id, user_answer, created_at, result")
    .eq("user_id", userId)
    .eq("track_id", trackId)
    .eq("mode", "warmup")
    .eq("question_slug", questionSlug)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to load attempts: ${error.message}`);
  }

  return data ?? [];
}