import Link from "next/link";
import { getTrackBySlug, getTracks } from "@/db/tracks";
import { getLessonsByTrackSlug } from "@/db/lessons";

type Props = {
  track: string;
};

export default async function TrackSidebar({ track }: Props) {
  const trackData = await getTrackBySlug(track);
  const lessons = await getLessonsByTrackSlug(track);
  const allTracks = await getTracks();

  if (!trackData) {
    return (
      <aside className="w-72 shrink-0 border-r p-6">
        <p className="text-sm text-gray-500">Track not found.</p>
      </aside>
    );
  }

  const otherTracks = allTracks.filter((t) => t.slug !== track);

  return (
    <aside className="w-72 shrink-0 border-r p-6">
      <h2 className="text-lg font-semibold">Quick Code Test Prep</h2>

      <nav className="mt-6 space-y-6">
        <div>
          <Link href="/dashboard" className="underline">
            Dashboard
          </Link>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-500">Current Track</p>
          <div className="mt-2">
            <Link href={`/dashboard/${track}`} className="underline">
              {trackData.title}
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-500">Crash Course</p>
          <ul className="mt-2 space-y-2">
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <Link
                  href={`/dashboard/${track}/crash-course/${lesson.slug}`}
                  className="block text-sm underline"
                >
                  {lesson.lesson_order}. {lesson.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-500">Practice Tests</p>
          <ul className="mt-2 space-y-2">
            <li>
              <Link
                href={`/dashboard/${track}/warmup`}
                className="block text-sm underline"
              >
                Warmup Test
              </Link>
            </li>
            <li>
              <Link
                href={`/dashboard/${track}/timed`}
                className="block text-sm underline"
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
              {otherTracks.map((otherTrack) => (
                <li key={otherTrack.id}>
                  <Link
                    href={`/dashboard/${otherTrack.slug}`}
                    className="block text-sm underline"
                  >
                    {otherTrack.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </aside>
  );
}