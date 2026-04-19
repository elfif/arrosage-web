import { useEffect, useState } from "react";
import { formatCountdown } from "@/lib/time";

interface RelayCountdownProps {
  /** Unix timestamp (seconds) when the current relay should close. */
  shouldCloseAt: number | null | undefined;
}

/**
 * Live-ticking countdown (mm:ss) from now until `shouldCloseAt`.
 * Returns an em-dash when the close time is unknown.
 */
export function RelayCountdown({ shouldCloseAt }: RelayCountdownProps) {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  if (!shouldCloseAt) {
    return <span className="tabular-nums">—</span>;
  }

  const remaining = shouldCloseAt - now;
  return <span className="tabular-nums">{formatCountdown(remaining)}</span>;
}
