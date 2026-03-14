"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveAttempt } from "@/actions/save-attempt";

type Props = {
  track: string;
  questionSlug: string;
  promptTitle: string;
  promptText: string;
};

export default function WarmupQuestion({
  track,
  questionSlug,
  promptTitle,
  promptText,
}: Props) {
  const router = useRouter();

  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await saveAttempt({
        trackSlug: track,
        lessonId: `warmup-${questionSlug}`,
        promptTitle,
        promptText,
        userAnswer: answer,
        mode: "warmup",
        questionSlug,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setMessage("Attempt submitted");
      setAnswer("");
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
    </section>
  );
}