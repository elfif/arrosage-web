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
    'POST /start': string;
    'POST /relay/open': string;
    'POST /relay/close': string;
    'GET /relays': string;
    'GET /settings': string;
    'POST /settings': string;
    'GET /history': string;
    'GET /history/stats': string;
  };
}

export interface RelayOpenRequest {
  relay_id: number; // 0-7
}

export interface RelayState {
  relay_id: number; // 0-7
  is_open: boolean;
}

export interface RelayStatusResponse {
  success: boolean;
  message: string;
  current_mode: Mode | null;
  relays: RelayState[]; // length 8, ordered 0..7
}

// History types

export type HistoryMode = 'auto' | 'semi_auto' | 'manual';

export interface RelayActivityItem {
  id: number;
  relay_id: number; // 0-7
  opened_at: number; // Unix seconds (UTC)
  duration_s: number;
  mode: HistoryMode;
}

export interface HistoryListParams {
  page?: number;
  page_size?: number;
  relay_id?: number;
  start?: number; // Unix seconds (inclusive)
  end?: number; // Unix seconds (exclusive)
}

export interface HistoryListResponse {
  items: RelayActivityItem[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export type HistoryStatsPeriod = 'month' | 'year';

export interface HistoryStatsParams {
  period: HistoryStatsPeriod;
  year: number;
  month?: number; // required when period='month'
}

export interface RelayStat {
  relay_id: number; // 0-7
  total_duration_s: number;
  count: number;
}

export interface HistoryStatsResponse {
  period: HistoryStatsPeriod;
  year: number;
  month?: number | null;
  start_at: number; // Unix seconds
  end_at: number; // Unix seconds
  total_duration_s: number;
  total_count: number;
  per_relay: RelayStat[]; // length 8, relay_id 0..7
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

