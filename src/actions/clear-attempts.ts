"use server";

import { createClient } from "@/lib/supabase/server";

type Input = {
  trackSlug: string;
  questionSlug: string;
};

export async function clearAttempts(input: Input) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Not authenticated." };
  }

  const { data: track, error: trackError } = await supabase
    .from("tracks")
    .select("id")
    .eq("slug", input.trackSlug)
    .single();

  if (trackError || !track) {
    return { ok: false, error: "Track not found." };
  }

  const { error } = await supabase
    .from("attempts")
    .delete()
    .eq("user_id", user.id)
    .eq("track_id", track.id)
    .eq("mode", "warmup")
    .eq("question_slug", input.questionSlug);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}