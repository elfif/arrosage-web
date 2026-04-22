import { useState } from "react";
import { useCurrentMode, useCurrentStatus, useSetCurrentMode } from "../api";
import type { Mode } from "../api";
import { ModeChangeDialog } from "@/components/ModeChangeDialog";
import { NextSequenceInfo } from "@/components/logic/next-sequence-info";
import { StartButton } from "@/components/logic/start-button";
import { PauseResumeButton } from "@/components/PauseResumeButton";
import { ActiveSequenceCard } from "@/components/status/ActiveSequenceCard";
import { ManualRelayGrid } from "@/components/status/ManualRelayGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MODE_LABELS: Record<Mode, string> = {
  auto: "AUTO",
  semi_auto: "SEMI-AUTO",
  manual: "MANUEL",
  pause: "PAUSE",
};

export function StatusPage() {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const { data: mode } = useCurrentMode();
  const { data: status } = useCurrentStatus();

  const currentMode: Mode = mode?.current ?? "auto";

  const setModeMutation = useSetCurrentMode({
    onError: (error) => {
      console.error("Failed to update mode:", error.message);
    },
  });

  const handleModeChange = (value: string) => {
    setModeMutation.mutate({ mode: value as Mode });
    setIsStatusDialogOpen(false);
  };

  const hasActive = !!status?.has_active_sequence;

  const renderModeContent = () => {
    switch (currentMode) {
      case "auto":
        return hasActive ? <ActiveSequenceCard /> : <NextSequenceInfo />;
      case "semi_auto":
        return hasActive ? <ActiveSequenceCard /> : <StartButton />;
      case "manual":
        return <ManualRelayGrid />;
      case "pause":
        return (
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Système en pause</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                  L'arrosage est suspendu. Reprenez pour réactiver le mode précédent.
                </p>
              </CardContent>
            </Card>
            {hasActive ? <ActiveSequenceCard /> : null}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 w-full">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-2xl font-bold">
          Statut actuel : {MODE_LABELS[currentMode]}
        </h2>
        <div className="flex items-center gap-2">
          <PauseResumeButton />
          <ModeChangeDialog
            isOpen={isStatusDialogOpen}
            onOpenChange={setIsStatusDialogOpen}
            currentMode={currentMode}
            onModeChange={handleModeChange}
          />
        </div>
      </div>
      {renderModeContent()}
    </div>
  );
}
