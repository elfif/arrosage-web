import { Button } from "@/components/ui/button";
import { Loader2, Pause, Play } from "lucide-react";
import {
  useCurrentMode,
  useCurrentStatus,
  usePauseSystem,
  useResumeSystem,
} from "@/api";

export function PauseResumeButton() {
  const { data: mode } = useCurrentMode();
  const { data: status } = useCurrentStatus();

  const pauseMutation = usePauseSystem();
  const resumeMutation = useResumeSystem();

  const isPaused = mode?.current === "pause";
  const hasActive = !!status?.has_active_sequence;

  if (!isPaused && !hasActive) {
    return null;
  }

  const isPending = pauseMutation.isPending || resumeMutation.isPending;

  const handleClick = () => {
    if (isPaused) {
      resumeMutation.mutate();
    } else {
      pauseMutation.mutate();
    }
  };

  const label = isPaused ? "Reprendre" : "Mettre en pause";

  return (
    <Button
      type="button"
      variant="default"
      size="iconLg"
      shape="round"
      disabled={isPending}
      aria-label={label}
      title={label}
      onClick={handleClick}
    >
      {isPending ? (
        <Loader2 className="animate-spin" aria-hidden />
      ) : isPaused ? (
        <Play aria-hidden />
      ) : (
        <Pause aria-hidden />
      )}
    </Button>
  );
}
