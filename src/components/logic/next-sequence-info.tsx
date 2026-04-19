import { useCurrentSettings, useCurrentStatus } from "@/api";
import { jsDayToApiDay } from "@/lib/days";
import { parseHHMM } from "@/lib/time";
import { NextSequence } from "./next-sequence";
import { NoNextSequence } from "./no-next-sequence";

/**
 * Computes the next time a scheduled sequence will start based on the current
 * settings and today's clock. Returns null when nothing is scheduled.
 */
function computeNextSequenceDate(
  startAt: string,
  schedule: boolean[],
): Date | null {
  if (!schedule.some(Boolean)) return null;
  const parsed = parseHHMM(startAt);
  if (!parsed) return null;

  const now = new Date();
  const candidate = new Date(now);
  candidate.setHours(parsed.hours, parsed.minutes, 0, 0);
  if (candidate <= now) {
    candidate.setDate(candidate.getDate() + 1);
  }

  for (let i = 0; i < 7; i++) {
    if (schedule[jsDayToApiDay(candidate.getDay())]) {
      return candidate;
    }
    candidate.setDate(candidate.getDate() + 1);
  }

  return null;
}

/**
 * Displays the next planned sequence start, or "none scheduled" when there
 * isn't one. Used on the status page for auto mode when no sequence is active.
 */
export function NextSequenceInfo() {
  const { data: settings } = useCurrentSettings();
  const { data: status } = useCurrentStatus();

  if (status?.has_active_sequence) {
    return <NoNextSequence />;
  }
  if (!settings) {
    return <p className="text-sm text-muted-foreground">Chargement…</p>;
  }

  const next = computeNextSequenceDate(settings.start_at, settings.schedule);
  if (!next) {
    return <NoNextSequence />;
  }
  return <NextSequence nextSequence={next} />;
}
