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
};

type Props = {
  track: string;
  trackTitle: string;
  lessons: Lesson[];
  warmupQuestions: WarmupQuestion[];
  otherTracks: Track[];
};

function linkClasses(isActive: boolean) {
  return isActive
    ? "block text-sm font-semibold text-black"
    : "block text-sm text-gray-700 hover:underline";
}

export default function TrackSidebarClient({
  track,
  trackTitle,
  lessons,
  warmupQuestions,
  otherTracks,
}: Props) {
  const pathname = usePathname();

  const warmupMainHref = `/dashboard/${track}/warmup`;
  const timedHref = `/dashboard/${track}/timed`;

  return (
    <aside className="w-72 shrink-0 border-r p-6">
      <h2 className="text-lg font-semibold">Quick Code Test Prep</h2>

      <nav className="mt-6 space-y-6">
        <div>
          <Link
            href="/dashboard"
            className={pathname === "/dashboard" ? "font-semibold" : "underline"}
          >
            Dashboard
          </Link>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-500">Current Track</p>
          <div className="mt-2">
            <Link
              href={`/dashboard/${track}`}
              className={
                pathname === `/dashboard/${track}` ? "font-semibold" : "underline"
              }
            >
              {trackTitle}
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-500">Crash Course</p>
          <ul className="mt-2 space-y-2">
            {lessons.map((lesson) => {
              const href = `/dashboard/${track}/crash-course/${lesson.slug}`;
              const isActive = pathname === href;

              return (
                <li key={lesson.id}>
                  <Link href={href} className={linkClasses(isActive)}>
                    {lesson.lesson_order}. {lesson.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-500">Practice Tests</p>

          <div className="mt-2">
            <Link
              href={warmupMainHref}
              className={linkClasses(
                pathname === warmupMainHref ||
                  pathname.startsWith(`${warmupMainHref}/`)
              )}
            >
              Warmup Test
            </Link>

            {warmupQuestions.length > 0 && (
              <ul className="mt-2 ml-4 space-y-2">
                {warmupQuestions.map((question, index) => {
                  const href = `/dashboard/${track}/warmup/${question.slug}`;
                  const isActive = pathname === href;

                  return (
                    <li key={question.slug}>
                      <Link href={href} className={linkClasses(isActive)}>
                        {index + 1}. {question.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href={timedHref}
                className={linkClasses(pathname === timedHref)}
              >
                Timed Test
              </Link>
            </li>
          </ul>
        </div>

        {otherTracks.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-500">Other Tracks</p>
            <ul className="mt-2 space-y-2">
              {otherTracks.map((otherTrack) => {
                const href = `/dashboard/${otherTrack.slug}`;
                const isActive = pathname === href;

                return (
                  <li key={otherTrack.id}>
                    <Link href={href} className={linkClasses(isActive)}>
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