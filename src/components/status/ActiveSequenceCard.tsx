import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCurrentSettings, useCurrentStatus } from "@/api";
import { relayLabel } from "@/lib/relays";
import { RelayCountdown } from "./RelayCountdown";
import { UpcomingStepsList } from "./UpcomingStepsList";

export function ActiveSequenceCard() {
  const { data: status } = useCurrentStatus();
  const { data: settings } = useCurrentSettings();

  const active = status?.status;
  if (!status?.has_active_sequence || !active) {
    return null;
  }

  const shouldCloseAt = active.should_close_at ?? null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Séquence en cours</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Relais ouvert
            </span>
            <span className="text-2xl font-bold">{relayLabel(active.opened_relay)}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Fermeture dans
            </span>
            <span className="text-2xl font-bold">
              <RelayCountdown shouldCloseAt={shouldCloseAt} />
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Prochaines étapes</h3>
          {settings ? (
            <UpcomingStepsList
              openedRelay={active.opened_relay}
              shouldCloseAt={shouldCloseAt}
              sequence={settings.sequence}
            />
          ) : (
            <p className="text-sm text-muted-foreground">Chargement…</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
