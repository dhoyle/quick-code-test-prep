"use client";

import TimedTest from "@/components/timed/timed-test";
import type { TrackQuestion } from "@/lib/question-types";

type Props = {
  track: string;
  sessionId: string;
  questions: TrackQuestion[];
  durationSeconds?: number;
  startedAt?: string | null;
};

export default function TimedTestSession(props: Props) {
  return <TimedTest {...props} />;
}