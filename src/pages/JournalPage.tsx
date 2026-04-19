import { JournalLogList } from "@/components/journal/JournalLogList";
import { MonthlyStatsSection } from "@/components/journal/MonthlyStatsSection";

export function JournalPage() {
  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <h2 className="text-2xl font-bold">Journal</h2>
      <MonthlyStatsSection />
      <JournalLogList />
    </div>
  );
}
