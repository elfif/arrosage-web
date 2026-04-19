/**
 * Relay IDs are 0..7 on the wire and in state. The UI displays them 1-based
 * ("Relais 1".."Relais 8") through these helpers.
 */
export const RELAY_COUNT = 8;

export const RELAY_LABELS = Array.from(
  { length: RELAY_COUNT },
  (_, i) => `Relais ${i + 1}`,
);

export function relayLabel(relayId: number): string {
  return `Relais ${relayId + 1}`;
}
