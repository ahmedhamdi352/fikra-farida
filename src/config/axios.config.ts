'use client';

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError } from '../types/api.types';
import { errorService } from '../services/error.service';

// Define base API configuration
const baseConfig: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.your-domain.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create axios instance
const axiosInstance: AxiosInstance = axios.create(baseConfig);

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Get token from localStorage or any other storage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError<ApiError>) => {
    errorService.handleError(error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    errorService.handleError(error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
