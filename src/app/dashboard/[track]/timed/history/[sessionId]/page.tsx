import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTrackBySlug } from "@/db/tracks";

type PageProps = {
  params: Promise<{
    track: string;
    sessionId: string;
  }>;
};

export default async function TimedSessionPage({ params }: PageProps) {
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

  const { data: attempts, error } = await supabase
    .from("attempts")
    .select("*")
    .eq("user_id", user.id)
    .eq("track_id", trackData.id)
    .eq("mode", "timed")
    .eq("session_id", sessionId)
    .order("created_at");

  if (error || !attempts || attempts.length === 0) {
    notFound();
  }

  const scores = attempts.map((a) => a.result?.score ?? 0);

  const overallScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  return (
    <div>
      <p>
        <Link
          href={`/dashboard/${track}/timed/history`}
          className="underline"
        >
          Back to Timed Test History
        </Link>
      </p>

      <h1 className="mt-4 text-2xl font-bold">Timed Test Review</h1>

      <p className="mt-2 text-gray-600">Overall score: {overallScore}%</p>

      <div className="mt-6 space-y-6">
        {attempts.map((attempt, index) => (
          <div key={attempt.id} className="rounded border p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                {index + 1}. {attempt.prompt_title}
              </p>

              <p
                className={
                  attempt.result?.isCorrect
                    ? "font-semibold text-green-700"
                    : "font-semibold text-amber-700"
                }
              >
                {attempt.result?.isCorrect ? "Correct" : "Needs work"} —{" "}
                {attempt.result?.score ?? 0}%
              </p>
            </div>

            <p className="mt-3 text-sm text-gray-600">{attempt.prompt_text}</p>

            <pre className="mt-3 whitespace-pre-wrap rounded bg-gray-50 p-3 font-mono text-sm">
              {attempt.user_answer || "(No answer submitted)"}
            </pre>

            {attempt.result?.missing?.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700">
                  Missing elements
                </p>

                <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                  {attempt.result.missing.map(
                    (item: string, itemIndex: number) => (
                      <li key={`${item}-${itemIndex}`}>{item}</li>
                    )
                  )}
                </ul>
              </div>
            )}

            {attempt.result?.forbiddenMatched?.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700">
                  Problematic elements
                </p>

                <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                  {attempt.result.forbiddenMatched.map(
                    (item: string, itemIndex: number) => (
                      <li key={`${item}-${itemIndex}`}>{item}</li>
                    )
                  )}
                </ul>
              </div>
            )}

            {(attempt.result?.unexpectedColumns?.length ?? 0) > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700">
                  Unexpected columns
                </p>

                <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                  {attempt.result.unexpectedColumns.map(
                    (item: string, itemIndex: number) => (
                      <li key={`${item}-${itemIndex}`}>{item}</li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}