import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTrackBySlug } from "@/db/tracks";
import { getRecentAttempts } from "@/db/attempts";
import WarmupQuestion from "@/components/warmup/warmup-question";
import AttemptHistory from "@/components/attempts/attempt-history";

type PageProps = {
  params: Promise<{
    track: string;
    questionSlug: string;
  }>;
};

const WARMUP_QUESTIONS: Record<
  string,
  {
    title: string;
    promptText: string;
    nextQuestionSlug: string | null;
  }
> = {
  "basic-select": {
    title: "Basic SELECT",
    promptText:
      "Write a SQL query that returns the name and age columns from the users table.",
    nextQuestionSlug: null,
  },
};

export default async function WarmupQuestionPage({ params }: PageProps) {
  const { track, questionSlug } = await params;

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

  const question = WARMUP_QUESTIONS[questionSlug];

  if (!question) {
    notFound();
  }

  const attempts = await getRecentAttempts(user.id, trackData.id, questionSlug);

  return (
    <main className="p-8">
      <p>
        <Link href={`/dashboard/${track}/warmup`} className="underline">
          Back to Warmup
        </Link>
      </p>

      <h1 className="mt-4 text-2xl font-bold">{question.title}</h1>

      <p className="mt-2 text-gray-600">{question.promptText}</p>

      <WarmupQuestion
        track={track}
        questionSlug={questionSlug}
        promptTitle={question.title}
        promptText={question.promptText}
      />

      <AttemptHistory attempts={attempts} />

      <section className="mt-10 space-y-3">
        {question.nextQuestionSlug ? (
          <Link
            href={`/dashboard/${track}/warmup/${question.nextQuestionSlug}`}
            className="block underline"
          >
            Next Question
          </Link>
        ) : (
          <p className="font-semibold">Warmup Question Complete</p>
        )}

        <Link
          href={`/dashboard/${track}/warmup`}
          className="block underline"
        >
          Back to Warmup
        </Link>
      </section>
    </main>
  );
}