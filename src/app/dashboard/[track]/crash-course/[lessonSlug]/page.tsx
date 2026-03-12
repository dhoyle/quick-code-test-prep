import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { createClient } from "@/lib/supabase/server";
import {
  getLessonByTrackAndSlug,
  getNextLesson,
} from "@/db/lessons";

type PageProps = {
  params: Promise<{
    track: string;
    lessonSlug: string;
  }>;
};

async function getLessonMarkdown(track: string, lessonSlug: string) {
  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    "lessons",
    track,
    `${lessonSlug}.md`
  );

  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

export default async function LessonPage({ params }: PageProps) {
  const { track, lessonSlug } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const lesson = await getLessonByTrackAndSlug(track, lessonSlug);

  if (!lesson) {
    notFound();
  }

  const markdown = await getLessonMarkdown(track, lessonSlug);

  if (!markdown) {
    notFound();
  }

  const nextLesson = await getNextLesson(
    lesson.track_id,
    lesson.lesson_order
  );

  return (
    <main className="p-8">
      <p>
        <Link href={`/dashboard/${track}`} className="underline">
          Back to {track.toUpperCase()}
        </Link>
      </p>

      <h1 className="mt-4 text-2xl font-bold">{lesson.title}</h1>

      <p className="mt-2 text-gray-600">
        {lesson.summary ?? "No summary yet."}
      </p>

      <section className="mt-8">
        <div className="prose max-w-none">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </section>

      <section className="mt-10 space-y-3">
        {nextLesson ? (
          <Link
            href={`/dashboard/${track}/crash-course/${nextLesson.slug}`}
            className="block underline"
          >
            Next Lesson → {nextLesson.title}
          </Link>
        ) : (
          <p className="font-semibold">
            Crash Course Complete
          </p>
        )}

        <Link
          href={`/dashboard/${track}`}
          className="block underline"
        >
          Back to {track.toUpperCase()}
        </Link>

        <Link
          href={`/dashboard/${track}/warmup`}
          className="block underline"
        >
          Try Warmup Practice
        </Link>
      </section>
    </main>
  );
}