import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { createClient } from "@/lib/supabase/server";
import {
  getLessonByTrackAndSlug,
  getLessonCount,
  getNextLesson,
  getPreviousLesson,
} from "@/db/lessons";

type PageProps = {
  params: Promise<{
    track: string;
    lessonSlug: string;
  }>;
};

const SQL_LESSON_TO_WARMUP_SLUG: Record<string, string> = {
  "select-basics": "basic-select",
  "where-filtering": "where-filter",
  distinct: "distinct-departments",
  "order-by": "order-by-scores",
  limit: "top-five-users",
  "null-handling": "null-emails",
  between: "between-salaries",
  "in-operator": "in-departments",
  "aggregate-functions": "count-users",
  "group-by": "group-by-department",
  having: "having-departments",
  "inner-join": "inner-join-orders",
  "left-join": "left-join-orders",
  "case-when": "case-age-group",
};

const PYTHON_LESSON_TO_WARMUP_SLUG: Record<string, string> = {
  "variables-and-types": "add-two-numbers",
  operators: "is-even",
  indentation: "is-even",
  conditionals: "is-even",
  functions: "add-two-numbers",
  "lists-and-loops": "filter-evens",
  "common-patterns": "count-items",
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

function getWarmupHref(track: string, lessonSlug: string) {
  if (track === "sql") {
    const warmupSlug = SQL_LESSON_TO_WARMUP_SLUG[lessonSlug];

    if (warmupSlug) {
      return `/dashboard/${track}/warmup/${warmupSlug}`;
    }
  }

  if (track === "python") {
    const warmupSlug = PYTHON_LESSON_TO_WARMUP_SLUG[lessonSlug];

    if (warmupSlug) {
      return `/dashboard/${track}/warmup/${warmupSlug}`;
    }
  }

  return `/dashboard/${track}/warmup`;
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

  const previousLesson = await getPreviousLesson(
    lesson.track_id,
    lesson.lesson_order
  );

  const nextLesson = await getNextLesson(lesson.track_id, lesson.lesson_order);

  const lessonCount = await getLessonCount(lesson.track_id);
  const warmupHref = getWarmupHref(track, lessonSlug);

  return (
    <div>
      <p>
        <Link href={`/dashboard/${track}`} className="underline">
          Back to {track.toUpperCase()}
        </Link>
      </p>

      <p className="mt-4 text-sm text-gray-500">
        Lesson {lesson.lesson_order} of {lessonCount}
      </p>

      <section className="mt-8">
        <div className="prose max-w-none prose-code:before:content-none prose-code:after:content-none prose-code:font-normal prose-pre:bg-gray-900 prose-pre:text-white prose-pre:rounded prose-pre:px-4 prose-pre:py-3 prose-pre:overflow-x-auto">
          <ReactMarkdown
            components={{
              code({ className, children, ...props }) {
                const isBlock = className?.includes("language-");

                if (isBlock) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }

                return (
                  <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm font-normal">
                    {children}
                  </code>
                );
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </section>

      <section className="mt-10 flex justify-between">
        <div>
          {previousLesson ? (
            <Link
              href={`/dashboard/${track}/crash-course/${previousLesson.slug}`}
              className="underline"
            >
              ← Previous Lesson: {previousLesson.title}
            </Link>
          ) : (
            <span className="text-sm text-gray-400">Beginning of Course</span>
          )}
        </div>

        <div className="text-right">
          {nextLesson ? (
            <Link
              href={`/dashboard/${track}/crash-course/${nextLesson.slug}`}
              className="underline"
            >
              Next Lesson: {nextLesson.title} →
            </Link>
          ) : (
            <span className="font-semibold">Course Complete</span>
          )}
        </div>
      </section>

      <section className="mt-6">
        <Link href={warmupHref} className="underline">
          Try Warmup Practice
        </Link>
      </section>
    </div>
  );
}