"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { clearTimedHistory } from "@/actions/clear-timed-history";

type Props = {
  track: string;
};

export default function ClearTimedHistoryButton({ track }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const confirmed = window.confirm(
      "Clear all timed test history for this track? This cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await clearTimedHistory(track);

      if (!result.ok) {
        setError(result.error ?? "Failed to clear timed history.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex cursor-pointer items-center justify-center rounded border px-5 py-2.5 text-base font-medium text-red-700 transition hover:bg-red-50 active:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Clearing..." : "Clear Timed Test History"}
      </button>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}