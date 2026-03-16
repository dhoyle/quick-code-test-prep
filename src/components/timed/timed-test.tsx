"use client";

import { useEffect, useMemo, useState } from "react";
import { checkSqlAttempt } from "@/lib/sql-checker";

type TimedQuestion = {
  slug: string;
  title: string;
  promptText: string;
  expectedIncludes: string[];
  forbiddenIncludes?: string[];
  acceptedPatterns?: string[];
  expectedColumns?: string[];
};

type Props = {
  questions: TimedQuestion[];
  durationSeconds?: number;
};

type PerQuestionResult = {
  slug: string;
  title: string;
  score: number;
  isCorrect: boolean;
};

export default function TimedTest({
  questions,
  durationSeconds = 30 * 60,
}: Props) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<PerQuestionResult[]>([]);

  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  useEffect(() => {
    if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isSubmitted]);

  function handleAnswerChange(slug: string, value: string) {
    setAnswers((prev) => ({
      ...prev,
      [slug]: value,
    }));
  }

  function handleSubmit() {
    const graded = questions.map((question) => {
      const answer = answers[question.slug] ?? "";

      const result = checkSqlAttempt({
        userAnswer: answer,
        expectedIncludes: question.expectedIncludes,
        forbiddenIncludes: question.forbiddenIncludes,
        acceptedPatterns: question.acceptedPatterns,
        expectedColumns: question.expectedColumns,
      });

      return {
        slug: question.slug,
        title: question.title,
        score: result.score,
        isCorrect: result.isCorrect,
      };
    });

    setResults(graded);
    setIsSubmitted(true);
  }

  const overallScore = useMemo(() => {
    if (!results.length) return 0;
    const total = results.reduce((sum, result) => sum + result.score, 0);
    return Math.round(total / results.length);
  }, [results]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (isSubmitted) {
    return (
      <section className="mt-8 space-y-6">
        <div className="rounded border bg-gray-50 p-4">
          <h2 className="text-xl font-semibold">Timed Test Results</h2>
          <p className="mt-2 text-gray-700">Overall score: {overallScore}%</p>
        </div>

        <div className="space-y-3">
          {results.map((result, index) => (
            <div key={result.slug} className="rounded border p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">
                  {index + 1}. {result.title}
                </p>
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
          <h2 className="text-xl font-semibold">Timed SQL Test</h2>
          <p className="font-mono text-lg">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </p>
        </div>
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
            <h3 className="mt-1 text-lg font-semibold">{question.title}</h3>
            <p className="mt-2 text-gray-700">{question.promptText}</p>

            <textarea
              className="mt-4 min-h-[140px] w-full rounded border p-3 font-mono text-sm"
              value={answers[question.slug] ?? ""}
              onChange={(e) =>
                handleAnswerChange(question.slug, e.target.value)
              }
              placeholder="Write your SQL query here..."
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="rounded border px-4 py-2"
      >
        Submit Timed Test
      </button>
    </section>
  );
}