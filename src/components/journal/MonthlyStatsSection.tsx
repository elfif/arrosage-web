import { useMemo } from "react";
import { useHistoryStats } from "@/api";
import { getCurrentAndPreviousMonth } from "@/lib/time";
import { MonthlyStatsCard } from "./MonthlyStatsCard";

export function MonthlyStatsSection() {
  const { current, previous } = useMemo(() => getCurrentAndPreviousMonth(), []);

  // Peek at both months to compute a shared Y-axis upper bound.
  const currentStats = useHistoryStats({
    period: "month",
    year: current.year,
    month: current.month,
  });
  const previousStats = useHistoryStats({
    period: "month",
    year: previous.year,
    month: previous.month,
  });

  const maxDuration = useMemo(() => {
    const durations: number[] = [];
    for (const stats of [currentStats.data, previousStats.data]) {
      if (!stats) continue;
      for (const r of stats.per_relay) {
        durations.push(r.total_duration_s);
      }
    }
    const max = durations.length ? Math.max(...durations) : 0;
    // Pad by 10% so the tallest bar isn't flush against the top edge.
    return max > 0 ? Math.ceil(max * 1.1) : undefined;
  }, [currentStats.data, previousStats.data]);

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <MonthlyStatsCard
        title="Ce mois-ci"
        yearMonth={current}
        maxDuration={maxDuration}
      />
      <MonthlyStatsCard
        title="Mois précédent"
        yearMonth={previous}
        maxDuration={maxDuration}
      />
    </div>
  );
}
