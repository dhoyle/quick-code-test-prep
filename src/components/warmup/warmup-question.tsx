"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveAttempt } from "@/actions/save-attempt";
import { checkSqlAttempt, SqlCheckResult } from "@/lib/sql-checker";

type Props = {
  track: string;
  questionSlug: string;
  promptTitle: string;
  promptText: string;
  expectedIncludes: string[];
  forbiddenIncludes?: string[];
  acceptedPatterns?: string[];
  expectedColumns?: string[];
};

function getCoachingMessage(result: SqlCheckResult): string | null {
  if (result.unexpectedColumns.length > 0) {
    return "Tip: Only return the columns requested in the prompt.";
  }

  if (result.forbiddenMatched.length > 0) {
    return "Tip: Avoid shortcuts or disallowed elements, and focus on the exact pattern the question is asking for.";
  }

  if (result.missing.length > 0) {
    return "Tip: Re-read the prompt and make sure your solution includes each required element.";
  }

  if (result.isCorrect) {
    return "Nice work — this answer includes the required elements.";
  }

  return null;
}

export default function WarmupQuestion({
  track,
  questionSlug,
  promptTitle,
  promptText,
  expectedIncludes,
  forbiddenIncludes,
  acceptedPatterns,
  expectedColumns,
}: Props) {
  const router = useRouter();

  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState<SqlCheckResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitted) return;

    setMessage(null);
    setError(null);
    setCheckResult(null);

    startTransition(async () => {
      const resultData = checkSqlAttempt({
        userAnswer: answer,
        expectedIncludes,
        forbiddenIncludes,
        acceptedPatterns,
        expectedColumns,
      });

      setCheckResult(resultData);

      const result = await saveAttempt({
        trackSlug: track,
        lessonId: `warmup-${questionSlug}`,
        promptTitle,
        promptText,
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

  const coachingMessage = checkResult ? getCoachingMessage(checkResult) : null;

  return (
    <section className="mt-8 rounded border p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <textarea
          className="min-h-[180px] w-full rounded border p-4 font-mono text-base"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your answer here..."
          disabled={isSubmitted}
        />

        <button
          type="submit"
          disabled={isPending || isSubmitted}
          className="inline-flex items-center justify-center rounded border px-5 py-2.5 text-base font-medium transition cursor-pointer hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="flex items-center justify-between">
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

          {coachingMessage && (
            <div className="mt-4 rounded border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm font-medium text-blue-900">Coaching tip</p>
              <p className="mt-1 text-sm text-blue-800">
                {coachingMessage}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}