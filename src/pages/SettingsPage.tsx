import { SettingsForm } from "@/components/settings/SettingsForm";

export function SettingsPage() {
  return (
    <div className="flex flex-col gap-4 p-6 w-full">
      <h2 className="text-2xl font-bold">Paramètres</h2>
      <SettingsForm />
    </div>
  );
}
