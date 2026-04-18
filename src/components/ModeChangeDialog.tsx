import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Mode } from "../api";

interface ModeChangeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentMode: Mode;
  onModeChange: (mode: string) => void;
}

const modes = [
  { label: "Auto", value: "auto" },
  { label: "Semi-auto", value: "semi_auto" },
  { label: "Manuel", value: "manual" },
];

export function ModeChangeDialog({
  isOpen,
  onOpenChange,
  currentMode,
  onModeChange,
}: ModeChangeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Changer le statut
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Changer le mode de fonctionnement</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-4">
          {modes.map((mode) => (
            <Button
              key={mode.value}
              variant="outline"
              className={`w-full justify-start ${
                mode.value === currentMode
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent"
              }`}
              onClick={() => onModeChange(mode.value)}
            >
              {mode.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

