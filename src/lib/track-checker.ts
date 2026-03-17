import type {
  PythonQuestion,
  TrackCheckResult,
  TrackQuestion,
} from "@/lib/question-types";
import { checkSqlAttempt } from "@/lib/sql-checker";
import { checkPythonAttempt } from "@/lib/python-checker";

type CheckTrackAttemptInput = {
  track: string;
  userAnswer: string;
  question: TrackQuestion;
};

export function checkTrackAttempt({
  track,
  userAnswer,
  question,
}: CheckTrackAttemptInput): TrackCheckResult {
  if (track === "sql" && question.track === "sql") {
    return checkSqlAttempt({
      userAnswer,
      expectedIncludes: question.expectedIncludes,
      forbiddenIncludes: question.forbiddenIncludes,
      acceptedPatterns: question.acceptedPatterns,
      expectedColumns: question.expectedColumns,
    });
  }

  if (track === "python" && question.track === "python") {
    return checkPythonAttempt({
      userAnswer,
      question: question as PythonQuestion,
    });
  }

  return {
    isCorrect: false,
    score: 0,
    matched: [],
    missing: ["Track and question type do not match."],
    forbiddenMatched: [],
    unexpectedColumns: [],
  };
}