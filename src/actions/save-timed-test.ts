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
    result: unknown;
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

  const { error } = await supabase.from("attempts").insert(rows);

  if (error) {
    return {
      ok: false,
      error: error.message,
    };
  }

  return {
    ok: true,
    error: null,
  };
}