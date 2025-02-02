// Generic API Response type
export interface ApiResponse<T> {
  sucess: boolean;
  errorcode: number;
  message: string;
  data?: T;
  token?: string;
  expire_date?: string;
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

// API Status type
export interface ApiStatus {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}
