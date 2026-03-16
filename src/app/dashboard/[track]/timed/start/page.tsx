import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTrackBySlug } from "@/db/tracks";
import { SQL_WARMUP_QUESTIONS } from "@/data/warmup-questions";
import TimedTest from "@/components/timed/timed-test";

type PageProps = {
  params: Promise<{ track: string }>;
};

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

export default async function TimedStartPage({ params }: PageProps) {
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

  const questions =
    track === "sql" ? shuffleArray(SQL_WARMUP_QUESTIONS).slice(0, 5) : [];

  return (
    <div>
      <p>
        <Link href={`/dashboard/${track}/timed`} className="underline">
          Back to Timed Test
        </Link>
      </p>

      <h1 className="mt-4 text-2xl font-bold">{trackData.title} — Timed Test</h1>

      <TimedTest track={track} questions={questions} />
    </div>
  );
}