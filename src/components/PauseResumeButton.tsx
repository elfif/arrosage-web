import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { useCurrentMode } from "../api/queries";
import { usePauseSystem } from "../api/mutations";
import { useResumeSystem } from "../api/mutations";

export function PauseResumeButton() {
  const { data: mode } = useCurrentMode();
  const pauseMutation = usePauseSystem({
    onSuccess: (data) => {
      console.log("System paused:", data.message);
    },
  });

  const resumeMutation = useResumeSystem({
    onSuccess: (data) => {
      console.log("System resumed:", data.message);
    },
  });

  const handlePauseResume = () => {
    if (mode?.current === "pause") {
      resumeMutation.mutate();
    } else {
      pauseMutation.mutate();
    }
  };

  const isPaused = mode?.current === "pause";

  return (
    <Button
      variant={isPaused ? "default" : "destructive"}
      onClick={handlePauseResume}
    >
      {isPaused ? (
        <>
          <Play className="mr-2 h-4 w-4" />
          Reprendre
        </>
      ) : (
        <>
          <Pause className="mr-2 h-4 w-4" />
          Pause
        </>
      )}
    </Button>
  );
}

