"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { clearAttempts } from "@/actions/clear-attempts";

type Attempt = {
  id: string;
  user_answer: string;
  created_at: string;
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
              <div className="mb-1 text-xs text-gray-500">
                {new Date(attempt.created_at).toLocaleString()}
              </div>

              <pre className="whitespace-pre-wrap font-mono">
                {attempt.user_answer}
              </pre>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}