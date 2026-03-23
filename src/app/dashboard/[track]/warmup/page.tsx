import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTrackBySlug } from "@/db/tracks";
import {
  getDifficultyClasses,
  getDifficultyLabel,
  getWarmupQuestionsForTrack,
} from "@/data/question-bank";

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

  const questions = getWarmupQuestionsForTrack(track);

  return (
    <div>
      <p>
        <Link href={`/dashboard/${track}`} className="underline">
          Back to {track.toUpperCase()}
        </Link>
      </p>

      <h1 className="mt-4 text-2xl font-bold">
        {trackData.title} — Warmup Tests
      </h1>

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
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold">
                    {index + 1}. {question.title}
                  </h3>

                  <span className={getDifficultyClasses(question.difficulty)}>
                    {getDifficultyLabel(question.difficulty)}
                  </span>
                </div>

                <div className="prose mt-2 max-w-none prose-p:my-0 prose-code:before:content-none prose-code:after:content-none prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:font-normal prose-code:text-[1em]">
                  <ReactMarkdown>{question.promptText}</ReactMarkdown>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}