import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTrackBySlug } from "@/db/tracks";
import { getLessonsByTrackSlug } from "@/db/lessons";

type PageProps = {
  params: Promise<{
    track: string;
  }>;
};

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

  return (
    <div>
      <h1 className="text-2xl font-bold">{trackData.title}</h1>
      <p className="mt-2 text-gray-600">
        {trackData.description ?? "No description yet."}
      </p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Crash Course</h2>

        <ul className="mt-4 space-y-3">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link
                href={`/dashboard/${track}/crash-course/${lesson.slug}`}
                className="block rounded border p-4 hover:bg-gray-50"
              >
                <h3 className="text-lg font-semibold">
                  {lesson.lesson_order}. {lesson.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {lesson.summary ?? "No summary yet."}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Practice Tests</h2>

        <ul className="mt-4 space-y-3">
          <li>
            <Link
              href={`/dashboard/${track}/warmup`}
              className="block rounded border p-4 hover:bg-gray-50"
            >
              <h3 className="text-lg font-semibold">Warmup Test</h3>
              <p className="mt-1 text-sm text-gray-600">
                Untimed practice to build confidence before a real code test.
              </p>
            </Link>
          </li>

          <li>
            <Link
              href={`/dashboard/${track}/timed`}
              className="block rounded border p-4 hover:bg-gray-50"
            >
              <h3 className="text-lg font-semibold">Timed Test</h3>
              <p className="mt-1 text-sm text-gray-600">
                Timed practice to simulate a real coding assessment.
              </p>
            </Link>
          </li>
        </ul>
      </section>

      <p className="mt-8">
        <Link href="/dashboard" className="underline">
          Back to Dashboard
        </Link>
      </p>
    </div>
  );
}