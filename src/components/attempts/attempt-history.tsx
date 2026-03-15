"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { clearAttempts } from "@/actions/clear-attempts";

type AttemptResult = {
  isCorrect?: boolean;
  score?: number;
  matched?: string[];
  missing?: string[];
};

type Attempt = {
  id: string;
  user_answer: string;
  created_at: string;
  result: AttemptResult | null;
};

type Props = {
  attempts: Attempt[];
  trackSlug: string;
  questionSlug: string;
};

export default function AttemptHistory({
  attempts,
  trackSlug,
  questionSlug,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!attempts.length) {
    return null;
  }

  function handleClear() {
    if (!confirm("Clear all attempts for this question?")) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await clearAttempts({
        trackSlug,
        questionSlug,
      });

      if (!result.ok) {
        setError(result.error ?? "Failed to clear attempts.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <section className="mt-6">
      <button onClick={() => setOpen(!open)} className="underline">
        {open
          ? "Hide Previous Attempts"
          : `View Previous Attempts (${attempts.length})`}
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          <button
            onClick={handleClear}
            disabled={isPending}
            className="text-sm text-red-600 underline"
          >
            {isPending ? "Clearing..." : "Clear Previous Attempts"}
          </button>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {attempts.map((attempt) => (
            <div key={attempt.id} className="rounded border p-3 text-sm">
              <div className="mb-2 flex items-center justify-between gap-4">
                <div className="text-xs text-gray-500">
                  {new Date(attempt.created_at).toLocaleString()}
                </div>

                {attempt.result && (
                  <div className="text-xs">
                    <span
                      className={
                        attempt.result.isCorrect
                          ? "font-semibold text-green-700"
                          : "font-semibold text-amber-700"
                      }
                    >
                      {attempt.result.isCorrect ? "Correct" : "Needs work"}
                    </span>
                    {typeof attempt.result.score === "number" && (
                      <span className="ml-2 text-gray-600">
                        {attempt.result.score}%
                      </span>
                    )}
                  </div>
                )}
              </div>

              <pre className="whitespace-pre-wrap font-mono">
                {attempt.user_answer}
              </pre>

              {attempt.result?.missing && attempt.result.missing.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-700">
                    Missing elements:
                  </p>
                  <ul className="mt-1 list-disc pl-5 text-xs text-gray-600">
                    {attempt.result.missing.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}