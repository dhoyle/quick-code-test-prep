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
    <main className="p-8">
      <h1 className="text-2xl font-bold">{trackData.title}</h1>
      <p className="mt-2 text-gray-600">
        {trackData.description ?? "No description yet."}
      </p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Crash course</h2>
        <ul className="mt-4 space-y-3">
          {lessons.map((lesson) => (
            <li key={lesson.id} className="rounded border p-4">
              <h3 className="font-semibold">
                {lesson.lesson_order}. {lesson.title}
              </h3>
              <p className="text-sm text-gray-600">
                {lesson.summary ?? "No summary yet."}
              </p>
              <Link
                href={`/dashboard/${track}/crash-course/${lesson.slug}`}
                className="mt-2 inline-block underline"
              >
                Open lesson
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Practice modes</h2>
        <ul className="mt-4 space-y-2">
          <li>Warmup mode — coming soon</li>
          <li>Timed mode — coming soon</li>
        </ul>
      </section>

      <p className="mt-8">
        <Link href="/dashboard" className="underline">
          Back to dashboard
        </Link>
      </p>
    </main>
  );
}