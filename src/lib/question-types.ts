export type QuestionDifficulty = "easy" | "medium" | "hard";

export type BaseQuestion = {
  slug: string;
  title: string;
  promptText: string;
  difficulty: QuestionDifficulty;
};

export type SqlQuestion = BaseQuestion & {
  track: "sql";
  expectedIncludes: string[];
  forbiddenIncludes?: string[];
  acceptedPatterns?: string[];
  expectedColumns?: string[];
};

export type PythonQuestion = BaseQuestion & {
  track: "python";
  expectedFunctionName?: string;
  requiredTokens?: string[];
  forbiddenTokens?: string[];
  acceptedPatterns?: string[];
};

export type TrackQuestion = SqlQuestion | PythonQuestion;

export type TrackCheckResult = {
  isCorrect: boolean;
  score: number;
  matched: string[];
  missing: string[];
  forbiddenMatched: string[];
  unexpectedColumns?: string[];
  missingParamUsage?: string[];
};