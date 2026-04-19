import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCurrentSettings, useUpdateSettings } from "@/api";
import type { SettingsRequest } from "@/api";
import { DAYS_FR_LONG, DAYS_FR_SHORT } from "@/lib/days";
import { isValidHHMM } from "@/lib/time";
import { RELAY_COUNT } from "@/lib/relays";
import { RelayDurationInput } from "./RelayDurationInput";
import { BulkRelayDurationDialog } from "./BulkRelayDurationDialog";

interface FormState {
  start_at: string;
  sequence: number[];
  schedule: boolean[];
}

function cloneDefaults(data: SettingsRequest | undefined): FormState | null {
  if (!data) return null;
  return {
    start_at: data.start_at,
    sequence: [...data.sequence],
    schedule: [...data.schedule],
  };
}

function statesEqual(a: FormState, b: FormState): boolean {
  return (
    a.start_at === b.start_at &&
    a.sequence.length === b.sequence.length &&
    a.sequence.every((v, i) => v === b.sequence[i]) &&
    a.schedule.length === b.schedule.length &&
    a.schedule.every((v, i) => v === b.schedule[i])
  );
}

export function SettingsForm() {
  const { data, isLoading, error } = useCurrentSettings();
  const [form, setForm] = useState<FormState | null>(null);
  const [feedback, setFeedback] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (data && !form) {
      setForm(cloneDefaults(data));
    }
  }, [data, form]);

  const initial = useMemo(() => cloneDefaults(data), [data]);

  const updateMutation = useUpdateSettings({
    onSuccess: (updated) => {
      setForm(cloneDefaults(updated));
      setFeedback({ kind: "success", text: "Paramètres enregistrés." });
    },
    onError: (err) => {
      setFeedback({ kind: "error", text: err.message });
    },
  });

  if (isLoading || !form || !initial) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error ? error.message : "Chargement…"}
          </p>
        </CardContent>
      </Card>
    );
  }

  const startAtValid = isValidHHMM(form.start_at);
  const isDirty = !statesEqual(form, initial);
  const canSubmit = isDirty && startAtValid && !updateMutation.isPending;

  const toggleDay = (dayIndex: number) => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            schedule: prev.schedule.map((v, i) => (i === dayIndex ? !v : v)),
          }
        : prev,
    );
  };

  const updateRelay = (relayIndex: number, seconds: number) => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            sequence: prev.sequence.map((v, i) =>
              i === relayIndex ? seconds : v,
            ),
          }
        : prev,
    );
  };

  const setAllRelays = (seconds: number) => {
    setForm((prev) =>
      prev ? { ...prev, sequence: prev.sequence.map(() => seconds) } : prev,
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setFeedback(null);
    updateMutation.mutate(form);
  };

  const handleReset = () => {
    setForm(cloneDefaults(data));
    setFeedback(null);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Planning hebdomadaire</CardTitle>
          <CardDescription>
            Sélectionnez les jours où la séquence automatique doit être
            exécutée.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {DAYS_FR_LONG.map((dayLong, i) => {
              const id = `day-${i}`;
              return (
                <label
                  key={i}
                  htmlFor={id}
                  className="flex items-center gap-2 rounded-md border bg-card px-3 py-2"
                >
                  <Checkbox
                    id={id}
                    checked={form.schedule[i]}
                    onCheckedChange={() => toggleDay(i)}
                  />
                  <span className="text-sm">
                    <span className="sm:hidden">{DAYS_FR_SHORT[i]}</span>
                    <span className="hidden sm:inline">{dayLong}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Heure de démarrage</CardTitle>
          <CardDescription>
            Heure à laquelle la séquence commence les jours planifiés (mode
            auto).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Label htmlFor="start-at">Heure (HH:MM, 24h)</Label>
          <Input
            id="start-at"
            type="time"
            value={form.start_at}
            onChange={(e) =>
              setForm((prev) =>
                prev ? { ...prev, start_at: e.target.value } : prev,
              )
            }
            className="max-w-[10rem]"
          />
          {!startAtValid && (
            <p className="text-xs text-destructive">
              Format attendu : HH:MM en 24h.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Durées des relais</CardTitle>
          <CardDescription>
            Chaque relais s'ouvre l'un après l'autre pour la durée indiquée. Une
            durée de 0 désactive le relais.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div>
            <BulkRelayDurationDialog
              disabled={updateMutation.isPending}
              onApply={setAllRelays}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: RELAY_COUNT }, (_, i) => (
              <RelayDurationInput
                key={i}
                relayId={i}
                valueSec={form.sequence[i] ?? 0}
                disabled={updateMutation.isPending}
                onChange={(seconds) => updateRelay(i, seconds)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
        {feedback && (
          <p
            role={feedback.kind === "error" ? "alert" : "status"}
            className={
              feedback.kind === "error"
                ? "text-sm text-destructive"
                : "text-sm text-muted-foreground"
            }
          >
            {feedback.text}
          </p>
        )}
        <div className="flex gap-2 sm:ml-auto mb-16">
          <Button type="submit" disabled={!canSubmit} className="px-8">
            {updateMutation.isPending ? "Enregistrement…" : "Enregistrer"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={!isDirty || updateMutation.isPending}
            className="px-8"
          >
            Annuler
          </Button>
        </div>
      </div>
    </form>
  );
}
