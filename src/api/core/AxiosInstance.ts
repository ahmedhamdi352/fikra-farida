import axios, { AxiosInstance, HttpStatusCode, InternalAxiosRequestConfig } from 'axios';
import { errorService } from '../../services/error.service';

export type ApiError = {
  status: HttpStatusCode;
  message: string;
};

const instance: AxiosInstance = axios.create();

instance.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['token'] = token;
  }

  const storedConfig = localStorage.getItem('config');
  const parsedConfig = storedConfig ? JSON.parse(storedConfig) : {};
  config.headers['Accept-Language'] = parsedConfig?.i18n || 'en';
  return config;
});

instance.interceptors.response.use(
  response => response,
  async error => {
    // Check if the error is due to token expiration
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = '/login';
    }

    // Handle other errors
    const errorResponse = error.response?.data as ApiError;

    if (errorResponse) {
      errorService.handleError(error);
    }
    return Promise.reject(error);
  }
);

export default instance;
