import axiosInstance from '../config/axios.config';
import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { AxiosError } from 'axios';
import { errorService } from '../services/error.service';

// Request payload types
export interface RequestParams {
  [key: string]: string | number | boolean | undefined;
}

class ApiService {
  private static instance: ApiService;

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private async request<T>(method: string, url: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const config = {
        method,
        url,
        ...(method === 'GET' ? { params: data } : { data }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };

      const response = await axiosInstance(config);

      // Return the response data directly as it already matches our ApiResponse structure
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      if (error instanceof AxiosError) {
        const apiError = error.response?.data || {
          sucess: false,
          errorcode: error.response?.status || 500,
          message: error.message,
        };
        return apiError;
      }
      return {
        sucess: false,
        errorcode: 500,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  // Generic GET request
  public async get<T>(url: string, params?: RequestParams): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, params);
  }

  // Generic POST request
  public async post<T, D = unknown>(url: string, data: D): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data);
  }

  // Generic PUT request
  public async put<T, D = unknown>(url: string, data: D): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data);
  }

  // Generic DELETE request
  public async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url);
  }

  // Generic paginated GET request
  public async getPaginated<T>(
    url: string,
    page: number,
    limit: number,
    params?: RequestParams
  ): Promise<PaginatedResponse<T>> {
    try {
      const response = await axiosInstance.get<PaginatedResponse<T>>(url, {
        params: {
          ...params,
          page,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        errorService.handleError(error);
        throw error;
      }
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = ApiService.getInstance();

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ForgetData {
  email: string;
  redirectUrl: string;
}

interface UserData {
  email: string;
  password: string;
  name: string;
}

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteData {
  name: string;
  code: string;
  domain: string;
  currency: string;
  siteLogo: string;
  siteName: string;
  contactLocation: string;
  contactEmail: string;
  contactPhone: string;
  contactFacebook: string;
  contactWhatsapp: string;
  contactTiktok: string;
  contactInstagram: string;
  contactX: string | null;
  contactSnapchat: string | null;
  connectUser1: string | null;
  connectUser2: string | null;
  reviewMedia1: string | null;
  reviewMedia2: string | null;
  reviewMedia3: string | null;
  reviewMedia4: string | null;
  reviewMedia5: string | null;
  updateDate: string;
  siteNews: string | null;
}

export interface LoginResponse {
  token: string;
  expire_date: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiService.post<LoginResponse, LoginCredentials>('/endpoint/api/Auth/login', credentials),
  forgetPassword: (forgetData: ForgetData) =>
    apiService.post<{ token: string }, ForgetData>('/endpoint/api/Account/ResetPassword', forgetData),
  register: (userData: UserData) => apiService.post<{ userId: string }, UserData>('/auth/register', userData),
  refreshToken: (token: string) => apiService.post<{ token: string }, { token: string }>('/auth/refresh', { token }),
};

export const userApi = {
  getProfile: () => apiService.get<UserProfile>('/user/profile'),
  updateProfile: (userData: Partial<UserProfile>) =>
    apiService.put<UserProfile, Partial<UserProfile>>('/user/profile', userData),
};

export const siteApi = {
  getSiteData: (countryCode: string, domain: string) =>
    apiService.get<SiteData>(`/api/Store/SiteData`, { CountryCode: countryCode, domain }),
};
