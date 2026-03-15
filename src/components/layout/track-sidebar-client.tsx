"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Track = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
};

type Lesson = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  lesson_order: number;
  track_id: string;
};

type WarmupQuestion = {
  slug: string;
  title: string;
  promptText: string;
  expectedIncludes: string[];
  forbiddenIncludes?: string[];
  acceptedPatterns?: string[];
};

type WarmupProgressMap = Record<
  string,
  {
    bestScore: number;
    isComplete: boolean;
  }
>;

type Props = {
  track: string;
  trackTitle: string;
  lessons: Lesson[];
  warmupQuestions: WarmupQuestion[];
  warmupProgress: WarmupProgressMap;
  otherTracks: Track[];
};

function itemClasses(isActive: boolean) {
  const base = "block rounded px-2 py-1 text-sm";

  return isActive
    ? `${base} border-l-2 border-black bg-gray-100 font-semibold text-black`
    : `${base} text-gray-700 hover:bg-gray-50 hover:underline`;
}

function topLinkClasses(isActive: boolean) {
  return isActive
    ? "block rounded px-2 py-1 font-semibold text-black"
    : "block rounded px-2 py-1 text-gray-700 hover:bg-gray-50 hover:underline";
}

export default function TrackSidebarClient({
  track,
  trackTitle,
  lessons,
  warmupQuestions,
  warmupProgress,
  otherTracks,
}: Props) {
  const pathname = usePathname();

  const trackHref = `/dashboard/${track}`;
  const timedHref = `/dashboard/${track}/timed`;

  return (
    <aside className="w-72 shrink-0 border-r p-6">
      <h2 className="text-lg font-semibold">Quick Code Test Prep</h2>

      <nav className="mt-6 space-y-6">
        <div>
          <Link
            href="/dashboard"
            className={topLinkClasses(pathname === "/dashboard")}
          >
            Dashboard
          </Link>
        </div>

        <div>
          <p className="px-2 text-sm font-semibold text-gray-500">Current Track</p>
          <div className="mt-2">
            <Link
              href={trackHref}
              className={topLinkClasses(pathname === trackHref)}
            >
              {trackTitle}
            </Link>
          </div>
        </div>

        <div>
          <p className="px-2 text-sm font-semibold text-gray-500">Crash Course</p>
          <ul className="mt-2 space-y-1">
            {lessons.map((lesson) => {
              const href = `/dashboard/${track}/crash-course/${lesson.slug}`;
              const isActive = pathname === href;

              return (
                <li key={lesson.id}>
                  <Link href={href} className={itemClasses(isActive)}>
                    {lesson.lesson_order}. {lesson.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="px-2 text-sm font-semibold text-gray-500">Practice Tests</p>

          <div className="mt-2">
            <p className="px-2 text-sm font-semibold text-gray-500">
              Warmup Test
            </p>

            {warmupQuestions.length > 0 && (
              <ul className="mt-2 ml-4 space-y-1">
                {warmupQuestions.map((question, index) => {
                  const href = `/dashboard/${track}/warmup/${question.slug}`;
                  const isActive = pathname === href;
                  const progress = warmupProgress[question.slug];

                  return (
                    <li key={question.slug}>
                      <Link
                        href={href}
                        className={`${itemClasses(
                          isActive
                        )} flex items-center justify-between gap-2`}
                      >
                        <span>
                          {index + 1}. {question.title}
                        </span>

                        {progress && (
                          <span className="text-xs text-gray-500">
                            {progress.isComplete ? "✓" : `${progress.bestScore}%`}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="mt-4">
            <Link
              href={timedHref}
              className={topLinkClasses(pathname === timedHref)}
            >
              Timed Test
            </Link>
          </div>
        </div>

        {otherTracks.length > 0 && (
          <div>
            <p className="px-2 text-sm font-semibold text-gray-500">Other Tracks</p>
            <ul className="mt-2 space-y-1">
              {otherTracks.map((otherTrack) => {
                const href = `/dashboard/${otherTrack.slug}`;
                const isActive = pathname === href;

                return (
                  <li key={otherTrack.id}>
                    <Link href={href} className={itemClasses(isActive)}>
                      {otherTrack.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>
    </aside>
  );
}