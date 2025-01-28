'use client';
import { useState, useCallback } from 'react';
import { ApiResponse, ApiStatus } from '../types/api.types';
import { AxiosError } from 'axios';
// import { errorService } from '../services/error.service';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  initialData?: T;
  showErrorToast?: boolean;
}

export function useApi<T>(initialData?: T) {
  const [status, setStatus] = useState<ApiStatus>({
    isLoading: false,
    error: null,
    success: false,
  });
  const [data, setData] = useState<T | undefined>(initialData);

  const execute = useCallback(async <R = T>(apiCall: () => Promise<ApiResponse<R>>, options?: UseApiOptions<R>) => {
    try {
      setStatus({ isLoading: true, error: null, success: false });
      const response = await apiCall();
      setData(response.data as unknown as T);
      setStatus({ isLoading: false, error: null, success: true });
      options?.onSuccess?.(response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        // Let errorService handle the error display if not disabled
        // if (options?.showErrorToast !== false) {
        //   errorService.handleError(error);
        // }

        const errorMessage = error.response?.data?.message || error.message;
        setStatus({ isLoading: false, error: errorMessage, success: false });
        options?.onError?.(errorMessage);
      } else {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setStatus({ isLoading: false, error: errorMessage, success: false });
        options?.onError?.(errorMessage);

        // if (options?.showErrorToast !== false) {
        //   errorService.handleError(new Error(errorMessage));
        // }
      }
      throw error;
    }
  }, []);

  return {
    ...status,
    data,
    execute,
    setData,
  };
}
