import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTrackBySlug } from "@/db/tracks";
import StartTimedTestButton from "@/components/timed/start-timed-test-button";

type PageProps = {
  params: Promise<{ track: string }>;
};

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
    .select("session_id")
    .eq("user_id", user.id)
    .eq("track_id", trackData.id)
    .eq("status", "in_progress")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const activeSessionId =
    activeSession && typeof activeSession.session_id === "string"
      ? activeSession.session_id
      : null;

  return (
    <div>
      <p>
        <Link href={`/dashboard/${track}`} className="underline">
          Back to {track.toUpperCase()}
        </Link>
      </p>

      <h1 className="mt-4 text-2xl font-bold">
        {trackData.title} — Timed Test
      </h1>

      <p className="mt-2 text-gray-600">
        Complete a timed set of questions to simulate a coding assessment.
      </p>

      <section className="mt-8 max-w-xl rounded border bg-gray-50 p-6">
        <h2 className="text-xl font-semibold">Ready to begin?</h2>

        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li>• 5 random SQL questions</li>
          <li>• 30 minute timer</li>
          <li>• Automatic grading when you submit</li>
          <li>• Results saved to your timed test history</li>
        </ul>

        <div className="mt-6">
          <StartTimedTestButton
            track={track}
            activeSessionId={activeSessionId}
          />
        </div>
      </section>
    </div>
  );
}