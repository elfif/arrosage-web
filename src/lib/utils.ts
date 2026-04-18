import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getModeLabel(mode: string) {
  switch (mode) {
    case "auto":
      return "Auto"
    case "semi_auto":
      return "Semi-auto"
    case "manual":
      return "Manuel"
    case "pause":
      return "Pause"
    default:
      return "Unknown"
  }
}