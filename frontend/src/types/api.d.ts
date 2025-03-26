export interface ApiError {
    message: string;
    statusCode?: number;
    errors?: Record<string, string[]>;
    timestamp?: string;
  }
  
  export interface ApiResponse<T> {
    data?: T;
    error?: ApiError;
    status: number;
  }
  
  export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }