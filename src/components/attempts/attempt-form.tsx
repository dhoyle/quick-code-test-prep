"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveAttempt } from "@/actions/save-attempt";

type Props = {
  trackSlug: string;
  lessonId: string;
  promptTitle: string;
  promptText: string;
};

export default function AttemptForm({
  trackSlug,
  lessonId,
  promptTitle,
  promptText,
}: Props) {
  const router = useRouter();

  const [userAnswer, setUserAnswer] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await saveAttempt({
        trackSlug,
        lessonId,
        promptTitle,
        promptText,
        userAnswer,
        mode: "lesson",
        questionSlug: lessonId,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setMessage("Attempt submitted");
      setUserAnswer("");
      router.refresh();
    });
  }

  return (
    <section className="mt-8 rounded border p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="min-h-[160px] w-full rounded border p-3 font-mono text-sm"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Write your answer here..."
          disabled={isPending}
        />

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex cursor-pointer items-center justify-center rounded border px-4 py-2 text-sm font-medium transition hover:bg-gray-100 active:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Submitting..." : "Submit Attempt"}
        </button>
      </form>

      {message && <p className="mt-3 text-green-700">{message}</p>}
      {error && <p className="mt-3 text-red-600">{error}</p>}
    </section>
  );
}