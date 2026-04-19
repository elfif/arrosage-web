import { useEffect, useState } from "react";

import { useHistory } from "@/api";
import type { HistoryMode, RelayActivityItem } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { RELAY_COUNT, relayLabel } from "@/lib/relays";
import { formatDateTime, formatDuration } from "@/lib/time";

const PAGE_SIZE = 25;
const ALL_RELAYS = "all" as const;

const MODE_LABEL: Record<HistoryMode, string> = {
  auto: "AUTO",
  semi_auto: "SEMI-AUTO",
  manual: "MANUEL",
};

const MODE_VARIANT: Record<HistoryMode, "default" | "secondary" | "outline"> = {
  auto: "default",
  semi_auto: "secondary",
  manual: "outline",
};

function dedupeById(items: RelayActivityItem[]): RelayActivityItem[] {
  const seen = new Set<number>();
  const out: RelayActivityItem[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

export function JournalLogList() {
  const [relayFilter, setRelayFilter] = useState<typeof ALL_RELAYS | number>(
    ALL_RELAYS,
  );
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<RelayActivityItem[]>([]);

  const relayIdParam = relayFilter === ALL_RELAYS ? undefined : relayFilter;
  const { data, isLoading, isFetching, isError, error } = useHistory({
    page,
    page_size: PAGE_SIZE,
    relay_id: relayIdParam,
  });

  // Reset accumulated items whenever the filter changes.
  useEffect(() => {
    setPage(1);
    setItems([]);
  }, [relayFilter]);

  // Append (or reset on page=1) fetched items into the accumulated list.
  useEffect(() => {
    if (!data) return;
    setItems((prev) =>
      data.page === 1 ? data.items : dedupeById([...prev, ...data.items]),
    );
  }, [data]);

  const totalPages = data?.total_pages ?? 0;
  const total = data?.total ?? 0;
  const canLoadMore = page < totalPages;

  const handleFilterChange = (value: string) => {
    if (value === ALL_RELAYS) {
      setRelayFilter(ALL_RELAYS);
    } else {
      setRelayFilter(Number(value));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Historique des activations</CardTitle>
          <CardDescription>
            {total > 0
              ? `${items.length} sur ${total} activation${total > 1 ? "s" : ""}`
              : "Aucune activation enregistrée"}
          </CardDescription>
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={
              relayFilter === ALL_RELAYS ? ALL_RELAYS : String(relayFilter)
            }
            onValueChange={handleFilterChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par relais" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_RELAYS}>Tous les relais</SelectItem>
              {Array.from({ length: RELAY_COUNT }, (_, i) => (
                <SelectItem key={i} value={String(i)}>
                  {relayLabel(i)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isError ? (
          <p className="text-sm text-destructive">
            Impossible de charger l'historique ({error?.message}).
          </p>
        ) : isLoading && items.length === 0 ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune activation pour ce filtre.
          </p>
        ) : (
          <>
            {/* Mobile: stacked rows. Desktop: table-like grid. */}
            <div className="hidden sm:grid sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:gap-2 sm:border-b sm:pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <span>Date</span>
              <span>Relais</span>
              <span>Durée</span>
              <span className="text-right">Mode</span>
            </div>
            <ul className="flex flex-col divide-y divide-border">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-2 md:grid-cols-4 gap-y-1 py-2"
                >
                  <span className="order-1 font-medium tabular-nums sm:col-span-1 sm:order-none sm:font-normal">
                    {formatDateTime(item.opened_at)}
                  </span>
                  <span className="order-2 text-sm sm:order-none">
                    {relayLabel(item.relay_id)}
                  </span>
                  <span className="order-3 text-sm tabular-nums text-muted-foreground sm:order-none sm:text-foreground">
                    Durée:&nbsp;{formatDuration(item.duration_s)}
                  </span>
                  <span className="order-4 flex justify-end sm:order-none">
                    <Badge variant={MODE_VARIANT[item.mode]}>
                      {MODE_LABEL[item.mode]}
                    </Badge>
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-center pt-2">
              {canLoadMore ? (
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isFetching}
                >
                  {isFetching ? "Chargement..." : "Charger plus"}
                </Button>
              ) : (
                total > 0 && (
                  <span className="text-xs text-muted-foreground">
                    Fin de l'historique.
                  </span>
                )
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
