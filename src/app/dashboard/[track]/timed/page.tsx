import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTrackBySlug } from "@/db/tracks";
import StartTimedTestButton from "@/components/timed/start-timed-test-button";

type PageProps = {
  params: Promise<{ track: string }>;
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

function getTrackLabel(track: string) {
  return track === "python" ? "Python" : "SQL";
}

export default async function TimedPage({ params }: PageProps) {
  const { track } = await params;

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

  const { data: activeSession } = await supabase
    .from("timed_sessions")
    .select("session_id, started_at, duration_seconds")
    .eq("user_id", user.id)
    .eq("track_id", trackData.id)
    .eq("status", "in_progress")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let activeSessionId: string | null = null;

  if (activeSession && typeof activeSession.session_id === "string") {
    if (isSessionStillActive(activeSession)) {
      activeSessionId = activeSession.session_id;
    } else {
      await supabase
        .from("timed_sessions")
        .update({ status: "completed" })
        .eq("user_id", user.id)
        .eq("track_id", trackData.id)
        .eq("session_id", activeSession.session_id);
    }
  }

  return (
    <div className="max-w-3xl">
      <p>
        <Link href={`/dashboard/${track}`} className="underline">
          Back to {track.toUpperCase()}
        </Link>
      </p>

      <h1 className="mt-4 text-2xl font-bold">
        {trackData.title} — Timed Test
      </h1>

      <p className="mt-2 text-gray-600">
        Simulate a short {getTrackLabel(track)} coding assessment with a timed,
        auto-graded practice set.
      </p>

      <section className="mt-8 rounded border bg-gray-50 p-6">
        <h2 className="text-xl font-semibold">Ready to begin?</h2>

        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li>• 5 random {getTrackLabel(track)} questions</li>
          <li>• 30 minute timer</li>
          <li>• Automatic grading when you submit</li>
          <li>• Results saved to your timed test history</li>
        </ul>

        <p className="mt-4 text-sm text-gray-600">
          This is best after you’ve done a few warmup questions and want to
          practice under light time pressure.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <StartTimedTestButton
            track={track}
            activeSessionId={activeSessionId}
          />

          <Link
            href={`/dashboard/${track}/timed/history`}
            className="inline-flex items-center justify-center rounded border bg-white px-5 py-2.5 text-base font-medium transition hover:bg-gray-100"
          >
            View Timed Test History
          </Link>
        </div>
      </section>
    </div>
  );
}