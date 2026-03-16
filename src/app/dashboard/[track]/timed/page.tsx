import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTrackBySlug } from "@/db/tracks";
import { SQL_TIMED_QUESTIONS } from "@/data/timed-questions";
import TimedTest from "@/components/timed/timed-test";

type PageProps = {
  params: Promise<{ track: string }>;
};

export default async function TimedPage({ params }: PageProps) {
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

  const questions = track === "sql" ? SQL_TIMED_QUESTIONS : [];

  return (
    <div>
      <p>
        <Link href={`/dashboard/${track}`} className="underline">
          Back to {track.toUpperCase()}
        </Link>
      </p>

      <h1 className="mt-4 text-2xl font-bold">{trackData.title} — Timed Test</h1>

      <p className="mt-2 text-gray-600">
        Complete these questions under time pressure to simulate a coding test.
      </p>

      <TimedTest questions={questions} />
    </div>
  );
}