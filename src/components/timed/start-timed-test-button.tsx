"use client";

import { useRouter } from "next/navigation";
import { startTimedTest } from "@/actions/start-timed-test";
import { useState, useTransition } from "react";

type Props = {
  track: string;
  activeSessionId: string | null;
};

export default function StartTimedTestButton({
  track,
  activeSessionId,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);

    startTransition(async () => {
      if (activeSessionId) {
        router.push(`/dashboard/${track}/timed/start/${activeSessionId}`);
        return;
      }

      const result = await startTimedTest(track);

      if (!result.ok || !result.sessionId) {
        setError(result.error ?? "Failed to start timed test.");
        return;
      }

      router.push(`/dashboard/${track}/timed/start/${result.sessionId}`);
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex items-center justify-center rounded border px-5 py-2.5 text-base font-medium transition cursor-pointer hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending
          ? "Starting..."
          : activeSessionId
            ? "Resume Timed Test"
            : "Start Timed Test"}
      </button>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}