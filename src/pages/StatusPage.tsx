import { useState } from "react";
import {
  useCurrentMode,
  useCurrentStatus,
  useSetCurrentMode,
  useCurrentSettings,
} from "../api";
import type { Mode } from "../api";
import { ModeChangeDialog } from "@/components/ModeChangeDialog";
import { NoNextSequence } from "@/components/logic/no-next-sequence";
import { NextSequence } from "@/components/logic/next-sequence";

export function StatusPage() {
  const [selectedMode, setSelectedMode] = useState<Mode>("auto");
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  // Query hooks
  const { data: mode } = useCurrentMode();
  const { data: status } = useCurrentStatus();
  const { data: settings } = useCurrentSettings();

  // Mutation hooks
  const setModeMutation = useSetCurrentMode({
    onSuccess: () => {
      console.log("Mode updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update mode:", error.message);
    },
  });

  const handleModeChange = (value: string) => {
    const newMode = value as Mode;
    setSelectedMode(newMode);
    setModeMutation.mutate({ mode: newMode });
  };

  const nextSequence = () => {
    if (status?.has_active_sequence) {
      return <NoNextSequence />;
    }
    // if we have all days with false.
    if (!settings?.schedule.some((day) => day)) {
      return <NoNextSequence />;
    }
    
    // Create a datetime using now and the start_at time.
    const now = new Date();
    const startAt = new Date(`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${settings?.start_at}`);
    if (now > startAt) {
      // Then we add a day to the startAt date.
      startAt.setDate(startAt.getDate() + 1);
    }
    
    let i = 0;
    while (i <= 6 && !settings?.schedule[startAt.getDay()]) {
      startAt.setDate(startAt.getDate() + 1);
      i++;
    }

    // We check one last time if the day is true.
    if (!settings?.schedule[startAt.getDay()]) {
      return <NoNextSequence />;
    }

    // We return the startAt date.
    return <NextSequence nextSequence={startAt} />;
  };

  return (
    <div className="flex flex-col gap-4 p-6 w-full">
      <div className="flex lg:flex-row lg:justify-between gap-4 ">
        <h2 className="text-2xl font-bold place-self-start">
          Statut Actuel: {selectedMode.toUpperCase()}
        </h2>
        <ModeChangeDialog
          isOpen={isStatusDialogOpen}
          onOpenChange={setIsStatusDialogOpen}
          currentMode={selectedMode}
          onModeChange={handleModeChange}
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {status?.has_active_sequence ? (
          <div>Sequence en cours: {status.status?.opened_relay}</div>
        ) : (
          nextSequence()
        )}
        {/* <PauseResumeButton
          currentMode={selectedMode}
          onToggle={handlePauseResume}
        /> */}
      </div>

      {/* Détails des électrovannes */}
    </div>
  );
}
