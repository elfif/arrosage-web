import { Button } from "@/components/ui/button";
import { formatClock, formatDuration } from "@/lib/time";
import { relayLabel } from "@/lib/relays";
import { Loader2, Trash2 } from "lucide-react";

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
  /** Relay indices skipped for the remainder of the run (hidden from the list). */
  skippedRelays: number[];
  /** Called when the user clicks remove; parent should confirm then call the API. */
  onRequestRemove: (relayId: number) => void;
  /** Relay id currently being removed (disables only that row's button). */
  pendingRelayId: number | undefined;
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
  skippedRelays: number[],
): Step[] {
  if (shouldCloseAt == null) return [];
  const skipped = new Set(skippedRelays);
  const steps: Step[] = [];
  let cursor = shouldCloseAt;
  for (let i = openedRelay + 1; i < sequence.length; i++) {
    if (skipped.has(i)) continue;
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
  skippedRelays,
  onRequestRemove,
  pendingRelayId,
}: UpcomingStepsListProps) {
  const steps = computeSteps(openedRelay, shouldCloseAt, sequence, skippedRelays);

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
          className="flex items-center justify-between gap-2 rounded-md border bg-card px-3 py-2 text-sm"
        >
          <span className="font-medium">{relayLabel(step.relayId)}</span>
          <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
            <span>
              {formatClock(step.startAt)} · {formatDuration(step.durationSec)}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Retirer ${relayLabel(step.relayId)} de la séquence`}
              title="Retirer de la séquence"
              disabled={pendingRelayId === step.relayId}
              onClick={() => onRequestRemove(step.relayId)}
            >
              {pendingRelayId === step.relayId ? (
                <Loader2 className="animate-spin" aria-hidden />
              ) : (
                <Trash2 aria-hidden />
              )}
            </Button>
          </span>
        </li>
      ))}
    </ul>
  );
}
