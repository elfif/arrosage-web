import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { RELAY_COUNT, relayLabel } from "@/lib/relays";
import { formatDuration } from "@/lib/time";
import type { RelayStat } from "@/api";

const chartConfig: ChartConfig = {
  total_duration_s: {
    label: "Durée",
    color: "var(--color-chart-1)",
  },
};

interface PerRelayBarChartProps {
  data: RelayStat[];
  /**
   * Shared upper bound for the Y axis so multiple charts stay comparable.
   * When omitted, recharts auto-scales based on `data`.
   */
  maxDuration?: number;
}

export function PerRelayBarChart({ data, maxDuration }: PerRelayBarChartProps) {
  // Ensure we always render 8 bars (zero-filled) in relay order.
  const byRelay = new Map(data.map((d) => [d.relay_id, d]));
  const rows = Array.from({ length: RELAY_COUNT }, (_, relayId) => {
    const row = byRelay.get(relayId);
    return {
      relay_id: relayId,
      label: relayLabel(relayId),
      shortLabel: String(relayId + 1),
      total_duration_s: row?.total_duration_s ?? 0,
      count: row?.count ?? 0,
    };
  });

  const yDomain: [number, number] | undefined =
    maxDuration && maxDuration > 0 ? [0, maxDuration] : undefined;

  return (
    <ChartContainer config={chartConfig} className="aspect-[4/3] w-full">
      <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="shortLabel"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis hide domain={yDomain} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(_value, payload) => {
                const item = payload?.[0]?.payload as
                  | { label?: string }
                  | undefined;
                return item?.label ?? "";
              }}
              formatter={(value, _name, item) => {
                const payload = item?.payload as
                  | { count?: number }
                  | undefined;
                const seconds =
                  typeof value === "number" ? value : Number(value) || 0;
                return (
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="font-mono font-medium tabular-nums text-foreground">
                      {formatDuration(seconds)}
                    </span>
                    <span className="text-muted-foreground">
                      {payload?.count ?? 0} activation
                      {(payload?.count ?? 0) > 1 ? "s" : ""}
                    </span>
                  </div>
                );
              }}
            />
          }
        />
        <Bar
          dataKey="total_duration_s"
          fill="var(--color-total_duration_s)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
