import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useCloseRelays,
  useCurrentMode,
  useOpenRelay,
  useRelaysStatus,
} from "@/api";
import { ApiError } from "@/api";
import { RelayToggleButton } from "./RelayToggleButton";

export function ManualRelayGrid() {
  const { data: mode } = useCurrentMode();
  const { data: relays, isLoading } = useRelaysStatus();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEnvelope = (data: { success: boolean; message: string }) => {
    setErrorMessage(data.success ? null : data.message);
  };
  const handleError = (err: ApiError) => {
    setErrorMessage(err.message);
  };

  const openMut = useOpenRelay({
    onSuccess: handleEnvelope,
    onError: handleError,
  });
  const closeMut = useCloseRelays({
    onSuccess: handleEnvelope,
    onError: handleError,
  });

  const isManual = mode?.current === "manual";
  const actionsDisabled = !isManual || openMut.isPending || closeMut.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contrôle manuel des relais</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!isManual && (
          <p className="text-sm text-muted-foreground">
            Passez en mode manuel pour contrôler les relais.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {relays?.relays.map((r) => (
            <RelayToggleButton
              key={r.relay_id}
              relayId={r.relay_id}
              isOpen={r.is_open}
              disabled={actionsDisabled}
              onOpen={() => {
                setErrorMessage(null);
                openMut.mutate({ relay_id: r.relay_id });
              }}
            />
          ))}
          {isLoading && !relays && (
            <p className="col-span-full text-sm text-muted-foreground">
              Chargement des relais…
            </p>
          )}
        </div>

        <Button
          variant="destructive"
          disabled={actionsDisabled}
          onClick={() => {
            setErrorMessage(null);
            closeMut.mutate();
          }}
        >
          Fermer tous les relais
        </Button>

        {errorMessage && (
          <div
            role="alert"
            className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {errorMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
