import { createClient } from "@/lib/supabase/server";

export type Track = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
};

export async function getTracks(): Promise<Track[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tracks")
    .select("id, slug, title, description")
    .order("title");

  if (error) {
    throw new Error(`Failed to load tracks: ${error.message}`);
  }

  return data ?? [];
}

export async function getTrackBySlug(trackSlug: string): Promise<Track | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tracks")
    .select("id, slug, title, description")
    .eq("slug", trackSlug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to load track: ${error.message}`);
  }

  return data;
}