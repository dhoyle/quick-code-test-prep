"use server";

import { createClient } from "@/lib/supabase/server";

export async function finalizeTimedTest(
  sessionId: string,
  overallScore: number
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be logged in." };
  }

  const { error } = await supabase
    .from("timed_sessions")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      overall_score: overallScore,
    })
    .eq("user_id", user.id)
    .eq("session_id", sessionId);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}