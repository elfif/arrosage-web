/**
 * Parse a "HH:MM" (24-hour) string into { hours, minutes }.
 * Returns null if the input does not match the expected format.
 */
export function parseHHMM(value: string): { hours: number; minutes: number } | null {
  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) return null;
  return { hours: Number(match[1]), minutes: Number(match[2]) };
}

/**
 * Check whether a string matches the API's "HH:MM" 24-hour pattern.
 */
export function isValidHHMM(value: string): boolean {
  return parseHHMM(value) !== null;
}

/**
 * Format a number of seconds as a human-friendly French duration,
 * e.g. 3665 -> "1h 1min 5s". Returns "0s" for 0.
 */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}min`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
  return parts.join(" ");
}

/**
 * Convert a number of seconds to a { hours, minutes, seconds } breakdown.
 */
export function secondsToHMS(totalSeconds: number): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const s = Math.max(0, Math.floor(totalSeconds));
  return {
    hours: Math.floor(s / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/**
 * Format a number of seconds as "m:ss" for countdowns. Caps at 99:59 to stay compact.
 */
export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Format a Date as "HH:MM" using the user's locale (24-hour).
 */
export function formatClock(date: Date): string {
  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * Format a unix timestamp (seconds) as a short French date + time,
 * e.g. 1758827415 -> "25/09/2025 17:30".
 */
export function formatDateTime(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export interface YearMonth {
  year: number;
  month: number; // 1-12
}

/**
 * Return the current calendar month and the previous one, based on the
 * browser's local timezone. Month is 1-indexed to match the API.
 */
export function getCurrentAndPreviousMonth(
  now: Date = new Date(),
): { current: YearMonth; previous: YearMonth } {
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  const previous: YearMonth =
    month === 1
      ? { year: year - 1, month: 12 }
      : { year, month: month - 1 };
  return { current: { year, month }, previous };
}

/**
 * Format a {year, month} as a French month label, e.g. {2026, 4} -> "Avril 2026".
 */
export function formatMonthLabel({ year, month }: YearMonth): string {
  const date = new Date(year, month - 1, 1);
  const raw = date.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}
