# Arrosage API Hooks

This directory contains all the API client code and TanStack Query hooks for consuming the Arrosage API.

## Structure

- `types.ts` - TypeScript types generated from OpenAPI spec
- `client.ts` - API client with fetch wrapper and endpoint functions
- `queries.ts` - TanStack Query hooks for GET endpoints (queries)
- `mutations.ts` - TanStack Query hooks for POST endpoints (mutations)
- `index.ts` - Main export file

## Usage

### Query Hooks (GET endpoints)

```tsx
import { useCurrentMode, useCurrentStatus, useCurrentSettings, useApiInfo } from '../api';

function MyComponent() {
  // Get current mode with real-time updates (refetches every 5s)
  const { data: mode, isLoading, error } = useCurrentMode();
  
  // Get current status with real-time updates (refetches every 2s)
  const { data: status } = useCurrentStatus();
  
  // Get current settings (cached for 2 minutes)
  const { data: settings } = useCurrentSettings();
  
  // Get API info (cached for 10 minutes)
  const { data: apiInfo } = useApiInfo();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>Current mode: {mode?.current}</div>;
}
```

### Mutation Hooks (POST endpoints)

```tsx
import { 
  useSetCurrentMode, 
  usePauseSystem, 
  useResumeSystem, 
  useResetSystem, 
  useUpdateSettings 
} from '../api';

function ControlPanel() {
  // Mode mutation
  const setModeMutation = useSetCurrentMode({
    onSuccess: (data) => {
      console.log('Mode updated to:', data.current);
    },
    onError: (error) => {
      console.error('Failed to update mode:', error.message);
    },
  });
  
  // Control mutations
  const pauseMutation = usePauseSystem();
  const resumeMutation = useResumeSystem();
  const resetMutation = useResetSystem();
  
  // Settings mutation
  const updateSettingsMutation = useUpdateSettings();
  
  const handleSetMode = () => {
    setModeMutation.mutate({ mode: 'auto' });
  };
  
  const handlePause = () => {
    pauseMutation.mutate();
  };
  
  const handleUpdateSettings = () => {
    updateSettingsMutation.mutate({
      start_at: '20:00',
      sequence: [3600, 3600, 3600, 3600, 3600, 3600, 3600, 0],
      schedule: [false, false, false, false, false, false, true],
    });
  };
  
  return (
    <div>
      <button onClick={handleSetMode} disabled={setModeMutation.isPending}>
        {setModeMutation.isPending ? 'Setting...' : 'Set Auto Mode'}
      </button>
      
      <button onClick={handlePause} disabled={pauseMutation.isPending}>
        {pauseMutation.isPending ? 'Pausing...' : 'Pause System'}
      </button>
      
      <button onClick={handleUpdateSettings} disabled={updateSettingsMutation.isPending}>
        {updateSettingsMutation.isPending ? 'Updating...' : 'Update Settings'}
      </button>
    </div>
  );
}
```

### Direct API Client Usage

If you need to call the API outside of React components:

```tsx
import { apiClient } from '../api';

// Direct API calls
const mode = await apiClient.getCurrentMode();
const status = await apiClient.getCurrentStatus();
await apiClient.setCurrentMode({ mode: 'auto' });
await apiClient.pauseSystem();
```

### Error Handling

All API calls can throw `ApiError` instances:

```tsx
import { ApiError } from '../api';

try {
  await apiClient.setCurrentMode({ mode: 'invalid' });
} catch (error) {
  if (error instanceof ApiError) {
    console.log('Status:', error.status);
    console.log('Message:', error.message);
    console.log('Response:', error.response);
  }
}
```

### Query Keys

For advanced cache management, query keys are exported:

```tsx
import { queryKeys } from '../api';
import { useQueryClient } from '@tanstack/react-query';

function MyComponent() {
  const queryClient = useQueryClient();
  
  const invalidateMode = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.mode });
  };
  
  const prefetchStatus = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.status,
      queryFn: () => apiClient.getCurrentStatus(),
    });
  };
}
```

## Configuration

The API base URL is configured in `client.ts`:

```ts
const API_BASE_URL = 'http://localhost:8000';
```

Change this to match your API server URL.

## Cache Strategy

- **API Info**: 10 minutes cache (rarely changes)
- **Mode**: 5 second refetch interval (real-time updates)
- **Status**: 2 second refetch interval (real-time updates)
- **Settings**: 2 minutes cache (changes less frequently)

All mutations automatically invalidate relevant caches to keep data consistent.

