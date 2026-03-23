"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { checkTrackAttempt } from "@/lib/track-checker";
import { saveTimedTest } from "@/actions/save-timed-test";
import type {
  QuestionDifficulty,
  TrackQuestion,
} from "@/lib/question-types";
import {
  getDifficultyClasses,
  getDifficultyLabel,
} from "@/data/question-bank";

type Props = {
  track: string;
  sessionId: string;
  questions: TrackQuestion[];
  durationSeconds?: number;
  startedAt?: string | null;
};

type PerQuestionResult = {
  slug: string;
  title: string;
  promptText: string;
  difficulty: QuestionDifficulty;
  userAnswer: string;
  score: number;
  isCorrect: boolean;
  missing: string[];
  forbiddenMatched: string[];
  unexpectedColumns: string[];
};

function getDraftStorageKey(sessionId: string) {
  return `timed-test-draft:${sessionId}`;
}

function getRemainingSeconds(
  durationSeconds: number,
  startedAt?: string | null
) {
  if (!startedAt) {
    return durationSeconds;
  }

  const startedAtMs = new Date(startedAt).getTime();

  if (Number.isNaN(startedAtMs)) {
    return durationSeconds;
  }

  const elapsedSeconds = Math.floor((Date.now() - startedAtMs) / 1000);
  return Math.max(0, durationSeconds - elapsedSeconds);
}

function getTrackLabel(track: string) {
  return track === "python" ? "Python" : "SQL";
}

function getPlaceholder(track: string) {
  return track === "python"
    ? "Write your Python function here..."
    : "Write your SQL query here...";
}

