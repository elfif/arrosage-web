import { useStartSystem } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";
import { useState } from "react";

export function StartButton() {
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const startMutation = useStartSystem({
    onSuccess: (data) => {
      setMessage(data.message);
      setIsError(!data.success);
    },
    onError: (error) => {
      setMessage(error.message);
      setIsError(true);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lancer une séquence</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          En mode semi-automatique, la séquence ne démarre que sur demande.
        </p>
        <Button
          onClick={() => {
            setMessage(null);
            setIsError(false);
            startMutation.mutate();
          }}
          disabled={startMutation.isPending}
        >
          <Play className="mr-2 h-4 w-4" />
          Démarrer la séquence
        </Button>
        {message && (
          <div
            role={isError ? "alert" : "status"}
            className={
              isError
                ? "rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                : "rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground"
            }
          >
            {message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
