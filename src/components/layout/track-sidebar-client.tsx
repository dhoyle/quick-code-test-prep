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

type Props = {
  track: string;
  trackTitle: string;
  lessons: Lesson[];
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
  otherTracks,
}: Props) {
  const pathname = usePathname();

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
          <ul className="mt-2 space-y-2">
            <li>
              <Link
                href={`/dashboard/${track}/warmup`}
                className={linkClasses(pathname === `/dashboard/${track}/warmup`)}
              >
                Warmup Test
              </Link>
            </li>
            <li>
              <Link
                href={`/dashboard/${track}/timed`}
                className={linkClasses(pathname === `/dashboard/${track}/timed`)}
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