function getDifficultySummary(questions: TrackQuestion[]) {
  const counts = {
    easy: 0,
    medium: 0,
    hard: 0,
  };

  for (const question of questions) {
    counts[question.difficulty] += 1;
  }

  return [
    counts.easy > 0 ? `${counts.easy} Easy` : null,
    counts.medium > 0 ? `${counts.medium} Medium` : null,
    counts.hard > 0 ? `${counts.hard} Hard` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

export default function TimedTest({
  track,
  sessionId,
  questions,
  durationSeconds = 30 * 60,
  startedAt,
}: Props) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<PerQuestionResult[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [timerInitialized, setTimerInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedDraft = window.localStorage.getItem(
        getDraftStorageKey(sessionId)
      );

      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);

        if (parsed && typeof parsed === "object") {
          setAnswers(parsed as Record<string, string>);
        }
      }
    } catch {
      // Ignore malformed local draft data.
    } finally {
      setDraftLoaded(true);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!draftLoaded || isSubmitted) return;

    try {
      window.localStorage.setItem(
        getDraftStorageKey(sessionId),
        JSON.stringify(answers)
      );
    } catch {
      // Ignore localStorage write failures.
    }
  }, [answers, draftLoaded, isSubmitted, sessionId]);

  useEffect(() => {
    setTimeLeft(getRemainingSeconds(durationSeconds, startedAt));
    setTimerInitialized(true);
  }, [durationSeconds, startedAt]);

  useEffect(() => {
    if (!timerInitialized || isSubmitted || timeLeft <= 0) return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isSubmitted, timeLeft, timerInitialized]);

  useEffect(() => {
    if (!timerInitialized) return;

    if (timeLeft === 0 && !isSubmitted) {
      void handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isSubmitted, timerInitialized]);

  function handleAnswerChange(slug: string, value: string) {
    setAnswers((prev) => ({
      ...prev,
      [slug]: value,
    }));
  }

  async function handleSubmit() {
    const graded = questions.map((question) => {
      const answer = answers[question.slug] ?? "";

      const result = checkTrackAttempt({
        track,
        userAnswer: answer,
        question,
      });

      return {
        slug: question.slug,
        title: question.title,
        promptText: question.promptText,
        difficulty: question.difficulty,
        userAnswer: answer,
        score: result.score,
        isCorrect: result.isCorrect,
        missing: result.missing,
        forbiddenMatched: result.forbiddenMatched,
        unexpectedColumns: result.unexpectedColumns ?? [],
      };
    });

    setResults(graded);
    setIsSubmitted(true);
    setIsSaving(true);
    setSaveMessage(null);

    const saveResult = await saveTimedTest({
      trackSlug: track,
      sessionId,
      questions: graded.map((item) => ({
        slug: item.slug,
        title: item.title,
        promptText: item.promptText,
        userAnswer: item.userAnswer,
        result: {
          isCorrect: item.isCorrect,
          score: item.score,
          missing: item.missing,
          forbiddenMatched: item.forbiddenMatched,
          unexpectedColumns: item.unexpectedColumns,
        },
      })),
    });

    if (saveResult.ok) {
      try {
        window.localStorage.removeItem(getDraftStorageKey(sessionId));
      } catch {
        // Ignore localStorage remove failures.
      }

      setSaveMessage("Timed test saved");
    } else {
      setSaveMessage(saveResult.error ?? "Failed to save timed test");
    }

    setIsSaving(false);
  }

  const overallScore = useMemo(() => {
    if (!results.length) return 0;
    const total = results.reduce((sum, result) => sum + result.score, 0);
    return Math.round(total / results.length);
  }, [results]);

  const difficultySummary = useMemo(
    () => getDifficultySummary(questions),
    [questions]
  );

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (isSubmitted) {
    return (
      <section className="mt-8 space-y-6">
        <div className="rounded border bg-gray-50 p-4">
          <h2 className="text-xl font-semibold">Timed Test Results</h2>
          <p className="mt-2 text-gray-700">Overall score: {overallScore}%</p>

          {saveMessage && (
            <p className="mt-2 text-sm text-gray-600">
              {isSaving ? "Saving..." : saveMessage}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={result.slug} className="rounded border p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <p className="font-medium">
                    {index + 1}. {result.title}
                  </p>
                  <span className={getDifficultyClasses(result.difficulty)}>
                    {getDifficultyLabel(result.difficulty)}
                  </span>
                </div>

                <p
                  className={
                    result.isCorrect
                      ? "font-semibold text-green-700"
                      : "font-semibold text-amber-700"
                  }
                >
                  {result.isCorrect ? "Correct" : "Needs work"} — {result.score}%
                </p>
              </div>

              <div className="prose mt-3 max-w-none prose-p:my-0 prose-code:before:content-none prose-code:after:content-none prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:font-normal prose-code:text-[1em]">
                <ReactMarkdown>{result.promptText}</ReactMarkdown>
              </div>

              <pre className="mt-3 whitespace-pre-wrap rounded bg-gray-50 p-3 font-mono text-sm">
                {result.userAnswer || "(No answer submitted)"}
              </pre>

              {result.missing.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700">
                    Missing elements
                  </p>
                  <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                    {result.missing.map((item, itemIndex) => (
                      <li key={`${result.slug}-missing-${item}-${itemIndex}`}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.forbiddenMatched.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700">
                    Problematic elements
                  </p>
                  <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                    {result.forbiddenMatched.map((item, itemIndex) => (
                      <li
                        key={`${result.slug}-forbidden-${item}-${itemIndex}`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.unexpectedColumns.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700">
                    Unexpected columns
                  </p>
                  <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                    {result.unexpectedColumns.map((item, itemIndex) => (
                      <li
                        key={`${result.slug}-unexpected-${item}-${itemIndex}`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 space-y-6">
      <div className="sticky top-0 z-10 rounded border bg-white p-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">
            Timed {getTrackLabel(track)} Test
          </h2>
          <p className="font-mono text-lg" suppressHydrationWarning>
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </p>
        </div>

        {difficultySummary && (
          <p className="mt-2 text-sm font-medium text-gray-700">
            This test includes: {difficultySummary}
          </p>
        )}

        <p className="mt-2 text-sm text-gray-600">
          Answer all questions before time runs out. The test will auto-submit at
          00:00.
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.slug} className="rounded border p-4">
            <p className="text-sm text-gray-500">
              Question {index + 1} of {questions.length}
            </p>

            <div className="mt-1 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold">{question.title}</h3>
              <span className={getDifficultyClasses(question.difficulty)}>
                {getDifficultyLabel(question.difficulty)}
              </span>
            </div>

            <div className="prose mt-3 max-w-none prose-p:my-0 prose-code:before:content-none prose-code:after:content-none prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:font-normal prose-code:text-[1em]">
              <ReactMarkdown>{question.promptText}</ReactMarkdown>
            </div>

            <textarea
              className="mt-4 min-h-[140px] w-full rounded border p-3 font-mono text-sm"
              value={answers[question.slug] ?? ""}
              onChange={(e) =>
                handleAnswerChange(question.slug, e.target.value)
              }
              placeholder={getPlaceholder(track)}
            />

            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => handleAnswerChange(question.slug, "")}
                className="rounded border bg-white px-3 py-1.5 text-sm font-medium transition hover:bg-gray-100 active:bg-gray-200"
              >
                Clear
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => void handleSubmit()}
        className="inline-flex cursor-pointer items-center justify-center rounded border bg-white px-5 py-2.5 text-base font-medium transition hover:bg-gray-100 active:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit Timed Test
      </button>
    </section>
  );
}