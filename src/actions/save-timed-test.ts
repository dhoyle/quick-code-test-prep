"use server";

import { createClient } from "@/lib/supabase/server";

type TimedAttemptInput = {
  trackSlug: string;
  sessionId: string;
  questions: Array<{
    slug: string;
    title: string;
    promptText: string;
    userAnswer: string;
    result: {
      isCorrect?: boolean;
      score?: number;
      missing?: string[];
      forbiddenMatched?: string[];
      unexpectedColumns?: string[];
    };
  }>;
};

export async function saveTimedTest(input: TimedAttemptInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      error: "You must be logged in to save a timed test.",
    };
  }

  const { data: track, error: trackError } = await supabase
    .from("tracks")
    .select("id")
    .eq("slug", input.trackSlug)
    .single();

  if (trackError || !track) {
    return {
      ok: false,
      error: "Could not find the selected track.",
    };
  }

  const { data: session, error: sessionError } = await supabase
    .from("timed_sessions")
    .select("id, session_id")
    .eq("user_id", user.id)
    .eq("track_id", track.id)
    .eq("session_id", input.sessionId)
    .single();

  if (sessionError || !session) {
    return {
      ok: false,
      error: "Timed session not found.",
    };
  }

  const rows = input.questions.map((question) => ({
    user_id: user.id,
    track_id: track.id,
    mode: "timed",
    session_id: input.sessionId,
    question_slug: question.slug,
    prompt_title: question.title,
    prompt_text: question.promptText,
    user_answer: question.userAnswer.trim(),
    result: question.result,
  }));

  const overallScore =
    rows.length > 0
      ? Math.round(
          rows.reduce((sum, row) => {
            const score =
              row.result && typeof row.result.score === "number"
                ? row.result.score
                : 0;
            return sum + score;
          }, 0) / rows.length
        )
      : 0;

  const { error: deleteError } = await supabase
    .from("attempts")
    .delete()
    .eq("user_id", user.id)
    .eq("track_id", track.id)
    .eq("mode", "timed")
    .eq("session_id", input.sessionId);

  if (deleteError) {
    return {
      ok: false,
      error: deleteError.message,
    };
  }

  const { error: insertError } = await supabase.from("attempts").insert(rows);

  if (insertError) {
    return {
      ok: false,
      error: insertError.message,
    };
  }

  const { error: updateSessionError } = await supabase
    .from("timed_sessions")
    .update({
      status: "completed",
      overall_score: overallScore,
    })
    .eq("user_id", user.id)
    .eq("track_id", track.id)
    .eq("session_id", input.sessionId);

  if (updateSessionError) {
    return {
      ok: false,
      error: updateSessionError.message,
    };
  }

  return {
    ok: true,
    error: null,
  };
}