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

function getVariableConsistencyMissing(question: PythonQuestion, normalized: string) {
  const missing: string[] = [];

  switch (question.slug) {
    case "add-two-numbers":
      if (!normalized.includes("a") || !normalized.includes("b")) {
        missing.push("use parameters a and b in the returned expression");
      }
      break;

    case "is-even":
      if (!normalized.includes("n % 2")) {
        missing.push("use parameter n in the even check");
      }
      break;

    case "first-item":
      if (!normalized.includes("items[0]")) {
        missing.push("return items[0]");
      }
      break;

    case "reverse-string":
      if (!normalized.includes("text")) {
        missing.push("use parameter text");
      }
      break;

    case "contains-value":
      if (!normalized.includes("target in items")) {
        missing.push("check whether target is in items");
      }
      break;

    default:
      break;
  }

  return missing;
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
    ...getVariableConsistencyMissing(question, normalized),
  ]);

  const forbiddenMatched = dedupeStrings(
    forbiddenTokens.filter((token) =>
      normalized.includes(normalizePython(token))
    )
  );

  const totalExpectedCount =
    requiredTokens.length +
    (expectedFunctionName ? 1 : 0) +
    getVariableConsistencyMissing(question, normalized).length;

  const baseScore =
    totalExpectedCount === 0
      ? 0
      : Math.round(
          (Math.max(0, totalExpectedCount - missing.length) / totalExpectedCount) *
            100
        );

  let score = baseScore;

  if (forbiddenMatched.length > 0) {
    score = Math.max(0, score - forbiddenMatched.length * 25);
  }

  if (exactAccepted) {
    score = 100;
  }

  const isCorrect =
    exactAccepted || (missing.length === 0 && forbiddenMatched.length === 0);

  return {
    isCorrect,
    score,
    matched,
    missing,
    forbiddenMatched,
    unexpectedColumns: [],
  };
}