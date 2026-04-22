import type {
  ApiInfoResponse,
  ModeRequest,
  ModeResponse,
  StatusResponse,
  SettingsRequest,
  SettingsResponse,
  ActionResponse,
  ErrorResponse,
  RelayOpenRequest,
  RelayStatusResponse,
  HistoryListParams,
  HistoryListResponse,
  HistoryStatsParams,
  HistoryStatsResponse,
  SequenceRemoveRelayResponse,
} from './types';
import { ApiError } from './types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function buildQueryString(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

// Generic fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorResponse: ErrorResponse | undefined;

    try {
      errorResponse = await response.json() as ErrorResponse;
      errorMessage = errorResponse.detail || errorMessage;
    } catch {
      // If JSON parsing fails, use the default error message
    }

    throw new ApiError(errorMessage, response.status, errorResponse);
  }

  return response.json();
}

// API Client functions
export const apiClient = {
  // GET / - Get API information
  async getApiInfo(): Promise<ApiInfoResponse> {
    return apiRequest<ApiInfoResponse>('/');
  },

  // GET /mode - Get current mode
  async getCurrentMode(): Promise<ModeResponse> {
    return apiRequest<ModeResponse>('/mode');
  },

  // POST /mode - Set new mode
  async setCurrentMode(data: ModeRequest): Promise<ModeResponse> {
    return apiRequest<ModeResponse>('/mode', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // GET /status - Get current status
  async getCurrentStatus(): Promise<StatusResponse> {
    return apiRequest<StatusResponse>('/status');
  },

  // DELETE /sequence/relay/{relay_id} - Remove relay from current sequence
  async removeRelayFromSequence(relayId: number): Promise<SequenceRemoveRelayResponse> {
    return apiRequest<SequenceRemoveRelayResponse>(`/sequence/relay/${relayId}`, {
      method: 'DELETE',
    });
  },

  // POST /pause - Pause system
  async pauseSystem(): Promise<ActionResponse> {
    return apiRequest<ActionResponse>('/pause', {
      method: 'POST',
    });
  },

  // POST /resume - Resume system
  async resumeSystem(): Promise<ActionResponse> {
    return apiRequest<ActionResponse>('/resume', {
      method: 'POST',
    });
  },

  // POST /reset - Reset system
  async resetSystem(): Promise<ActionResponse> {
    return apiRequest<ActionResponse>('/reset', {
      method: 'POST',
    });
  },

  // POST /start - Start sequence (SEMI_AUTO mode only)
  async startSystem(): Promise<ActionResponse> {
    return apiRequest<ActionResponse>('/start', {
      method: 'POST',
    });
  },

  // POST /relay/open - Open a single relay (MANUAL mode only)
  async openRelay(data: RelayOpenRequest): Promise<RelayStatusResponse> {
    return apiRequest<RelayStatusResponse>('/relay/open', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // POST /relay/close - Close all relays (MANUAL mode only)
  async closeRelays(): Promise<RelayStatusResponse> {
    return apiRequest<RelayStatusResponse>('/relay/close', {
      method: 'POST',
    });
  },

  // GET /relays - Get current per-relay status (any mode)
  async getRelaysStatus(): Promise<RelayStatusResponse> {
    return apiRequest<RelayStatusResponse>('/relays');
  },

  // GET /settings - Get current settings
  async getCurrentSettings(): Promise<SettingsResponse> {
    return apiRequest<SettingsResponse>('/settings');
  },

  // POST /settings - Update settings
  async updateSettings(data: SettingsRequest): Promise<SettingsResponse> {
    return apiRequest<SettingsResponse>('/settings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // GET /history - Paginated list of relay activity
  async getHistory(params: HistoryListParams = {}): Promise<HistoryListResponse> {
    const qs = buildQueryString({
      page: params.page,
      page_size: params.page_size,
      relay_id: params.relay_id,
      start: params.start,
      end: params.end,
    });
    return apiRequest<HistoryListResponse>(`/history${qs}`);
  },

  // GET /history/stats - Aggregate stats for a month or year
  async getHistoryStats(params: HistoryStatsParams): Promise<HistoryStatsResponse> {
    const qs = buildQueryString({
      period: params.period,
      year: params.year,
      month: params.month,
    });
    return apiRequest<HistoryStatsResponse>(`/history/stats${qs}`);
  },
};

