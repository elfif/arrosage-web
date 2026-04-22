import { useEffect, useState } from "react";
import { formatCountdown } from "@/lib/time";

interface RelayCountdownProps {
  /** Unix timestamp (seconds) when the current relay should close. */
  shouldCloseAt: number | null | undefined;
  /** When true, stop ticking and display a paused label instead of a value. */
  paused?: boolean;
}

/**
 * Live-ticking countdown (mm:ss) from now until `shouldCloseAt`.
 * Returns an em-dash when the close time is unknown, or a paused label
 * when `paused` is true (the underlying `should_close_at` stays fixed
 * during a pause, so ticking would display a misleading value).
 */
export function RelayCountdown({ shouldCloseAt, paused = false }: RelayCountdownProps) {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, [paused]);

  if (paused) {
    return <span className="tabular-nums">En pause</span>;
  }

  if (!shouldCloseAt) {
    return <span className="tabular-nums">—</span>;
  }

  const remaining = shouldCloseAt - now;
  return <span className="tabular-nums">{formatCountdown(remaining)}</span>;
}
