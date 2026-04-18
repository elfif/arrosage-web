import { useStartSystem } from "@/api";
import { Button } from "@/components/ui/button";

export function StartButton() {

  const startMutation = useStartSystem({
    onSuccess: () => {
      console.log("System started");
    },
  });

  return <Button onClick={() => startMutation.mutate()}>Start</Button>;
}