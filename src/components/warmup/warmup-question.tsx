"use client";

import { useState, useTransition } from "react";
import { saveAttempt } from "@/app/dashboard/[track]/crash-course/[lessonSlug]/actions";

type Props = {
  track: string;
};

export default function WarmupQuestion({ track }: Props) {
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const questionSlug = "basic-select";
  const promptTitle = "Basic SELECT";
  const promptText =
    "Write a SQL query that returns the name and age columns from the users table.";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await saveAttempt({
        trackSlug: track,
        lessonId: "warmup-basic-select",
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
    });
  }

  return (
    <section className="mt-8 rounded border p-4">
      <h2 className="text-xl font-semibold">{promptTitle}</h2>

      <p className="mt-2 text-gray-700">{promptText}</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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