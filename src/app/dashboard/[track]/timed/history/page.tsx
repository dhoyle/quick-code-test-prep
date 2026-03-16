import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTrackBySlug } from "@/db/tracks";
import { getTimedSessions } from "@/db/timed-sessions";

type PageProps = {
  params: Promise<{ track: string }>;
};

export default async function TimedHistoryPage({ params }: PageProps) {
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

  const sessions = await getTimedSessions(user.id, trackData.id);

  return (
    <div>
      <p>
        <Link href={`/dashboard/${track}/timed`} className="underline">
          Back to Timed Test
        </Link>
      </p>

      <h1 className="mt-4 text-2xl font-bold">Timed Test History</h1>

      {sessions.length === 0 && (
        <p className="mt-4 text-gray-600">
          You have not completed any timed tests yet.
        </p>
      )}

      <div className="mt-6 space-y-6">
        {sessions.map((session) => (
          <div key={session.sessionId} className="rounded border p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                Session — {new Date(session.createdAt).toLocaleString()}
              </p>

              <p className="text-sm text-gray-700">
                Overall score: {session.overallScore}%
              </p>
            </div>

            <div className="mt-4 space-y-2">
              {session.attempts.map((attempt, index) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    {index + 1}. {attempt.prompt_title}
                  </span>

                  <span
                    className={
                      attempt.result?.isCorrect
                        ? "text-green-700"
                        : "text-amber-700"
                    }
                  >
                    {attempt.result?.isCorrect ? "✓" : "⚠"}{" "}
                    {attempt.result?.score ?? 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}