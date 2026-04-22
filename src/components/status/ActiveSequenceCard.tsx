import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useCurrentMode,
  useCurrentSettings,
  useCurrentStatus,
  useRemoveRelayFromSequence,
} from "@/api";
import { relayLabel } from "@/lib/relays";
import { cn } from "@/lib/utils";
import { Loader2, Trash2 } from "lucide-react";
import { RelayCountdown } from "./RelayCountdown";
import { UpcomingStepsList } from "./UpcomingStepsList";

export function ActiveSequenceCard() {
  const { data: status } = useCurrentStatus();
  const { data: settings } = useCurrentSettings();
  const { data: mode } = useCurrentMode();
  const removeMutation = useRemoveRelayFromSequence();
  const [confirmRelayId, setConfirmRelayId] = useState<number | null>(null);

  const active = status?.status;
  if (!status?.has_active_sequence || !active) {
    return null;
  }

  const shouldCloseAt = active.should_close_at ?? null;
  const isPaused = mode?.current === "pause";
  const skippedRelays =
    active.skipped_relays ?? status.skipped_relays ?? [];
  const pendingRelayId = removeMutation.isPending
    ? removeMutation.variables
    : undefined;

  return (
    <>
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-2xl font-bold">
                {relayLabel(active.opened_relay)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Retirer ${relayLabel(active.opened_relay)} de la séquence`}
                title="Retirer de la séquence"
                disabled={pendingRelayId === active.opened_relay}
                onClick={() => setConfirmRelayId(active.opened_relay)}
              >
                {pendingRelayId === active.opened_relay ? (
                  <Loader2 className="animate-spin" aria-hidden />
                ) : (
                  <Trash2 aria-hidden />
                )}
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Fermeture dans
            </span>
            <span className="text-2xl font-bold">
              <RelayCountdown shouldCloseAt={shouldCloseAt} paused={isPaused} />
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
              skippedRelays={skippedRelays}
              onRequestRemove={(relayId) => setConfirmRelayId(relayId)}
              pendingRelayId={pendingRelayId}
            />
          ) : (
            <p className="text-sm text-muted-foreground">Chargement…</p>
          )}
        </div>
      </CardContent>
    </Card>

    <AlertDialog
      open={confirmRelayId !== null}
      onOpenChange={(open) => {
        if (!open) setConfirmRelayId(null);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Retirer ce relais ?</AlertDialogTitle>
          <AlertDialogDescription>
            {confirmRelayId !== null
              ? `${relayLabel(confirmRelayId)} sera exclu du déroulement de la séquence en cours. Cette action ne peut pas être annulée.`
              : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            disabled={removeMutation.isPending}
            onClick={() => {
              if (confirmRelayId !== null) {
                removeMutation.mutate(confirmRelayId);
              }
            }}
          >
            Retirer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
