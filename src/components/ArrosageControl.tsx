import { useState } from 'react';
import {
  useCurrentMode,
  useCurrentStatus,
  useCurrentSettings,
  useSetCurrentMode,
  usePauseSystem,
  useResumeSystem,
  useResetSystem,
  useUpdateSettings,
} from '../api';
import type { Mode, SettingsRequest } from '../api';

export function ArrosageControl() {
  const [selectedMode, setSelectedMode] = useState<Mode>('auto');
  
  // Query hooks
  const { data: mode, isLoading: modeLoading, error: modeError } = useCurrentMode();
  const { data: status, isLoading: statusLoading } = useCurrentStatus();
  const { data: settings, isLoading: settingsLoading } = useCurrentSettings();
  
  // Mutation hooks
  const setModeMutation = useSetCurrentMode({
    onSuccess: () => {
      console.log('Mode updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update mode:', error.message);
    },
  });
  
  const pauseMutation = usePauseSystem({
    onSuccess: (data) => {
      console.log('System paused:', data.message);
    },
  });
  
  const resumeMutation = useResumeSystem({
    onSuccess: (data) => {
      console.log('System resumed:', data.message);
    },
  });
  
  const resetMutation = useResetSystem({
    onSuccess: (data) => {
      console.log('System reset:', data.message);
    },
  });
  
  const updateSettingsMutation = useUpdateSettings({
    onSuccess: () => {
      console.log('Settings updated successfully');
    },
  });

  const handleModeChange = () => {
    setModeMutation.mutate({ mode: selectedMode });
  };

  const handleUpdateSettings = () => {
    const newSettings: SettingsRequest = {
      start_at: '20:00',
      sequence: [3600, 3600, 3600, 3600, 3600, 3600, 3600, 0],
      schedule: [false, false, false, false, false, false, true],
    };
    updateSettingsMutation.mutate(newSettings);
  };

  if (modeLoading || statusLoading || settingsLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (modeError) {
    return <div className="p-4 text-red-600">Error: {modeError.message}</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Arrosage Control Panel</h1>
      
      {/* Current Mode */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Current Mode</h2>
        <p className="text-lg">Mode: <span className="font-mono bg-blue-100 px-2 py-1 rounded">{mode?.current}</span></p>
        <p className="text-sm text-gray-600 mt-1">
          Valid modes: {mode?.valid_modes.join(', ')}
        </p>
      </div>

      {/* Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">System Status</h2>
        <p className="mb-2">Has Active Sequence: {status?.has_active_sequence ? 'Yes' : 'No'}</p>
        {status?.status && (
          <div className="ml-4">
            <p>Opened Relay: {status.status.opened_relay}</p>
            <p>Opened At: {new Date(status.status.opened_at * 1000).toLocaleString()}</p>
            <p>Should Close At: {new Date(status.status.should_close_at * 1000).toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Current Settings</h2>
        {settings && (
          <div>
            <p className="mb-2">Start Time: <span className="font-mono">{settings.start_at}</span></p>
            <p className="mb-2">Sequence: <span className="font-mono text-sm">[{settings.sequence.join(', ')}]</span></p>
            <p className="mb-2">Schedule: <span className="font-mono text-sm">[{settings.schedule.map(s => s ? 'T' : 'F').join(', ')}]</span></p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Controls</h2>
        
        {/* Mode Control */}
        <div className="flex items-center gap-2">
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value as Mode)}
            className="border rounded px-3 py-2"
          >
            {mode?.valid_modes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <button
            onClick={handleModeChange}
            disabled={setModeMutation.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {setModeMutation.isPending ? 'Setting...' : 'Set Mode'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => pauseMutation.mutate()}
            disabled={pauseMutation.isPending}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
          >
            {pauseMutation.isPending ? 'Pausing...' : 'Pause'}
          </button>
          
          <button
            onClick={() => resumeMutation.mutate()}
            disabled={resumeMutation.isPending}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {resumeMutation.isPending ? 'Resuming...' : 'Resume'}
          </button>
          
          <button
            onClick={() => resetMutation.mutate()}
            disabled={resetMutation.isPending}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {resetMutation.isPending ? 'Resetting...' : 'Reset'}
          </button>
        </div>

        {/* Settings Update */}
        <button
          onClick={handleUpdateSettings}
          disabled={updateSettingsMutation.isPending}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {updateSettingsMutation.isPending ? 'Updating...' : 'Update Settings (Example)'}
        </button>
      </div>
    </div>
  );
}

