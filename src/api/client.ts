import type {
  ApiInfoResponse,
  ModeRequest,
  ModeResponse,
  StatusResponse,
  SettingsRequest,
  SettingsResponse,
  ActionResponse,
  ErrorResponse,
} from './types';
import { ApiError } from './types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
};

