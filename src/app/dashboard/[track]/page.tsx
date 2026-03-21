import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTrackBySlug } from "@/db/tracks";
import { getLessonsByTrackSlug } from "@/db/lessons";
import { getWarmupProgress } from "@/db/warmup-progress";
import { getBestTimedScore } from "@/db/timed-progress";
import { getWarmupQuestionsForTrack } from "@/data/question-bank";

type PageProps = {
  params: Promise<{
    track: string;
  }>;
};

function getTrackLabel(track: string) {
  return track === "python" ? "Python" : "SQL";
}

function getTrackValueProp(track: string) {
  if (track === "python") {
    return "Practice common Python interview questions with instant feedback and timed drills.";
  }

  return "Build confidence with core SQL concepts, guided practice, and timed test simulation.";
}

function getSuggestedPath(track: string) {
  if (track === "python") {
    return "New to Python or need a refresher? Review key concepts in the crash course, build confidence with warmup tests, and then simulate a real assessment with a timed test.";
  }

  return "New to SQL or need a refresher? Review key concepts in the crash course, build confidence with warmup tests, and then simulate a real assessment with a timed test.";
}

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

export default async function TrackPage({ params }: PageProps) {
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

  const lessons = await getLessonsByTrackSlug(track);
  const firstLesson = lessons[0] ?? null;

  const warmupQuestions = getWarmupQuestionsForTrack(track);
  const warmupProgress = await getWarmupProgress(user.id, trackData.id);
  const bestTimedScore = await getBestTimedScore(user.id, trackData.id);

  const completedWarmups = warmupQuestions.filter(
    (question) => warmupProgress[question.slug]?.isComplete
  ).length;

  return (
    <div className="max-w-5xl">
      <p>
        <Link href="/dashboard" className="underline">
          Back to Dashboard
        </Link>
      </p>

      {/* HERO */}
      <section className="mt-6 rounded border bg-gray-50 p-6">
        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
          {getTrackLabel(track)} Track
        </p>

        <h1 className="mt-2 text-3xl font-bold">{trackData.title}</h1>

        <p className="mt-3 max-w-3xl text-base text-gray-700">
          {trackData.description ?? getTrackValueProp(track)}
        </p>

        <p className="mt-4 max-w-3xl text-base text-gray-600">
          {getSuggestedPath(track)}
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <span
            className={getWarmupChipClasses(
              completedWarmups,
              warmupQuestions.length
            )}
          >
            Warmups: {completedWarmups} / {warmupQuestions.length} complete
          </span>

          <span className={getTimedChipClasses(bestTimedScore)}>
            Best timed score:{" "}
            {bestTimedScore !== null ? `${bestTimedScore}%` : "No score yet"}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {firstLesson && (
            <Link
              href={`/dashboard/${track}/crash-course/${firstLesson.slug}`}
              className="inline-flex items-center justify-center rounded border bg-white px-5 py-2.5 text-base font-medium transition hover:bg-gray-100"
            >
              Open Crash Course
            </Link>
          )}

          <Link
            href={`/dashboard/${track}/warmup`}
            className="inline-flex items-center justify-center rounded border bg-white px-5 py-2.5 text-base font-medium transition hover:bg-gray-100"
          >
            Open Warmup Tests
          </Link>

          <Link
            href={`/dashboard/${track}/timed`}
            className="inline-flex items-center justify-center rounded border bg-white px-5 py-2.5 text-base font-medium transition hover:bg-gray-100"
          >
            Open Timed Test
          </Link>
        </div>
      </section>

      {/* LOWER SECTIONS */}
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Crash Course */}
        <div className="rounded border bg-gray-50 p-6">
          <h2 className="text-xl font-semibold">Crash Course</h2>
          <p className="mt-2 text-base text-gray-600">
            Review the core concepts for this track before jumping into practice.
          </p>

          <ul className="mt-4 space-y-3">
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <Link
                  href={`/dashboard/${track}/crash-course/${lesson.slug}`}
                  className="block rounded border bg-white p-4 transition hover:bg-gray-100"
                >
                  <h3 className="text-base font-semibold">
                    {lesson.lesson_order}. {lesson.title}
                  </h3>
                  <p className="mt-1 text-base text-gray-600">
                    {lesson.summary ?? "No summary yet."}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Practice */}
        <div className="space-y-6">
          <div className="rounded border bg-gray-50 p-6">
            <h2 className="text-xl font-semibold">Warmup Tests</h2>
            <p className="mt-2 text-base text-gray-600">
              Untimed practice questions with instant feedback. Best for building
              confidence and learning the patterns.
            </p>

            <div className="mt-4">
              <Link
                href={`/dashboard/${track}/warmup`}
                className="inline-flex items-center justify-center rounded border bg-white px-5 py-2.5 text-base font-medium transition hover:bg-gray-100"
              >
                Open Warmup Tests
              </Link>
            </div>
          </div>

          <div className="rounded border bg-gray-50 p-6">
            <h2 className="text-xl font-semibold">Timed Test</h2>
            <p className="mt-2 text-base text-gray-600">
              Practice under time pressure with a short mixed set of questions
              designed to simulate a coding assessment.
            </p>

            <div className="mt-4">
              <Link
                href={`/dashboard/${track}/timed`}
                className="inline-flex items-center justify-center rounded border bg-white px-5 py-2.5 text-base font-medium transition hover:bg-gray-100"
              >
                Open Timed Test
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}