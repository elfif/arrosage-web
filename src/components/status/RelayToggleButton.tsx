import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { relayLabel } from "@/lib/relays";

interface RelayToggleButtonProps {
  relayId: number;
  isOpen: boolean;
  disabled?: boolean;
  onOpen: () => void;
}

/**
 * Single relay button used by the manual mode grid. Clicking an already-open
 * relay is a no-op because the API only supports a global close action.
 */
export function RelayToggleButton({
  relayId,
  isOpen,
  disabled,
  onOpen,
}: RelayToggleButtonProps) {
  return (
    <Button
      variant={isOpen ? "default" : "outline"}
      disabled={disabled || isOpen}
      onClick={onOpen}
      className={cn(
        "h-auto min-h-10 flex-row items-start justify-between gap-2 p-3 text-left",
      )}
    >
      <span className="text-sm font-semibold">{relayLabel(relayId)}</span>
      <Badge
        variant={isOpen ? "secondary" : "outline"}
        className="self-start"
      >
        {isOpen ? "Ouvert" : "Fermé"}
      </Badge>
    </Button>
  );
}
