import { useCurrentMode } from "@/api";
import { StartButton } from "./start-button";

export function NoNextSequence() {

  const { data: mode } = useCurrentMode();

  if (mode?.current === "semi_auto") {
    return <StartButton />;
  }

  return <p className="text-2xl font-bold">Aucune séquence suivante programmée</p>;  
}