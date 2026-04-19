import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { secondsToHMS } from "@/lib/time";
import { relayLabel } from "@/lib/relays";

interface RelayDurationInputProps {
  relayId: number;
  valueSec: number;
  disabled?: boolean;
  onChange: (seconds: number) => void;
}

/**
 * Edits a single relay duration as two numeric fields (hours + minutes) backed
 * by a seconds value. 0 seconds is shown explicitly and meant as "désactivé".
 */
export function RelayDurationInput({
  relayId,
  valueSec,
  disabled,
  onChange,
}: RelayDurationInputProps) {
  const { hours, minutes } = secondsToHMS(valueSec);

  const update = (nextHours: number, nextMinutes: number) => {
    const clampedH = Math.max(0, Math.floor(Number.isFinite(nextHours) ? nextHours : 0));
    const clampedM = Math.max(0, Math.min(59, Math.floor(Number.isFinite(nextMinutes) ? nextMinutes : 0)));
    onChange(clampedH * 3600 + clampedM * 60);
  };

  const hoursInputId = `relay-${relayId}-hours`;
  const minutesInputId = `relay-${relayId}-minutes`;

  return (
    <div className="flex flex-col gap-2 rounded-md border bg-card p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{relayLabel(relayId)}</span>
        {valueSec === 0 && (
          <span className="text-xs text-muted-foreground">Désactivé</span>
        )}
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor={hoursInputId} className="text-xs text-muted-foreground pb-2">
            Heures
          </Label>
          <Input
            id={hoursInputId}
            type="number"
            inputMode="numeric"
            min={0}
            max={23}
            disabled={disabled}
            value={hours}
            onChange={(e) => update(Number(e.target.value), minutes)}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor={minutesInputId} className="text-xs text-muted-foreground pb-2">
            Minutes
          </Label>
          <Input
            id={minutesInputId}
            type="number"
            inputMode="numeric"
            min={0}
            max={59}
            disabled={disabled}
            value={minutes}
            onChange={(e) => update(hours, Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
