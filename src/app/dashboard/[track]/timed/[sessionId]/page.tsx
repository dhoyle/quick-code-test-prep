import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTrackBySlug } from "@/db/tracks";
import TimedTest from "@/components/timed/timed-test";
import { getTimedQuestionsForTrack } from "@/data/question-bank";

type PageProps = {
  params: Promise<{ track: string; sessionId: string }>;
};

export default async function TimedStartPage({ params }: PageProps) {
  const { track, sessionId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const trackData = await getTrackBySlug(track);

  if (!trackData) {
    notFound();
  }

  const { data: session, error } = await supabase
    .from("timed_sessions")
    .select("*")
    .eq("user_id", user.id)
    .eq("track_id", trackData.id)
    .eq("session_id", sessionId)
    .single();

  if (error || !session) {
    notFound();
  }

  const questionSlugs = Array.isArray(session.question_slugs)
    ? session.question_slugs
    : [];

  const questionMap = new Map(
    getTimedQuestionsForTrack(track).map((q) => [q.slug, q])
  );

  const questions = questionSlugs
    .map((slug) => questionMap.get(String(slug)))
    .filter(Boolean);

  return (
    <div>
      <p>
        <Link href={`/dashboard/${track}/timed`} className="underline">
          Back to Timed Test
        </Link>
      </p>

      <h1 className="mt-4 text-2xl font-bold">
        {trackData.title} — Timed Test
      </h1>

      <TimedTest
        track={track}
        sessionId={sessionId}
        questions={questions}
        durationSeconds={session.duration_seconds}
        startedAt={session.started_at}
      />
    </div>
  );
}