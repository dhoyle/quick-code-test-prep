import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTrackBySlug } from "@/db/tracks";
import { getTimedSessionBySlug } from "@/db/timed-session";
import TimedTestSession from "@/components/timed/timed-test-session";

type PageProps = {
  params: Promise<{
    track: string;
    sessionSlug: string;
  }>;
};

export default async function TimedSessionPage({ params }: PageProps) {
  const { track, sessionSlug } = await params;

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

  const session = await getTimedSessionBySlug(user.id, sessionSlug);

  if (!session || session.track_id !== trackData.id) {
    notFound();
  }

  return (
    <div>
      <p>
        <Link href={`/dashboard/${track}/timed`} className="underline">
          Back to Timed Test
        </Link>
      </p>

      <h1 className="mt-4 text-2xl font-bold">{trackData.title} — Timed Test</h1>

      <TimedTestSession
        track={track}
        sessionSlug={sessionSlug}
        questions={session.questions}
        initialAnswers={session.answers ?? {}}
        durationSeconds={session.duration_seconds}
        startedAt={session.started_at}
        isSubmitted={session.is_submitted}
      />
    </div>
  );
}