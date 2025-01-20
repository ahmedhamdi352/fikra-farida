// Generic API Response type
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

// Error Response type
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
  timestamp?: string;
  path?: string;
}

// Pagination type
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Common response types
export interface TokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// API Status type
export interface ApiStatus {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}
