import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTrackBySlug } from "@/db/tracks";
import TimedTest from "@/components/timed/timed-test";
import { getTimedQuestionsForTrack } from "@/data/question-bank";

type PageProps = {
  params: Promise<{ track: string; sessionId: string }>;
};

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

  if (session.status !== "in_progress") {
    redirect(`/dashboard/${track}/timed/history/${sessionId}`);
  }

  if (!isSessionStillActive(session)) {
    await supabase
      .from("timed_sessions")
      .update({ status: "completed" })
      .eq("user_id", user.id)
      .eq("track_id", trackData.id)
      .eq("session_id", sessionId);

    redirect(`/dashboard/${track}/timed/history/${sessionId}`);
  }

  const questionSlugs = Array.isArray(session.question_slugs)
    ? session.question_slugs
    : [];

  const questionMap = new Map(
    getTimedQuestionsForTrack(track).map((q) => [q.slug, q])
  );

  const questions = questionSlugs
    .map((slug: unknown) => questionMap.get(String(slug)))
    .filter(
      (
        q: ReturnType<typeof getTimedQuestionsForTrack>[number] | undefined
      ): q is ReturnType<typeof getTimedQuestionsForTrack>[number] =>
        q !== undefined
    );

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