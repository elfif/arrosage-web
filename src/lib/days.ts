/**
 * The API's schedule array is indexed Mon=0..Sun=6.
 */
export const DAYS_FR_LONG = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
] as const;

export const DAYS_FR_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"] as const;

/**
 * Convert a JavaScript Date.getDay() (Sun=0..Sat=6) to the API's day index (Mon=0..Sun=6).
 */
export function jsDayToApiDay(jsDay: number): number {
  return (jsDay + 6) % 7;
}
