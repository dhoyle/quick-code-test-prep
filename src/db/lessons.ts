import { createClient } from "@/lib/supabase/server";

export type Lesson = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  lesson_order: number;
  track_id: string;
};

export async function getLessonsByTrackSlug(
  trackSlug: string
): Promise<Lesson[]> {
  const supabase = await createClient();

  const { data: track, error: trackError } = await supabase
    .from("tracks")
    .select("id")
    .eq("slug", trackSlug)
    .single();

  if (trackError) {
    if (trackError.code === "PGRST116") {
      return [];
    }
    throw new Error(`Failed to load track: ${trackError.message}`);
  }

  const { data, error } = await supabase
    .from("lessons")
    .select("id, slug, title, summary, lesson_order, track_id")
    .eq("track_id", track.id)
    .eq("is_published", true)
    .order("lesson_order");

  if (error) {
    throw new Error(`Failed to load lessons: ${error.message}`);
  }

  return data ?? [];
}

export async function getLessonByTrackAndSlug(
  trackSlug: string,
  lessonSlug: string
): Promise<Lesson | null> {
  const supabase = await createClient();

  const { data: track, error: trackError } = await supabase
    .from("tracks")
    .select("id")
    .eq("slug", trackSlug)
    .single();

  if (trackError) {
    if (trackError.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to load track: ${trackError.message}`);
  }

  const { data, error } = await supabase
    .from("lessons")
    .select("id, slug, title, summary, lesson_order, track_id")
    .eq("track_id", track.id)
    .eq("slug", lessonSlug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to load lesson: ${error.message}`);
  }

  return data;
}