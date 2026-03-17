"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function clearTimedHistory(trackSlug: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      error: "You must be logged in to clear timed history.",
    };
  }

  const { data: track, error: trackError } = await supabase
    .from("tracks")
    .select("id")
    .eq("slug", trackSlug)
    .single();

  if (trackError || !track) {
    return {
      ok: false,
      error: "Could not find the selected track.",
    };
  }

  const { error: deleteAttemptsError } = await supabase
    .from("attempts")
    .delete()
    .eq("user_id", user.id)
    .eq("track_id", track.id)
    .eq("mode", "timed");

  if (deleteAttemptsError) {
    return {
      ok: false,
      error: deleteAttemptsError.message,
    };
  }

  const { error: deleteSessionsError } = await supabase
    .from("timed_sessions")
    .delete()
    .eq("user_id", user.id)
    .eq("track_id", track.id);

  if (deleteSessionsError) {
    return {
      ok: false,
      error: deleteSessionsError.message,
    };
  }

  revalidatePath(`/dashboard/${trackSlug}/timed`);
  revalidatePath(`/dashboard/${trackSlug}/timed/history`);

  return {
    ok: true,
    error: null,
  };
}