import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTrackBySlug } from "@/db/tracks";
import { SQL_WARMUP_QUESTIONS } from "@/data/warmup-questions";

type PageProps = {
  params: Promise<{ track: string }>;
};

export default async function WarmupPage({ params }: PageProps) {
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

  const questions = track === "sql" ? SQL_WARMUP_QUESTIONS : [];

  return (
    <div>
      <p>
        <Link href={`/dashboard/${track}`} className="underline">
          Back to {track.toUpperCase()}
        </Link>
      </p>

      <h1 className="mt-4 text-2xl font-bold">{trackData.title} — Warmup Test</h1>

      <p className="mt-2 text-gray-600">
        Untimed practice questions to help you build confidence before a real
        coding test.
      </p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Available Questions</h2>

        <ul className="mt-4 space-y-3">
          {questions.map((question, index) => (
            <li key={question.slug}>
              <Link
                href={`/dashboard/${track}/warmup/${question.slug}`}
                className="block rounded border p-4 hover:bg-gray-50"
              >
                <h3 className="text-lg font-semibold">
                  {index + 1}. {question.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{question.promptText}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}