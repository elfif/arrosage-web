import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from './client';
import { queryKeys } from './queries';
import type {
  ModeRequest,
  ModeResponse,
  SettingsRequest,
  SettingsResponse,
  ActionResponse,
} from './types';
import { ApiError } from './types';

// Mutation hooks for POST endpoints

/**
 * Hook to set current mode
 */
export function useSetCurrentMode(
  options?: Omit<
    UseMutationOptions<ModeResponse, ApiError, ModeRequest>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ModeRequest) => apiClient.setCurrentMode(data),
    onSuccess: (data) => {
      // Update the mode cache with new data
      queryClient.setQueryData(queryKeys.mode, data);
      // Invalidate status as mode change might affect status
      queryClient.invalidateQueries({ queryKey: queryKeys.status });
    },
    ...options,
  });
}

/**
 * Hook to pause system
 */
export function usePauseSystem(
  options?: Omit<UseMutationOptions<ActionResponse, ApiError, void>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.pauseSystem(),
    onSuccess: () => {
      // Invalidate mode and status queries as they might have changed
      queryClient.invalidateQueries({ queryKey: queryKeys.mode });
      queryClient.invalidateQueries({ queryKey: queryKeys.status });
    },
    ...options,
  });
}

/**
 * Hook to resume system
 */
export function useResumeSystem(
  options?: Omit<UseMutationOptions<ActionResponse, ApiError, void>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.resumeSystem(),
    onSuccess: () => {
      // Invalidate mode and status queries as they might have changed
      queryClient.invalidateQueries({ queryKey: queryKeys.mode });
      queryClient.invalidateQueries({ queryKey: queryKeys.status });
    },
    ...options,
  });
}

/**
 * Hook to reset system
 */
export function useResetSystem(
  options?: Omit<UseMutationOptions<ActionResponse, ApiError, void>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.resetSystem(),
    onSuccess: () => {
      // Invalidate all queries as reset affects everything
      queryClient.invalidateQueries({ queryKey: queryKeys.mode });
      queryClient.invalidateQueries({ queryKey: queryKeys.status });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
    },
    ...options,
  });
}

/**
 * Hook to start sequence (SEMI_AUTO mode only)
 */
export function useStartSystem(
  options?: Omit<UseMutationOptions<ActionResponse, ApiError, void>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.startSystem(),
    onSuccess: () => {
      // Invalidate status as starting a sequence changes the status
      queryClient.invalidateQueries({ queryKey: queryKeys.status });
    },
    ...options,
  });
}

/**
 * Hook to update settings
 */
export function useUpdateSettings(
  options?: Omit<
    UseMutationOptions<SettingsResponse, ApiError, SettingsRequest>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SettingsRequest) => apiClient.updateSettings(data),
    onSuccess: (data) => {
      // Update the settings cache with new data
      queryClient.setQueryData(queryKeys.settings, data);
      // Invalidate status as settings change might affect current sequence
      queryClient.invalidateQueries({ queryKey: queryKeys.status });
    },
    ...options,
  });
}

