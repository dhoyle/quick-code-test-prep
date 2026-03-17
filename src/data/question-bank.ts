import type { TrackQuestion } from "@/lib/question-types";
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

export function getTimedQuestionsForTrack(track: string): TrackQuestion[] {
  return getWarmupQuestionsForTrack(track);
}