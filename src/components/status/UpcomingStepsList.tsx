import { formatClock, formatDuration } from "@/lib/time";
import { relayLabel } from "@/lib/relays";

interface UpcomingStepsListProps {
  /** The currently opened relay index (0..7). */
  openedRelay: number;
  /**
   * Unix timestamp (seconds) when the current relay should close. Used as the
   * anchor for the first upcoming step. When null, we cannot chain durations.
   */
  shouldCloseAt: number | null;
  /** Array of 8 per-relay durations in seconds from settings.sequence. */
  sequence: number[];
}

interface Step {
  relayId: number;
  startAt: Date;
  durationSec: number;
}

function computeSteps(
  openedRelay: number,
  shouldCloseAt: number | null,
  sequence: number[],
): Step[] {
  if (shouldCloseAt == null) return [];
  const steps: Step[] = [];
  let cursor = shouldCloseAt;
  for (let i = openedRelay + 1; i < sequence.length; i++) {
    const dur = sequence[i];
    if (!dur || dur <= 0) continue;
    steps.push({
      relayId: i,
      startAt: new Date(cursor * 1000),
      durationSec: dur,
    });
    cursor += dur;
  }
  return steps;
}

export function UpcomingStepsList({
  openedRelay,
  shouldCloseAt,
  sequence,
}: UpcomingStepsListProps) {
  const steps = computeSteps(openedRelay, shouldCloseAt, sequence);

  if (steps.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Plus aucune étape à venir dans cette séquence.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {steps.map((step) => (
        <li
          key={step.relayId}
          className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm"
        >
          <span className="font-medium">{relayLabel(step.relayId)}</span>
          <span className="text-muted-foreground">
            {formatClock(step.startAt)} · {formatDuration(step.durationSec)}
          </span>
        </li>
      ))}
    </ul>
  );
}
