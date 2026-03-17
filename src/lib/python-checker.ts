import type { PythonQuestion, TrackCheckResult } from "@/lib/question-types";

function normalizePython(input: string) {
  return input
    .toLowerCase()
    .replace(/\r\n/g, "\n")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeDisplayValue(input: string) {
  return input.trim().replace(/\s+/g, " ");
}

function dedupeStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const displayValue = normalizeDisplayValue(value);

    if (!displayValue) continue;

    const dedupeKey = normalizePython(displayValue);

    if (seen.has(dedupeKey)) continue;

    seen.add(dedupeKey);
    result.push(displayValue);
  }

  return result;
}

type CheckPythonAttemptInput = {
  userAnswer: string;
  question: PythonQuestion;
};

export function checkPythonAttempt({
  userAnswer,
  question,
}: CheckPythonAttemptInput): TrackCheckResult {
  const normalized = normalizePython(userAnswer);

  const expectedFunctionName = question.expectedFunctionName?.trim() ?? "";
  const requiredTokens = dedupeStrings(question.requiredTokens ?? []);
  const forbiddenTokens = dedupeStrings(question.forbiddenTokens ?? []);
  const acceptedPatterns = dedupeStrings(question.acceptedPatterns ?? []);

  const normalizedAcceptedPatterns = acceptedPatterns.map(normalizePython);

  const exactAccepted =
    normalizedAcceptedPatterns.length > 0 &&
    normalizedAcceptedPatterns.includes(normalized);

  const functionNameMatched = expectedFunctionName
    ? normalized.includes(normalizePython(`def ${expectedFunctionName}`))
    : true;

  const matched = dedupeStrings([
    ...(functionNameMatched && expectedFunctionName
      ? [`def ${expectedFunctionName}`]
      : []),
    ...requiredTokens.filter((token) =>
      normalized.includes(normalizePython(token))
    ),
  ]);

  const missing = dedupeStrings([
    ...(!functionNameMatched && expectedFunctionName
      ? [`def ${expectedFunctionName}`]
      : []),
    ...requiredTokens.filter(
      (token) => !normalized.includes(normalizePython(token))
    ),
  ]);

  const forbiddenMatched = dedupeStrings(
    forbiddenTokens.filter((token) =>
      normalized.includes(normalizePython(token))
    )
  );

  const totalExpectedCount =
    requiredTokens.length + (expectedFunctionName ? 1 : 0);

  const baseScore =
    totalExpectedCount === 0
      ? 0
      : Math.round((matched.length / totalExpectedCount) * 100);

  let score = baseScore;

  if (forbiddenMatched.length > 0) {
    score = Math.max(0, score - forbiddenMatched.length * 25);
  }

  if (exactAccepted) {
    score = 100;
  }

  const isCorrect =
    (exactAccepted || missing.length === 0) && forbiddenMatched.length === 0;

  return {
    isCorrect,
    score,
    matched,
    missing,
    forbiddenMatched,
    unexpectedColumns: [],
  };
}