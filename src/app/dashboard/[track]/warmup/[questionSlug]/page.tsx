import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTrackBySlug } from "@/db/tracks";
import { getRecentAttempts } from "@/db/attempts";
import WarmupQuestion from "@/components/warmup/warmup-question";
import AttemptHistory from "@/components/attempts/attempt-history";
import { SQL_WARMUP_QUESTIONS } from "@/data/warmup-questions";

type PageProps = {
  params: Promise<{
    track: string;
    questionSlug: string;
  }>;
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

  const questions = track === "sql" ? SQL_WARMUP_QUESTIONS : [];
  const questionIndex = questions.findIndex((q) => q.slug === questionSlug);

  if (questionIndex === -1) {
    notFound();
  }

  const question = questions[questionIndex];
  const previousQuestion = questionIndex > 0 ? questions[questionIndex - 1] : null;
  const nextQuestion =
    questionIndex < questions.length - 1 ? questions[questionIndex + 1] : null;

  const attempts = await getRecentAttempts(user.id, trackData.id, questionSlug);

  return (
    <div>
      <p>
        <Link href={`/dashboard/${track}/warmup`} className="underline">
          Back to Warmup
        </Link>
      </p>

      <p className="mt-4 text-sm text-gray-500">
        Question {questionIndex + 1} of {questions.length}
      </p>

      <h1 className="mt-2 text-2xl font-bold">{question.title}</h1>

      <p className="mt-2 text-gray-600">{question.promptText}</p>

      <WarmupQuestion
        track={track}
        questionSlug={questionSlug}
        promptTitle={question.title}
        promptText={question.promptText}
        expectedIncludes={question.expectedIncludes}
        forbiddenIncludes={question.forbiddenIncludes}
        acceptedPatterns={question.acceptedPatterns}
        expectedColumns={question.expectedColumns}
      />

      <AttemptHistory
        attempts={attempts}
        trackSlug={track}
        questionSlug={questionSlug}
      />

      <section className="mt-10 flex justify-between">
        <div>
          {previousQuestion ? (
            <Link
              href={`/dashboard/${track}/warmup/${previousQuestion.slug}`}
              className="underline"
            >
              ← Previous Question: {previousQuestion.title}
            </Link>
          ) : (
            <span className="text-sm text-gray-400">Beginning of warmup</span>
          )}
        </div>

        <div className="text-right">
          {nextQuestion ? (
            <Link
              href={`/dashboard/${track}/warmup/${nextQuestion.slug}`}
              className="underline"
            >
              Next Question: {nextQuestion.title} →
            </Link>
          ) : (
            <span className="font-semibold">Warmup Complete</span>
          )}
        </div>
      </section>
    </div>
  );
}