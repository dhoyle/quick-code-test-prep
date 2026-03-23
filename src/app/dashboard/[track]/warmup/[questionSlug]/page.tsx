import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/server";
import { getTrackBySlug } from "@/db/tracks";
import { getRecentAttempts } from "@/db/attempts";
import WarmupQuestion from "@/components/warmup/warmup-question";
import AttemptHistory from "@/components/attempts/attempt-history";
import {
  getDifficultyClasses,
  getDifficultyLabel,
  getWarmupQuestionsForTrack,
} from "@/data/question-bank";

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

  const questions = getWarmupQuestionsForTrack(track);
  const questionIndex = questions.findIndex((q) => q.slug === questionSlug);

  if (questionIndex === -1) {
    notFound();
  }

  const question = questions[questionIndex];
  const previousQuestion =
    questionIndex > 0 ? questions[questionIndex - 1] : null;
  const nextQuestion =
    questionIndex < questions.length - 1 ? questions[questionIndex + 1] : null;

  const attempts = await getRecentAttempts(user.id, trackData.id, questionSlug);

  return (
    <div>
      <p>
        <Link href={`/dashboard/${track}/warmup`} className="underline">
          Back to Warmup Tests
        </Link>
      </p>

      <p className="mt-4 text-sm text-gray-500">
        Question {questionIndex + 1} of {questions.length}
      </p>

      <div className="mt-2 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{question.title}</h1>

        <span className={getDifficultyClasses(question.difficulty)}>
          {getDifficultyLabel(question.difficulty)}
        </span>
      </div>

      <div className="prose mt-3 max-w-none prose-p:my-0 prose-code:before:content-none prose-code:after:content-none prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:font-normal prose-code:text-[1em]">
        <ReactMarkdown>{question.promptText}</ReactMarkdown>
      </div>

      <WarmupQuestion
        track={track}
        questionSlug={questionSlug}
        question={question}
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