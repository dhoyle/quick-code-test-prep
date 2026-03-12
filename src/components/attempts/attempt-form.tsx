"use client";

import { useState, useTransition } from "react";
import { saveAttempt } from "@/app/dashboard/[track]/crash-course/[lessonSlug]/actions";

type AttemptFormProps = {
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
}: AttemptFormProps) {
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
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setMessage("Attempt saved.");
      setUserAnswer("");
    });
  }

  return (
    <section className="mt-10 rounded border p-4">
      <h2 className="text-xl font-semibold">Your response</h2>
      <p className="mt-2 text-sm text-gray-600">
        For now, this just saves your response to the database.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <textarea
          className="min-h-[180px] w-full rounded border p-3 text-sm"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your answer here..."
        />

        <button
          type="submit"
          disabled={isPending}
          className="rounded border px-4 py-2"
        >
          {isPending ? "Saving..." : "Save Attempt"}
        </button>
      </form>

      {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </section>
  );
}