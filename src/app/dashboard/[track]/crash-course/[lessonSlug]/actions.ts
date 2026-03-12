"use server";

import { createClient } from "@/lib/supabase/server";

type SaveAttemptInput = {
  trackSlug: string;
  lessonId: string;
  promptTitle: string;
  promptText: string;
  userAnswer: string;
};

export async function saveAttempt(input: SaveAttemptInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      error: "You must be logged in to save an attempt.",
    };
  }

  const trimmedAnswer = input.userAnswer.trim();

  if (!trimmedAnswer) {
    return {
      ok: false,
      error: "Please enter an answer before saving.",
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

  const { error } = await supabase.from("attempts").insert({
    user_id: user.id,
    track_id: track.id,
    mode: "warmup",
    prompt_title: input.promptTitle,
    prompt_text: input.promptText,
    user_answer: trimmedAnswer,
    result: null,
  });

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