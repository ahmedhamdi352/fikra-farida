'use client';

import { AxiosError } from 'axios';
import { ApiError } from '../types/api.types';
import { toast, ToastOptions } from 'react-toastify';

interface ValidationErrors {
  [key: string]: string[];
}

interface ApiErrorResponse extends Omit<ApiError, 'errors'> {
  errors?: ValidationErrors;
}

export enum ErrorType {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN',
}

interface ErrorConfig {
  type: ErrorType;
  messageKey: string;
  error?: AxiosError<ApiErrorResponse>;
  action?: () => void;
  toastOptions?: Partial<ToastOptions>;
}

const defaultToastOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
};

export class ErrorService {
  private static instance: ErrorService;

  private constructor() {}

  public static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  private getErrorConfig(error: AxiosError<ApiErrorResponse> | Error): ErrorConfig {
    // Handle network errors or no response
    if (error instanceof Error && error.message === 'Network Error') {
      return {
        type: ErrorType.NETWORK_ERROR,
        messageKey: 'errors.network',
        // toastOptions: { autoClose: false },
      };
    }

    if (error instanceof AxiosError && !error.response) {
      return {
        type: ErrorType.NETWORK_ERROR,
        messageKey: 'errors.network',
        // toastOptions: { autoClose: false },
      };
    }

    if (error instanceof AxiosError && error.response?.data?.errors) {
      return {
        type: ErrorType.VALIDATION,
        messageKey: 'errors.validation',
        error,
        toastOptions: {
          autoClose: 7000, // Give more time to read validation errors
        },
      };
    }

    if (!(error instanceof AxiosError)) {
      return {
        type: ErrorType.UNKNOWN,
        messageKey: 'errors.unknown',
      };
    }

    switch (error.response?.status) {
      case 401:
        return {
          type: ErrorType.AUTHENTICATION,
          messageKey: 'errors.authentication',
          action: () => {
            localStorage.removeItem('token');
            // You can add redirect to login here
            window.location.href = '/auth/login';
          },
        };

      case 403:
        return {
          type: ErrorType.AUTHORIZATION,
          messageKey: 'errors.authorization',
        };

      case 404:
        return {
          type: ErrorType.NOT_FOUND,
          messageKey: 'errors.notFound',
        };

      case 422:
        return {
          type: ErrorType.VALIDATION,
          messageKey: 'errors.validation',
        };

      case 500:
        return {
          type: ErrorType.SERVER_ERROR,
          messageKey: 'errors.server',
          // toastOptions: { autoClose: false },
        };

      default:
        return {
          type: ErrorType.UNKNOWN,
          messageKey: 'errors.unknown',
        };
    }
  }

  private getErrorMessage(errorConfig: ErrorConfig): string {
    // Use API error message if available
    if (errorConfig.error?.response?.data?.message) {
      return errorConfig.error.response.data.message;
    }

    // If there are validation errors, use the first one
    if (errorConfig.error?.response?.data?.errors) {
      const errors = errorConfig.error.response.data.errors;
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey && errors[firstErrorKey].length > 0) {
        return errors[firstErrorKey][0];
      }
    }

    // Default English messages
    const defaultMessages: Record<ErrorType, string> = {
      [ErrorType.AUTHENTICATION]: 'Your session has expired. Please login again.',
      [ErrorType.AUTHORIZATION]: 'You do not have permission to perform this action.',
      [ErrorType.VALIDATION]: 'Please check your input and try again.',
      [ErrorType.NOT_FOUND]: 'The requested resource was not found.',
      [ErrorType.SERVER_ERROR]: 'An internal server error occurred. Please try again later.',
      [ErrorType.NETWORK_ERROR]: 'Unable to connect to the server. Please check your internet connection.',
      [ErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again.',
    };

    return defaultMessages[errorConfig.type];
  }

  public handleError(error: AxiosError<ApiErrorResponse> | Error): void {
    const errorConfig = this.getErrorConfig(error);
    const message = this.getErrorMessage(errorConfig);

    toast.error(message, {
      ...defaultToastOptions,
      ...errorConfig.toastOptions,
    });

    if (errorConfig.action) {
      errorConfig.action();
    }
  }
}

export const errorService = ErrorService.getInstance();
