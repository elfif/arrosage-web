import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration, formatMonthLabel, type YearMonth } from "@/lib/time";
import { useHistoryStats } from "@/api";
import { PerRelayBarChart } from "./PerRelayBarChart";

interface MonthlyStatsCardProps {
  title: string;
  yearMonth: YearMonth;
  /** Shared Y-axis upper bound across several cards. */
  maxDuration?: number;
}

export function MonthlyStatsCard({
  title,
  yearMonth,
  maxDuration,
}: MonthlyStatsCardProps) {
  const { data, isLoading, isError, error } = useHistoryStats({
    period: "month",
    year: yearMonth.year,
    month: yearMonth.month,
  });

  const monthLabel = formatMonthLabel(yearMonth);

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-lg">{monthLabel}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-10 w-40" />
            <Skeleton className="aspect-[4/3] w-full" />
          </>
        ) : isError ? (
          <p className="text-sm text-destructive">
            Impossible de charger les statistiques ({error?.message}).
          </p>
        ) : data ? (
          <>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-bold tabular-nums">
                {formatDuration(data.total_duration_s)}
              </span>
              <span className="text-sm text-muted-foreground">
                {data.total_count} activation{data.total_count > 1 ? "s" : ""}{" "}
                au total
              </span>
            </div>
            {data.total_count === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune activité ce mois-ci.
              </p>
            ) : (
              <PerRelayBarChart
                data={data.per_relay}
                maxDuration={maxDuration}
              />
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
