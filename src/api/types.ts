// TypeScript types generated from OpenAPI spec

// Enums
export type Mode = 'manual' | 'auto' | 'semi_auto' | 'pause';

// Request types
export interface ModeRequest {
  mode: Mode;
}

export interface SettingsRequest {
  start_at: string; // HH:MM format (24-hour)
  sequence: number[]; // Array of 8 duration values in seconds for each relay (0-7)
  schedule: boolean[]; // Array of 7 boolean values for each day of the week (Monday=0, Sunday=6)
}

// Response types
export interface ModeResponse {
  current: Mode;
  valid_modes: Mode[];
}

export interface SequenceStatus {
  opened_relay: number; // 0-7
  opened_at: number; // Unix timestamp
  should_close_at: number; // Unix timestamp
}

export interface StatusResponse {
  status: SequenceStatus | null;
  has_active_sequence: boolean;
}

export interface SettingsResponse {
  start_at: string; // HH:MM format (24-hour)
  sequence: number[]; // Array of 8 duration values in seconds for each relay (0-7)
  schedule: boolean[]; // Array of 7 boolean values for each day of the week (Monday=0, Sunday=6)
}

export interface ActionResponse {
  success: boolean;
  message: string;
  current_mode: Mode | null;
}

export interface ErrorResponse {
  detail: string;
}

export interface ApiInfoResponse {
  message: string;
  version: string;
  endpoints: {
    'GET /mode': string;
    'POST /mode': string;
    'GET /status': string;
    'POST /pause': string;
    'POST /resume': string;
    'POST /reset': string;
    'GET /settings': string;
    'POST /settings': string;
  };
}

// API Error type for better error handling
export class ApiError extends Error {
  status: number;
  response?: ErrorResponse;

  constructor(
    message: string,
    status: number,
    response?: ErrorResponse
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

