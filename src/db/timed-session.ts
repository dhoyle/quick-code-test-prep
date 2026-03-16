import { createClient } from "@/lib/supabase/server";

export type TimedSessionRow = {
  id: string;
  user_id: string;
  track_id: string;
  session_id: string;
  started_at: string;
  duration_seconds: number;
  question_slugs: string[];
  status: string;
  completed_at: string | null;
  overall_score: number | null;
};

export async function getActiveTimedSession(userId: string, trackId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("timed_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("track_id", trackId)
    .eq("status", "in_progress")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load active timed session: ${error.message}`);
  }

  return (data as TimedSessionRow | null) ?? null;
}