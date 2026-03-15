import { createClient } from "@/lib/supabase/server";
import { getTrackBySlug, getTracks } from "@/db/tracks";
import { getLessonsByTrackSlug } from "@/db/lessons";
import { getWarmupProgress } from "@/db/warmup-progress";
import TrackSidebarClient from "@/components/layout/track-sidebar-client";
import { SQL_WARMUP_QUESTIONS } from "@/data/warmup-questions";

type Props = {
  track: string;
};

export default async function TrackSidebar({ track }: Props) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const trackData = await getTrackBySlug(track);
  const lessons = await getLessonsByTrackSlug(track);
  const allTracks = await getTracks();

  if (!trackData) {
    return (
      <aside className="w-72 shrink-0 border-r p-6">
        <p className="text-sm text-gray-500">Track not found.</p>
      </aside>
    );
  }

  const otherTracks = allTracks.filter((t) => t.slug !== track);
  const warmupQuestions = track === "sql" ? SQL_WARMUP_QUESTIONS : [];
  const warmupProgress =
    user && track === "sql"
      ? await getWarmupProgress(user.id, trackData.id)
      : {};

  return (
    <TrackSidebarClient
      track={track}
      trackTitle={trackData.title}
      lessons={lessons}
      warmupQuestions={warmupQuestions}
      warmupProgress={warmupProgress}
      otherTracks={otherTracks}
    />
  );
}