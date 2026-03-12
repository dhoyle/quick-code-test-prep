"use client";

import { useState } from "react";

type Attempt = {
  id: string;
  user_answer: string;
  created_at: string;
};

type Props = {
  attempts: Attempt[];
};

export default function AttemptHistory({ attempts }: Props) {
  const [open, setOpen] = useState(false);

  if (!attempts.length) {
    return null;
  }

  return (
    <section className="mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="underline"
      >
        {open
          ? "Hide Previous Attempts"
          : `View Previous Attempts (${attempts.length})`}
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          {attempts.map((attempt) => (
            <div
              key={attempt.id}
              className="rounded border p-3 text-sm"
            >
              <div className="text-xs text-gray-500 mb-1">
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