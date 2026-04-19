import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from './client';
import type {
  ApiInfoResponse,
  ModeResponse,
  StatusResponse,
  SettingsResponse,
  RelayStatusResponse,
  HistoryListParams,
  HistoryListResponse,
  HistoryStatsParams,
  HistoryStatsResponse,
} from './types';
import { ApiError } from './types';

// Query Keys - centralized for better cache management
export const queryKeys = {
  apiInfo: ['api-info'] as const,
  mode: ['mode'] as const,
  status: ['status'] as const,
  settings: ['settings'] as const,
  relays: ['relays'] as const,
  history: ['history'] as const,
  historyStats: ['history-stats'] as const,
};

// Query hooks for GET endpoints

/**
 * Hook to get API information
 */
export function useApiInfo(
  options?: Omit<UseQueryOptions<ApiInfoResponse, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.apiInfo,
    queryFn: () => apiClient.getApiInfo(),
    staleTime: 1000 * 60 * 10, // 10 minutes - API info doesn't change often
    ...options,
  });
}

/**
 * Hook to get current mode
 */
export function useCurrentMode(
  options?: Omit<UseQueryOptions<ModeResponse, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.mode,
    queryFn: () => apiClient.getCurrentMode(),
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    ...options,
  });
}

/**
 * Hook to get current status
 */
export function useCurrentStatus(
  options?: Omit<UseQueryOptions<StatusResponse, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.status,
    queryFn: () => apiClient.getCurrentStatus(),
    refetchInterval: 5000, // Refetch every 5 seconds for real-time status updates
    ...options,
  });
}

/**
 * Hook to get current settings
 */
export function useCurrentSettings(
  options?: Omit<UseQueryOptions<SettingsResponse, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => apiClient.getCurrentSettings(),
    staleTime: 1000 * 60 * 2, // 2 minutes - settings don't change very often
    ...options,
  });
}

/**
 * Hook to get per-relay status (works in any mode)
 */
export function useRelaysStatus(
  options?: Omit<UseQueryOptions<RelayStatusResponse, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.relays,
    queryFn: () => apiClient.getRelaysStatus(),
    refetchInterval: 5000,
    ...options,
  });
}

/**
 * Hook to get paginated relay activity history.
 */
export function useHistory(
  params: HistoryListParams = {},
  options?: Omit<UseQueryOptions<HistoryListResponse, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...queryKeys.history, params],
    queryFn: () => apiClient.getHistory(params),
    staleTime: 30_000,
    ...options,
  });
}

/**
 * Hook to get aggregate history stats for a month or year.
 */
export function useHistoryStats(
  params: HistoryStatsParams,
  options?: Omit<UseQueryOptions<HistoryStatsResponse, ApiError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...queryKeys.historyStats, params],
    queryFn: () => apiClient.getHistoryStats(params),
    staleTime: 60_000,
    ...options,
  });
}

