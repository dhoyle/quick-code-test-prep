"use server";

import { createClient } from "@/lib/supabase/server";
import { getTimedQuestionsForTrack } from "@/data/question-bank";

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function createSessionId() {
  return `timed_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function isSessionStillActive(session: {
  started_at: string | null;
  duration_seconds: number | null;
}) {
  if (!session.started_at || !session.duration_seconds) {
    return false;
  }

  const startedAtMs = new Date(session.started_at).getTime();

  if (Number.isNaN(startedAtMs)) {
    return false;
  }

  const expiresAtMs = startedAtMs + session.duration_seconds * 1000;
  return Date.now() < expiresAtMs;
}

export async function startTimedTest(trackSlug: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be logged in." };
  }

  const { data: track, error: trackError } = await supabase
    .from("tracks")
    .select("id")
    .eq("slug", trackSlug)
    .single();

  if (trackError || !track) {
    return { ok: false, error: "Track not found." };
  }

  const { data: existing, error: existingError } = await supabase
    .from("timed_sessions")
    .select("*")
    .eq("user_id", user.id)
    .eq("track_id", track.id)
    .eq("status", "in_progress")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    return { ok: false, error: existingError.message };
  }

  if (existing) {
    if (isSessionStillActive(existing)) {
      return {
        ok: true,
        sessionId: existing.session_id,
        alreadyExisted: true,
      };
    }

    const { error: expireError } = await supabase
      .from("timed_sessions")
      .update({ status: "completed" })
      .eq("user_id", user.id)
      .eq("track_id", track.id)
      .eq("session_id", existing.session_id);

    if (expireError) {
      return { ok: false, error: expireError.message };
    }
  }

  const questions = shuffleArray(getTimedQuestionsForTrack(trackSlug)).slice(0, 5);

  const sessionId = createSessionId();

  const { error } = await supabase.from("timed_sessions").insert({
    user_id: user.id,
    track_id: track.id,
    session_id: sessionId,
    duration_seconds: 30 * 60,
    question_slugs: questions.map((q) => q.slug),
    status: "in_progress",
    overall_score: null,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return {
    ok: true,
    sessionId,
    alreadyExisted: false,
  };
}