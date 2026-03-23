import type {
  QuestionDifficulty,
  TrackQuestion,
} from "@/lib/question-types";
import { SQL_WARMUP_QUESTIONS } from "@/data/sql-warmup-questions";
import { PYTHON_WARMUP_QUESTIONS } from "@/data/python-warmup-questions";

export function getWarmupQuestionsForTrack(track: string): TrackQuestion[] {
  switch (track) {
    case "sql":
      return SQL_WARMUP_QUESTIONS;
    case "python":
      return PYTHON_WARMUP_QUESTIONS;
    default:
      return [];
  }
}

export function getQuestionsForTrackAndDifficulty(
  track: string,
  difficulty: QuestionDifficulty
): TrackQuestion[] {
  return getWarmupQuestionsForTrack(track).filter(
    (question) => question.difficulty === difficulty
  );
}

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

export function getTimedQuestionsForTrack(track: string): TrackQuestion[] {
  const questions = getWarmupQuestionsForTrack(track);

  const easy = questions.filter((question) => question.difficulty === "easy");
  const medium = questions.filter(
    (question) => question.difficulty === "medium"
  );
  const hard = questions.filter((question) => question.difficulty === "hard");

  const preferredMix = [
    ...shuffleArray(easy).slice(0, 2),
    ...shuffleArray(medium).slice(0, 2),
    ...shuffleArray(hard).slice(0, 1),
  ];

  if (preferredMix.length >= 5) {
    return preferredMix;
  }

  return shuffleArray(questions);
}

export function getDifficultyLabel(difficulty: QuestionDifficulty) {
  switch (difficulty) {
    case "easy":
      return "Easy";
    case "medium":
      return "Medium";
    case "hard":
      return "Hard";
  }
}

export function getDifficultyClasses(difficulty: QuestionDifficulty) {
  switch (difficulty) {
    case "easy":
      return "rounded bg-green-50 px-2.5 py-1 text-sm font-medium text-green-700";
    case "medium":
      return "rounded bg-blue-50 px-2.5 py-1 text-sm font-medium text-blue-700";
    case "hard":
      return "rounded bg-amber-50 px-2.5 py-1 text-sm font-medium text-amber-700";
  }
}