export type SqlCheckResult = {
  isCorrect: boolean;
  score: number;
  matched: string[];
  missing: string[];
  forbiddenMatched: string[];
  unexpectedColumns: string[];
};

function normalizeSql(input: string) {
  return input
    .toLowerCase()
    .replace(/;/g, "")
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

    const dedupeKey = normalizeSql(displayValue);

    if (seen.has(dedupeKey)) continue;

    seen.add(dedupeKey);
    result.push(displayValue);
  }

  return result;
}

function extractSelectColumns(sql: string): string[] {
  const match = sql.match(/select (.*?) from/i);

  if (!match) return [];

  return match[1]
    .split(",")
    .map((column) => column.trim())
    .map((column) => column.replace(/.*\./, ""))
    .map((column) => column.replace(/\s+as\s+.+$/i, "").trim())
    .filter(Boolean);
}

type CheckSqlAttemptInput = {
  userAnswer: string;
  expectedIncludes: string[];
  forbiddenIncludes?: string[];
  acceptedPatterns?: string[];
  expectedColumns?: string[];
};

export function checkSqlAttempt({
  userAnswer,
  expectedIncludes,
  forbiddenIncludes = [],
  acceptedPatterns = [],
  expectedColumns = [],
}: CheckSqlAttemptInput): SqlCheckResult {
  const normalized = normalizeSql(userAnswer);

  const dedupedExpectedIncludes = dedupeStrings(expectedIncludes);
  const dedupedForbiddenIncludes = dedupeStrings(forbiddenIncludes);
  const dedupedAcceptedPatterns = dedupeStrings(acceptedPatterns);
  const dedupedExpectedColumns = dedupeStrings(expectedColumns);

  const normalizedAcceptedPatterns = dedupedAcceptedPatterns.map(normalizeSql);

  const exactAccepted =
    normalizedAcceptedPatterns.length > 0 &&
    normalizedAcceptedPatterns.includes(normalized);

  const matched = dedupeStrings(
    dedupedExpectedIncludes.filter((fragment) =>
      normalized.includes(normalizeSql(fragment))
    )
  );

  const missing = dedupeStrings(
    dedupedExpectedIncludes.filter(
      (fragment) => !normalized.includes(normalizeSql(fragment))
    )
  );

  const forbiddenMatched = dedupeStrings(
    dedupedForbiddenIncludes.filter((fragment) =>
      normalized.includes(normalizeSql(fragment))
    )
  );

  const selectedColumns = dedupeStrings(extractSelectColumns(normalized));

  const normalizedExpectedColumns = dedupedExpectedColumns.map((column) =>
    normalizeSql(column)
  );

  const unexpectedColumns =
    normalizedExpectedColumns.length > 0
      ? dedupeStrings(
          selectedColumns.filter(
            (column) =>
              !normalizedExpectedColumns.includes(normalizeSql(column))
          )
        )
      : [];

  const baseScore =
    dedupedExpectedIncludes.length === 0
      ? 0
      : Math.round((matched.length / dedupedExpectedIncludes.length) * 100);

  let score = baseScore;

  if (forbiddenMatched.length > 0) {
    score = Math.max(0, score - forbiddenMatched.length * 25);
  }

  if (unexpectedColumns.length > 0) {
    score = Math.max(0, score - unexpectedColumns.length * 25);
  }

  if (exactAccepted) {
    score = 100;
  }

  const isCorrect =
    (exactAccepted || missing.length === 0) &&
    forbiddenMatched.length === 0 &&
    unexpectedColumns.length === 0;

  return {
    isCorrect,
    score,
    matched,
    missing,
    forbiddenMatched,
    unexpectedColumns,
  };
}