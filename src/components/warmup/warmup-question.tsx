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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
      router.refresh();
    });
  }

  return (
    <section className="mt-8 rounded border p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="min-h-[160px] w-full rounded border p-3 font-mono text-sm"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your SQL query here..."
        />

        <button
          type="submit"
          disabled={isPending}
          className="rounded border px-4 py-2"
        >
          {isPending ? "Submitting..." : "Submit Attempt"}
        </button>
      </form>

      {message && <p className="mt-3 text-green-700">{message}</p>}
      {error && <p className="mt-3 text-red-600">{error}</p>}

      {checkResult && (
        <div className="mt-4 rounded border bg-gray-50 p-4">
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
                {checkResult.missing.map((item) => (
                  <li key={item}>{item}</li>
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
                {checkResult.forbiddenMatched.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {checkResult.unexpectedColumns.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700">
                Unexpected columns
              </p>
              <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                {checkResult.unexpectedColumns.map((column) => (
                  <li key={column}>{column}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}