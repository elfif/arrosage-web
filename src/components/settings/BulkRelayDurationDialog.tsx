import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BulkRelayDurationDialogProps {
  disabled?: boolean;
  onApply: (seconds: number) => void;
}

const DEFAULT_HOURS = 1;
const DEFAULT_MINUTES = 0;

export function BulkRelayDurationDialog({
  disabled,
  onApply,
}: BulkRelayDurationDialogProps) {
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState(DEFAULT_HOURS);
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES);

  useEffect(() => {
    if (open) {
      setHours(DEFAULT_HOURS);
      setMinutes(DEFAULT_MINUTES);
    }
  }, [open]);

  const clampHours = (value: number) =>
    Math.max(0, Math.min(23, Math.floor(Number.isFinite(value) ? value : 0)));
  const clampMinutes = (value: number) =>
    Math.max(0, Math.min(59, Math.floor(Number.isFinite(value) ? value : 0)));

  const handleSubmit = () => {
    const h = clampHours(hours);
    const m = clampMinutes(minutes);
    onApply(h * 3600 + m * 60);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" disabled={disabled}>
          Changer toutes les durées
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Changer toutes les durées</DialogTitle>
          <DialogDescription>
            Cette durée sera appliquée automatiquement à tous les relais.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label
              htmlFor="bulk-relay-hours"
              className="text-xs text-muted-foreground pb-2"
            >
              Heures
            </Label>
            <Input
              id="bulk-relay-hours"
              type="number"
              inputMode="numeric"
              min={0}
              max={23}
              value={hours}
              onChange={(e) => setHours(clampHours(Number(e.target.value)))}
            />
          </div>
          <div className="flex-1">
            <Label
              htmlFor="bulk-relay-minutes"
              className="text-xs text-muted-foreground pb-2"
            >
              Minutes
            </Label>
            <Input
              id="bulk-relay-minutes"
              type="number"
              inputMode="numeric"
              min={0}
              max={59}
              value={minutes}
              onChange={(e) => setMinutes(clampMinutes(Number(e.target.value)))}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>
            Appliquer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
