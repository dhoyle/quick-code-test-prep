export type SqlCheckResult = {
  isCorrect: boolean;
  score: number;
  matched: string[];
  missing: string[];
};

function normalizeSql(input: string) {
  return input.toLowerCase().replace(/\s+/g, " ").trim();
}

export function checkSqlAttempt(
  userAnswer: string,
  expectedIncludes: string[]
): SqlCheckResult {
  const normalized = normalizeSql(userAnswer);

  const matched = expectedIncludes.filter((fragment) =>
    normalized.includes(normalizeSql(fragment))
  );

  const missing = expectedIncludes.filter(
    (fragment) => !normalized.includes(normalizeSql(fragment))
  );

  const score =
    expectedIncludes.length === 0
      ? 0
      : Math.round((matched.length / expectedIncludes.length) * 100);

  return {
    isCorrect: missing.length === 0,
    score,
    matched,
    missing,
  };
}