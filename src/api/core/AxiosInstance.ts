import axios, { AxiosInstance, HttpStatusCode, InternalAxiosRequestConfig } from 'axios';
import { errorService } from '../../services/error.service';

export type ApiError = {
  status: HttpStatusCode;
  message: string;
};

const instance: AxiosInstance = axios.create();

instance.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  let token = null;
  const activeProfileId = localStorage.getItem('active_profile_id');
  const storedProfiles = localStorage.getItem('user_profiles');

  if (activeProfileId && storedProfiles) {
    try {
      interface StoredProfile {
        userPk: number;
        token: string;
      }

      const profiles = JSON.parse(storedProfiles) as StoredProfile[];
      const activeProfile = profiles.find(p => p.userPk.toString() === activeProfileId);

      if (activeProfile && activeProfile.token) {
        token = activeProfile.token;
      }
    } catch (error) {
      console.error('Error parsing profiles in axios interceptor:', error);
    }
  }

  if (!token) {
    token = localStorage.getItem('token');
  }

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
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      localStorage.removeItem('token');
      localStorage.removeItem('user_profiles');
      localStorage.removeItem('active_profile_id');
      window.location.href = '/login';
    }

    const errorResponse = error.response?.data as ApiError;

    if (errorResponse) {
      errorService.handleError(error);
    }
    return Promise.reject(error);
  }
);

export default instance;
