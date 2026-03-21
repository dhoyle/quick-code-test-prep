import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTracks } from "@/db/tracks";
import { getWarmupProgress } from "@/db/warmup-progress";
import { getBestTimedScore } from "@/db/timed-progress";
import { getWarmupQuestionsForTrack } from "@/data/question-bank";
import LogoutButton from "@/components/auth/logout-button";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";

function getWarmupChipClasses(completed: number, total: number) {
  if (total > 0 && completed === total) {
    return "rounded bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700";
  }

  if (completed > 0) {
    return "rounded bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700";
  }

  return "rounded bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600";
}

function getTimedChipClasses(bestTimedScore: number | null) {
  if (bestTimedScore === null) {
    return "rounded bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600";
  }

  if (bestTimedScore >= 80) {
    return "rounded bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700";
  }

  if (bestTimedScore >= 60) {
    return "rounded bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700";
  }

  return "rounded bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700";
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const tracks = await getTracks();

  const trackProgress = await Promise.all(
    tracks.map(async (track) => {
      const warmupQuestions = getWarmupQuestionsForTrack(track.slug);
      const warmupProgress = await getWarmupProgress(user.id, track.id);
      const bestTimedScore = await getBestTimedScore(user.id, track.id);

      const completedWarmups = warmupQuestions.filter(
        (question) => warmupProgress[question.slug]?.isComplete
      ).length;

      return {
        trackId: track.id,
        completedWarmups,
        totalWarmups: warmupQuestions.length,
        bestTimedScore,
      };
    })
  );

  const progressByTrackId = new Map(
    trackProgress.map((item) => [item.trackId, item])
  );

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />

      <main className="flex-1 p-8 text-base leading-relaxed">
        <div className="mx-auto w-full max-w-5xl">
          <section className="rounded border bg-gray-50 p-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <p className="mt-3 text-base text-gray-700">
              Practice interview-style SQL and Python questions with a mix of
              crash-course lessons, warmup tests, and timed practice.
            </p>

            <p className="mt-4 text-base text-gray-600">
              Signed in as: {user.email}
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold">Available Tracks</h2>

            <p className="mt-2 text-base text-gray-600">
              Choose a track to review concepts, build confidence with warmups,
              and practice under time pressure.
            </p>

            <ul className="mt-6 space-y-4">
              {tracks.map((track) => {
                const progress = progressByTrackId.get(track.id);
                const completedWarmups = progress?.completedWarmups ?? 0;
                const totalWarmups = progress?.totalWarmups ?? 0;
                const bestTimedScore = progress?.bestTimedScore ?? null;

                return (
                  <li key={track.id}>
                    <Link
                      href={`/dashboard/${track.slug}`}
                      className="block rounded border p-5 transition hover:bg-gray-50"
                    >
                      <h3 className="text-xl font-semibold">{track.title}</h3>

                      <p className="mt-2 text-base text-gray-600">
                        {track.description ?? "No description yet."}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <span
                          className={getWarmupChipClasses(
                            completedWarmups,
                            totalWarmups
                          )}
                        >
                          Warmups: {completedWarmups} / {totalWarmups} complete
                        </span>

                        <span className={getTimedChipClasses(bestTimedScore)}>
                          Best timed score:{" "}
                          {bestTimedScore !== null
                            ? `${bestTimedScore}%`
                            : "No score yet"}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="mt-10">
            <LogoutButton />
          </section>
        </div>
      </main>
    </div>
  );
}