"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveAttempt } from "@/actions/save-attempt";
import { checkTrackAttempt } from "@/lib/track-checker";
import type { TrackCheckResult, TrackQuestion } from "@/lib/question-types";

type Props = {
  track: string;
  questionSlug: string;
  question: TrackQuestion;
};

function getPlaceholder(track: string) {
  return track === "python"
    ? "Write your Python function here..."
    : "Write your SQL query here...";
}

function getCoachingMessage(
  track: string,
  result: TrackCheckResult
): string | null {
  if (result.unexpectedColumns && result.unexpectedColumns.length > 0) {
    return "Tip: Only return the columns requested in the prompt.";
  }

  if (result.missingParamUsage && result.missingParamUsage.length > 0) {
    return "Tip: Make sure you actually use the function parameters from the prompt in your solution.";
  }

  if (result.forbiddenMatched.length > 0) {
    return track === "python"
      ? "Tip: Avoid disallowed shortcuts and focus on the function structure the prompt is asking for."
      : "Tip: Avoid shortcuts or disallowed elements, and focus on the exact SQL pattern the question is asking for.";
  }

  if (result.missing.length > 0) {
    return track === "python"
      ? "Tip: Re-read the prompt and make sure your function includes the required name, return behavior, and key Python elements."
      : "Tip: Re-read the prompt and make sure your query includes each required SQL clause or condition.";
  }

  if (result.isCorrect) {
    return track === "python"
      ? "Nice work — this answer includes the required Python elements for the prompt."
      : "Nice work — this answer includes the required SQL elements for the prompt.";
  }

  return null;
}

export default function WarmupQuestion({
  track,
  questionSlug,
  question,
}: Props) {
  const router = useRouter();

  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState<TrackCheckResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitted) return;

    setMessage(null);
    setError(null);
    setCheckResult(null);

    startTransition(async () => {
      const resultData = checkTrackAttempt({
        track,
        userAnswer: answer,
        question,
      });

      setCheckResult(resultData);

      const result = await saveAttempt({
        trackSlug: track,
        lessonId: `warmup-${questionSlug}`,
        promptTitle: question.title,
        promptText: question.promptText,
        userAnswer: answer,
        mode: "warmup",
        questionSlug,
        result: resultData,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setMessage("Attempt submitted");
      setIsSubmitted(true);
      router.refresh();
    });
  }

  const coachingMessage = checkResult
    ? getCoachingMessage(track, checkResult)
    : null;

  return (
    <section className="mt-8 rounded border p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <textarea
          className="min-h-[180px] w-full rounded border p-4 font-mono text-base"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={getPlaceholder(track)}
          disabled={isSubmitted}
        />

        <button
          type="submit"
          disabled={isPending || isSubmitted}
          className="inline-flex cursor-pointer items-center justify-center rounded border px-5 py-2.5 text-base font-medium transition hover:bg-gray-100 active:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending
            ? "Submitting..."
            : isSubmitted
              ? "Submitted"
              : "Submit Attempt"}
        </button>
      </form>

      {message && <p className="mt-3 text-green-700">{message}</p>}
      {error && <p className="mt-3 text-red-600">{error}</p>}

      {checkResult && (
        <div className="mt-5 rounded border bg-gray-50 p-5">
          <div className="flex items-center justify-between gap-4">
            <p
              className={
                checkResult.isCorrect
                  ? "font-semibold text-green-700"
                  : "font-semibold text-amber-700"
              }
            >
              {checkResult.isCorrect ? "✅ Correct" : "⚠️ Needs work"}
            </p>

            <p className="text-sm font-medium text-gray-700">
              Score: {checkResult.score}%
            </p>
          </div>

          {checkResult.missing.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700">
                Missing elements
              </p>
              <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                {checkResult.missing.map((item, itemIndex) => (
                  <li key={`missing-${item}-${itemIndex}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {checkResult.missingParamUsage &&
            checkResult.missingParamUsage.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700">
                  Parameter issues
                </p>
                <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                  {checkResult.missingParamUsage.map((param, itemIndex) => (
                    <li key={`param-${param}-${itemIndex}`}>
                      Parameter "{param}" is not used correctly.
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {checkResult.forbiddenMatched.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700">
                Problematic elements
              </p>
              <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                {checkResult.forbiddenMatched.map((item, itemIndex) => (
                  <li key={`forbidden-${item}-${itemIndex}`}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {checkResult.unexpectedColumns &&
            checkResult.unexpectedColumns.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700">
                  Unexpected columns
                </p>
                <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                  {checkResult.unexpectedColumns.map((column, itemIndex) => (
                    <li key={`unexpected-${column}-${itemIndex}`}>{column}</li>
                  ))}
                </ul>
              </div>
            )}

          {coachingMessage && (
            <div className="mt-4 rounded border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm font-medium text-blue-900">
                Coaching tip
              </p>
              <p className="mt-1 text-sm text-blue-800">{coachingMessage}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}